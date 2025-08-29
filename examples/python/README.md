# Python Example

Demonstrates the `cognito-ses-domain` construct usage in Python.

## Build the Library for Python

The construct is authored in TypeScript and published through jsii. To use it locally in this example:

```bash
# From repo root
npm install
npx projen package   # generates dist/python/*.tar.gz
pip install examples/python/requirements.txt  # core CDK deps
pip install dist/python/cognito_ses_domain-*.tar.gz  # install the generated construct
```

## Quick Start (Makefile)

```bash
cd examples/python
make build   # creates venv, installs deps, builds + installs local construct
make synth   # cdk synth
make deploy  # deploys (requires env vars or context)
make test    # run pytest smoke tests
```

Environment variables:

```bash
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=us-east-1
```

## Deploy (manual commands)

```bash
cd examples/python
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=us-east-1
python app.py synth  # or: cdk synth -a "python app.py"
cdk deploy -a "python app.py"
```

You may instead pass context:

```bash
cdk synth -a "python app.py" -c account=123456789012 -c region=us-east-1
```

Ensure the Route53 hosted zone for the chosen domain exists in the target account/region.

## Tests

Minimal smoke test in `tests/test_synth.py` ensures template contains the SES identity. Run (after `make build`):

```bash
source .venv/bin/activate
pytest -q
```

## Modifying the Example

Edit `example_stack.py` and re-run `cdk synth`. Rebuild the library (`npx projen package`) if you change the construct API.
