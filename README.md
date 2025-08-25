# onlyswaps-js
![build](https://github.com/randa-mu/onlyswaps-js/actions/workflows/build.yml/badge.svg)

A Typescript client for making swaps using the OnlySwaps protocol and dcipher network.

## Build
`npm run build`

## Test
To run integration tests, you must have **Docker** installed and available in your system's `PATH`.

Check if Docker is installed by running:

```bash
docker --version
```

If this command fails, [install Docker](https://docs.docker.com/get-started/get-docker/) before proceeding.

You can run the integration tests using the convenience bash script: [./scripts/run-integration-tests.sh](./scripts/run-integration-tests.sh).

This script will:

- Spin up a local **Anvil** instance using Docker.
- Deploy the contracts.
- Initialize the contracts.
- Run the integration tests.

## Lint
To check the linting: `npm run lint`

To fix any linter issues: `npm run lint:fix`

## Configuration
Copy the [.env.sample](./.env.sample) file into a file called `.env` and fill in the required config parameters for running tests etc