import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { SesDomainIdentity } from 'cognito-ses-domain';
import * as ses from 'aws-cdk-lib/aws-ses';

export class ExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    let domain = 'playground.amer.merapar.net'; // must exist in your Route53 hosted zones when deploying

    // User pool and client
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      removalPolicy: RemovalPolicy.DESTROY,
      email: cognito.UserPoolEmail.withSES({
        fromEmail: 'noreply@playground.amer.merapar.net',
        fromName: 'Playground',
        sesVerifiedDomain: domain,
      }),
    });
    const client = userPool.addClient('UserPoolClient', { generateSecret: false });

    // Demonstrate SES domain identity with sending logs and no identity pool by default
    new SesDomainIdentity(this, 'SesDomainIdentityExample', {
      domain,
      userPool,
      userPoolClientId: client.userPoolClientId,
      // createIdentityPool: true, // uncomment to provision Identity Pool + role
      sendingLogs: {
        configurationSetName: 'example-ses-config-set',
        events: [ses.EmailSendingEvent.SEND, ses.EmailSendingEvent.DELIVERY],
      },
    });
  }
}
