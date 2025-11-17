# onlyswaps-js
![build](https://github.com/randa-mu/onlyswaps-js/actions/workflows/build.yml/badge.svg)

A Typescript client for making cross-chain token transfers using the [only swaps](https://onlyswaps.dcipher.network) protocol built on the [dcipher network](https://dcipher.network).

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

## Maintenance

### When updating the onlyswaps-solidity submodule
- switch to the latest commit
- compile and add the ABI to [the ABI file](https://github.com/randa-mu/onlyswaps-js/blob/46388be4c9f630142a501441fd20ca27144e1823/src/abi.ts#L5)
- bump the version

## Known Issues

**tsc throws a `Type instantiation is excessively deep and possibly infinite.` error**

This appears to be [an issue in viem](https://github.com/wevm/viem/issues/3726).
The easiest workaround is to update your tsconfig to use the following:

```
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```
