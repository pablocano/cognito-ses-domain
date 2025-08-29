# TypeScript Example

Demonstrates usage of the `cognito-ses-domain` construct.

## Prerequisites

- Route53 public hosted zone for `example.com` (adjust the domain in `example-stack.ts`).
- Bootstrapped CDK environment (`cdk bootstrap`).

## Install & Run

```bash
cd examples/typescript
npm install
npm run synth
# or
npm run deploy
```

## What it does

Creates:

- Cognito User Pool & Client
- SES Domain Identity for the specified domain
- (Optional) SES sending event logging via `ses-cloudwatch` configuration set (enabled in this example)

Uncomment `createIdentityPool: true` in `example-stack.ts` to also provision an Identity Pool + IAM Role permitting SES send actions.
