from constructs import Construct
import aws_cdk as cdk
from aws_cdk import (
    aws_cognito as cognito,
    aws_ses as ses,
)

# After building the library with `npx projen package`, install python dist:
#   pip install ../../dist/python/cognito_ses_domain-<version>.tar.gz
# Then import the construct below.
from cognito_ses_domain import SesDomainIdentity
from ses_cloudwatch import SesCloudWatchProps

class ExampleStack(cdk.Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        user_pool = cognito.UserPool(self, "UserPool")
        client = user_pool.add_client("UserPoolClient")

        SesDomainIdentity(
            self,
            "SesDomainIdentityExample",
            domain="playground.amer.merapar.net",  # must exist in your Route53 hosted zones when deploying
            user_pool=user_pool,
            user_pool_client_id=client.user_pool_client_id,
            # create_identity_pool=True,  # Uncomment to provision Identity Pool & role
            sending_logs=SesCloudWatchProps(
                configuration_set_name="python-example-conf-set",
                log_group_name="python-example-log-group",
                event_rule_name="python-example-event-rule",
                events=[ses.EmailSendingEvent.SEND, ses.EmailSendingEvent.DELIVERY],
            )
        )
