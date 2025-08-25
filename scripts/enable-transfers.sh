#!/usr/bin/env bash

# enables transfers between one chain and another, and maps
# the token address between the two chains
set -euo pipefail

if [ "$#" -ne "2" ]; then
  echo "Usage: $0 <src-chain-id> <dest-chain-id>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:$1
RUSD_ADDRESS=$(jq -r '.transactions | .[] | select(.contractName=="ERC20FaucetToken") | .contractAddress' $SCRIPT_DIR/../onlysubs-solidity/broadcast/DeployAllContracts.s.sol/$1/run-latest.json)
ROUTER_ADDRESS=$(jq -r '.transactions | .[] | select(.contractName=="Router") | .contractAddress' $SCRIPT_DIR/../onlysubs-solidity/broadcast/DeployAllContracts.s.sol/$1/run-latest.json)
echo "RUSD_ADDRESS IS $RUSD_ADDRESS"
echo "ROUTER_ADDRESS IS $ROUTER_ADDRESS"

# enables transfers from one chain to another
echo "[+] enabling transfers from chain $1 to chain $2"
cast send "$ROUTER_ADDRESS" "permitDestinationChainId(uint256)" "$2" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" > /dev/null

# enables transfers for the default RUSD ERC-20 token address
echo "[+] enabling token for $1"
cast send "$ROUTER_ADDRESS" "setTokenMapping(uint256, address, address)" "$2" "$RUSD_ADDRESS" "$RUSD_ADDRESS" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" > /dev/null
