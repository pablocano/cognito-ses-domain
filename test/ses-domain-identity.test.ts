import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ses from 'aws-cdk-lib/aws-ses';
import { SesDomainIdentity } from '../src';

// Mock HostedZone.fromLookup to avoid context provider / network lookups during unit tests.
beforeAll(() => {
  jest.spyOn(route53.HostedZone, 'fromLookup').mockReturnValue({
    hostedZoneId: 'ZFAKEZONE',
    zoneName: 'example.com',
  } as any);
});

describe('SesDomainIdentity', () => {
  const domain = 'example.com';

  const createUserPool = (scope: Stack) => new cognito.UserPool(scope, 'UserPool');
  const createClient = (userPool: cognito.UserPool) => userPool.addClient('Client');

  test('default: creates SES identity only (no identity pool, no logs)', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const userPool = createUserPool(stack);
    const client = createClient(userPool);

    new SesDomainIdentity(stack, 'Subject', {
      domain,
      userPool,
      userPoolClientId: client.userPoolClientId,
      // createIdentityPool omitted => defaults to false
      // sendingLogs omitted
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::SES::EmailIdentity', 1);
    template.resourceCountIs('AWS::Cognito::IdentityPool', 0);
    template.resourceCountIs('AWS::Logs::LogGroup', 0);
  });

  test('with identity pool: creates identity pool, role, and policy', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStackIdentity');

    const userPool = createUserPool(stack);
    const client = createClient(userPool);

    new SesDomainIdentity(stack, 'Subject', {
      domain,
      userPool,
      userPoolClientId: client.userPoolClientId,
      createIdentityPool: true,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Cognito::IdentityPool', 1);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Principal: { Federated: 'cognito-identity.amazonaws.com' },
          }),
        ]),
      }),
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'ses:SendEmail',
              'ses:SendRawEmail',
            ]),
            Effect: 'Allow',
          }),
        ]),
      }),
    });
  });

  test('with sending logs only: creates log group, configuration set and rule', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStackLogs');

    const userPool = createUserPool(stack);
    const client = createClient(userPool);

    new SesDomainIdentity(stack, 'Subject', {
      domain,
      userPool,
      userPoolClientId: client.userPoolClientId,
      sendingLogs: {
        logGroupName: 'my-ses-event-logs',
        configurationSetName: 'my-config-set',
        eventRuleName: 'my-event-rule',
        events: [ses.EmailSendingEvent.SEND, ses.EmailSendingEvent.DELIVERY],
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: 'my-ses-event-logs',
    });
    template.hasResourceProperties('AWS::SES::ConfigurationSet', {
      Name: 'my-config-set',
    });
    // Event rule name may be auto-generated if not explicitly set by construct; just ensure a rule exists.
    template.resourceCountIs('AWS::Events::Rule', 1);
    template.resourceCountIs('AWS::Cognito::IdentityPool', 0); // ensure no identity pool
  });

  test('with identity pool and sending logs together', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStackBoth');

    const userPool = createUserPool(stack);
    const client = createClient(userPool);

    new SesDomainIdentity(stack, 'Subject', {
      domain,
      userPool,
      userPoolClientId: client.userPoolClientId,
      createIdentityPool: true,
      sendingLogs: {
        configurationSetName: 'combined-config',
      },
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Cognito::IdentityPool', 1);
    template.hasResourceProperties('AWS::SES::ConfigurationSet', {
      Name: 'combined-config',
    });
  });
});
