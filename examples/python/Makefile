PYTHON=python3
PIP=$(PYTHON) -m pip
VENV_DIR=.venv
ACTIVATE=. $(VENV_DIR)/bin/activate

.PHONY: help venv deps build synth deploy diff destroy test clean package

help:
	@grep -E '^[a-zA-Z_-]+:.*?##' Makefile | sed -E 's/:.*##/\t/' | sort

venv: ## Create virtual env
	@test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	@$(ACTIVATE) && $(PIP) install --upgrade pip

deps: venv ## Install dependencies (CDK + construct + test tools)
	@$(ACTIVATE) && $(PIP) install -r requirements.txt
	@echo "To install local construct: make package-lib"

package-lib: ## Build JSII python dist for local construct usage
	@(cd ../.. && npx projen package)
	@tarball=$$(ls ../../dist/python/cognito_ses_domain-*.tar.gz | tail -1); \
	$(ACTIVATE) && $(PIP) install $$tarball

build: deps package-lib ## Build (install deps + local construct)

synth: ## CDK synth
	@$(ACTIVATE) && cdk synth

deploy: ## CDK deploy (all stacks)
	@$(ACTIVATE) && cdk deploy --require-approval never

diff: ## CDK diff
	@$(ACTIVATE) && cdk diff

destroy: ## CDK destroy (all stacks)
	@$(ACTIVATE) && cdk destroy --force

test: build ## Run pytest test suite
	@$(ACTIVATE) && pytest -q

clean: ## Remove build artifacts & venv
	rm -rf $(VENV_DIR) cdk.out

package: package-lib ## Alias for building local construct package
