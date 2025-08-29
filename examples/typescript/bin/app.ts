#!/usr/bin/env ts-node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { ExampleStack } from '../lib/example-stack';

const app = new App();
new ExampleStack(app, 'CognitoSesDomainExampleStack', {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
	},
});
