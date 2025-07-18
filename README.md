# onlyswaps-js
![build](https://github.com/randa-mu/onlyswaps-js/actions/workflows/build.yml/badge.svg)

A Typescript client for making swaps using the OnlySwaps protocol and dcipher network.

## Build
`npm run build`

## Test
In order to run integration tests, you can use the convenience bash script [./scripts/run-integration-tests.sh](./scripts/run-integration-tests.sh).
This will spin up a local anvil instance, deploy the contracts, initialise them, then run the tests.

## Lint
To check the linting: `npm run lint`

To fix any linter issues: `npm run lint:fix`

## Configuration
Copy the [.env.sample](./.env.sample) file into a file called `.env` and fill in the required config parameters for running tests etc