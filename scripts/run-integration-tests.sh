#!/usr/bin/env bash
# spins up an anvil instance using docker compose, deploys the
# contracts to it, does a bit of a initialisation, and then runs
# the javascript integration tests.
# test failures don't exit immediately, they clean up the docker instances first

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[+] spinning up anvil instances"
cd $SCRIPT_DIR/../
docker compose -f docker-compose.integration.yml up -d;
sleep 5;

echo "[+] deploying the contracts"
./scripts/deploy-anvil.sh 31337

echo "[+] running some initialisation for the contracts"
./scripts/enable-transfers.sh 31337 1338

echo "[+] running the test suite"
npm run test
EXIT_CODE=$?;

if [ $EXIT_CODE -ne "0" ]; then
  echo "[-] tests were unsuccessful :<"
fi

echo "[+] tearing down anvil instances"
docker compose -f docker-compose.integration.yml down

exit $EXIT_CODE
