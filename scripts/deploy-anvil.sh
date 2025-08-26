#!/usr/bin/env bash
# deploys the contracts from onlysubs-solidity to a locally running anvil instance with
# one of the default private keys

set -euo pipefail

if [ "$#" -ne "1" ]; then
  echo "Usage: $0 <port>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RPC_URL=http://127.0.0.1:$1
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export BLS_PUBLIC_KEY_X0=17445541620214498517833872661220947475697073327136585274784354247720096233162
export BLS_PUBLIC_KEY_X1=18268991875563357240413244408004758684187086817233527689475815128036446189503
export BLS_PUBLIC_KEY_Y0=11401601170172090472795479479864222172123705188644469125048759621824127399516
export BLS_PUBLIC_KEY_Y1=8044854403167346152897273335539146380878155193886184396711544300199836788154

cd $SCRIPT_DIR/../onlysubs-solidity
forge script script/onlyswaps/DeployAllContracts.s.sol:DeployAllContracts --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY --force
