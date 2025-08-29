import os
import aws_cdk as cdk
from cognito_ses_domain_example.example_stack import ExampleStack

# Simple smoke test that the stack synthesizes after local construct install.


def test_stack_synth():
    app = cdk.App()
    stack = ExampleStack(
        app,
        "SynthTestStack",
        env=cdk.Environment(
            account=os.getenv("CDK_DEFAULT_ACCOUNT"),
            region=os.getenv("CDK_DEFAULT_REGION"),
        ),
    )
    assembly = app.synth()
    template = assembly.get_stack_by_name(stack.stack_name).template
    assert "Resources" in template
    assert any(
        r.get("Type") == "AWS::SES::EmailIdentity"
        for r in template.get("Resources", {}).values()
    )
