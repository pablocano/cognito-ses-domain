import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';
import { SesCloudWatch, SesCloudWatchProps } from 'ses-cloudwatch';

/**
 * Properties for the SesDomainIdentity construct.
 */
export interface SesDomainIdentityProps {
  /**
   * The domain to use for the SES identity.
   * This domain must exist as a public hosted zone in Route 53.
   */
  readonly domain: string;

  /**
   * The Cognito User Pool that will be granted permission to send emails.
   */
  readonly userPool: cognito.IUserPool;

  /**
   * The client ID of the user pool client.
   * This is needed to associate the user pool with the identity pool.
   */
  readonly userPoolClientId: string;

  /**
   * Determines whether to create a Cognito Identity Pool and the associated IAM Role
   * to grant users permission to send emails.
   *
   * Set this to `true` if your application users need to send emails via SES.
   *
   * Set this to `false` if you only need to create the verified SES domain identity,
   * for example, to configure the User Pool's own email settings (e.g., for password resets).
   *
  * @default false
   */
  readonly createIdentityPool?: boolean;

  /**
   * Optional configuration to enable SES sending event logging powered by the `ses-cloudwatch` construct.
   * If provided, a configuration set, EventBridge rule, destination and LogGroup are created.
   * Omit (leave undefined) to disable sending event logs.
   */
  readonly sendingLogs?: SesCloudWatchProps;
}

/**
 * A CDK construct to create an SES domain identity.
 * It can optionally create a Cognito Identity Pool and grant send permissions
 * to a Cognito User Pool.
 */
export class SesDomainIdentity extends Construct {
  /**
   * The ARN of the created SES domain identity.
   */
  public readonly identityArn: string;

  /**
   * The ID of the Cognito Identity Pool.
   * This will only be populated if `createIdentityPool` is true.
   */
  public readonly identityPoolId?: string;

  /** The SesCloudWatch helper construct instance if logging was enabled via `sendingLogs`. */
  public readonly sesCloudWatch?: SesCloudWatch;

  constructor(scope: Construct, id: string, props: SesDomainIdentityProps) {
    super(scope, id);

    // Look up the hosted zone for the provided domain.
    // This serves as a validation that the domain exists in Route 53.
    // If the hosted zone is not found, the CDK deployment will fail.
    route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domain,
      privateZone: false,
    });

    const domainName = props.domain;

    // Optionally enable SES sending event logging to CloudWatch if configuration provided.
    if (props.sendingLogs) {
      this.sesCloudWatch = new SesCloudWatch(this, 'SesSendingEvents', props.sendingLogs);
    }

    // Create the SES domain identity. This is done regardless of the Identity Pool setting.
    // This will automatically create the necessary DNS records in the Route53 hosted zone
    // to verify domain ownership for SES.
    const identity = new ses.EmailIdentity(this, 'DomainIdentity', {
      identity: ses.Identity.domain(domainName),
      // If sending logs are enabled, associate the SES identity with the CloudWatch logging
      configurationSet: this.sesCloudWatch?.configurationSet,
    });
    this.identityArn = identity.emailIdentityArn;

    // Default to false if the property is not provided
    const shouldCreateIdentityPool = props.createIdentityPool ?? false;

    if (shouldCreateIdentityPool) {
      // Create a Cognito Identity Pool to federate identities from the User Pool.
      // This is the standard way to grant AWS resource access to Cognito users.
      const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
        allowUnauthenticatedIdentities: false, // Only allow authenticated users
        cognitoIdentityProviders: [{
          clientId: props.userPoolClientId,
          providerName: `cognito-idp.${cdk.Aws.REGION}.amazonaws.com/${props.userPool.userPoolId}`,
          serverSideTokenCheck: false,
        }],
      });
      this.identityPoolId = identityPool.ref;

      // Create an IAM role that authenticated users from the identity pool will assume.
      const authenticatedRole = new iam.Role(this, 'CognitoAuthenticatedRole', {
        assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
          'StringEquals': { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
          'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
        }, 'sts:AssumeRoleWithWebIdentity'),
      });

      // Create and attach the policy that allows sending emails via SES.
      authenticatedRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:SendEmail',
          'ses:SendRawEmail',
          'ses:SendTemplatedEmail',
        ],
        resources: [
          // This policy grants permission to send from any address on the verified domain.
          `arn:aws:ses:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:identity/${domainName}`,
        ],
      }));

      // Attach the role to the identity pool for authenticated users.
      new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: authenticatedRole.roleArn,
        },
      });

      // Output the Identity Pool ID for reference.
      new cdk.CfnOutput(this, 'IdentityPoolIdOutput', {
        value: this.identityPoolId,
        description: 'ID of the Cognito Identity Pool',
      });
    }

    // Output the created identity ARN for reference in both cases.
    new cdk.CfnOutput(this, 'SesIdentityArnOutput', {
      value: this.identityArn,
      description: 'ARN of the SES Domain Identity',
    });
  }
}
