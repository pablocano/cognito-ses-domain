#!/usr/bin/env python3
import os
import aws_cdk as cdk
from cognito_ses_domain_example.example_stack import ExampleStack

app = cdk.App()

ExampleStack(app, "CognitoSesDomainPythonExampleStack", )

app.synth()
