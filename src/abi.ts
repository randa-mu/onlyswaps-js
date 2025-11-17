// if you're getting errors when you add stuff here, make sure that:// - you're JUST included the contents of the `abi` key and not the whole json compiler output// - you've added `as const` at the end of the ABI
export const ROUTER_ABI = [{
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "blsValidator", "type": "address" }],
    "name": "BLSValidatorUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint256", "name": "chainId", "type": "uint256" }],
    "name": "DestinationChainIdBlocked",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint256", "name": "chainId", "type": "uint256" }],
    "name": "DestinationChainIdPermitted",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint32", "name": "newGasForCallExactCheck", "type": "uint32" }],
    "name": "GasForCallExactCheckSet",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "address", "name": "newHookExecutor", "type": "address" }],
    "name": "HookExecutorUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "newPermit2Relayer", "type": "address" }],
    "name": "Permit2RelayerUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "name": "SolverPayoutFulfilled",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
    }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "initiatedAt",
        "type": "uint256"
    }],
    "name": "SwapRequestCancellationStaged",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "newSwapRequestCancellationWindow",
        "type": "uint256"
    }],
    "name": "SwapRequestCancellationWindowUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
    }, { "indexed": true, "internalType": "uint256", "name": "srcChainId", "type": "uint256" }, {
        "indexed": true,
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }],
    "name": "SwapRequestFulfilled",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
    }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "SwapRequestRefundClaimed",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "name": "SwapRequestSolverFeeUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
    }, { "indexed": true, "internalType": "uint256", "name": "srcChainId", "type": "uint256" }, {
        "indexed": true,
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }],
    "name": "SwapRequested",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }, { "indexed": false, "internalType": "address", "name": "dstToken", "type": "address" }, {
        "indexed": false,
        "internalType": "address",
        "name": "srcToken",
        "type": "address"
    }],
    "name": "TokenMappingAdded",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }, { "indexed": false, "internalType": "address", "name": "dstToken", "type": "address" }, {
        "indexed": false,
        "internalType": "address",
        "name": "srcToken",
        "type": "address"
    }],
    "name": "TokenMappingRemoved",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFeeBps", "type": "uint256" }],
    "name": "VerificationFeeBpsUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "token", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, { "indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
    "name": "VerificationFeeWithdrawn",
    "type": "event"
}, {
    "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }],
    "name": "blockDestinationChainId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
        "internalType": "address",
        "name": "refundRecipient",
        "type": "address"
    }], "name": "cancelSwapRequestAndRefund", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{ "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "cancelUpgrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "executeUpgrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }],
    "name": "getAllowedDstChainId",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getCancelledSwapRequests",
    "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getContractUpgradeBlsValidator",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getFulfilledSolverRefunds",
    "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getFulfilledTransfers",
    "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getMinimumContractUpgradeDelay",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getSwapRequestBlsValidator",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "components": [{ "internalType": "address", "name": "sender", "type": "address" }, {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        }, { "internalType": "address", "name": "tokenIn", "type": "address" }, {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
        }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "srcChainId", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "dstChainId",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "verificationFee", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "solverFee",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, {
            "internalType": "bool",
            "name": "executed",
            "type": "bool"
        }, {
            "internalType": "uint256",
            "name": "requestedAt",
            "type": "uint256"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "preHooks", "type": "tuple[]"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "postHooks", "type": "tuple[]"
        }], "internalType": "struct IRouter.SwapRequestParametersWithHooks", "name": "p", "type": "tuple"
    }],
    "name": "getSwapRequestId",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "name": "getSwapRequestParameters",
    "outputs": [{
        "components": [{ "internalType": "address", "name": "sender", "type": "address" }, {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        }, { "internalType": "address", "name": "tokenIn", "type": "address" }, {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
        }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "srcChainId", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "dstChainId",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "verificationFee", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "solverFee",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, {
            "internalType": "bool",
            "name": "executed",
            "type": "bool"
        }, {
            "internalType": "uint256",
            "name": "requestedAt",
            "type": "uint256"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "preHooks", "type": "tuple[]"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "postHooks", "type": "tuple[]"
        }],
        "internalType": "struct IRouter.SwapRequestParametersWithHooks",
        "name": "swapRequestParamsWithHooks",
        "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "bytes32", "name": "_requestId", "type": "bytes32" }],
    "name": "getSwapRequestReceipt",
    "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
        "internalType": "uint256",
        "name": "srcChainId",
        "type": "uint256"
    }, { "internalType": "uint256", "name": "dstChainId", "type": "uint256" }, {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
    }, { "internalType": "address", "name": "tokenOut", "type": "address" }, {
        "internalType": "bool",
        "name": "fulfilled",
        "type": "bool"
    }, { "internalType": "address", "name": "solver", "type": "address" }, {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "fulfilledAt",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "srcToken", "type": "address" }, {
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }],
    "name": "getTokenMapping",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "getTotalVerificationFeeBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getUnfulfilledSolverRefunds",
    "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "uint256", "name": "amountToSwap", "type": "uint256" }],
    "name": "getVerificationFeeAmount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getVerificationFeeBps",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getVersion",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "srcToken", "type": "address" }, {
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }, { "internalType": "address", "name": "dstToken", "type": "address" }],
    "name": "isDstTokenMapped",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }],
    "name": "permitDestinationChainId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "solver", "type": "address" }, {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
    }, { "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "rebalanceSolver",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "solverRefundAddress",
        "type": "address"
    }, { "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
        "internalType": "address",
        "name": "sender",
        "type": "address"
    }, { "internalType": "address", "name": "recipient", "type": "address" }, {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
    }, { "internalType": "address", "name": "tokenOut", "type": "address" }, {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, { "internalType": "uint256", "name": "srcChainId", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
    }, {
        "components": [{ "internalType": "address", "name": "target", "type": "address" }, {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
        }, { "internalType": "uint256", "name": "gasLimit", "type": "uint256" }],
        "internalType": "struct Hook[]",
        "name": "preHooks",
        "type": "tuple[]"
    }, {
        "components": [{ "internalType": "address", "name": "target", "type": "address" }, {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
        }, { "internalType": "uint256", "name": "gasLimit", "type": "uint256" }],
        "internalType": "struct Hook[]",
        "name": "postHooks",
        "type": "tuple[]"
    }], "name": "relayTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "components": [{ "internalType": "address", "name": "solver", "type": "address" }, {
            "internalType": "address",
            "name": "solverRefundAddress",
            "type": "address"
        }, { "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
            "internalType": "address",
            "name": "sender",
            "type": "address"
        }, { "internalType": "address", "name": "recipient", "type": "address" }, {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
        }, { "internalType": "address", "name": "tokenOut", "type": "address" }, {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "srcChainId", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "permitNonce", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "permitDeadline",
            "type": "uint256"
        }, {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "preHooks", "type": "tuple[]"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "postHooks", "type": "tuple[]"
        }], "internalType": "struct IRouter.RelayTokensPermit2Params", "name": "params", "type": "tuple"
    }], "name": "relayTokensPermit2", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{ "internalType": "uint256", "name": "dstChainId", "type": "uint256" }, {
        "internalType": "address",
        "name": "dstToken",
        "type": "address"
    }, { "internalType": "address", "name": "srcToken", "type": "address" }],
    "name": "removeTokenMapping",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
    }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, { "internalType": "uint256", "name": "fee", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }, { "internalType": "address", "name": "recipient", "type": "address" }],
    "name": "requestCrossChainSwap",
    "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "components": [{
            "internalType": "address",
            "name": "requester",
            "type": "address"
        }, { "internalType": "address", "name": "tokenIn", "type": "address" }, {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
        }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "solverFee", "type": "uint256" }, {
            "internalType": "uint256",
            "name": "dstChainId",
            "type": "uint256"
        }, { "internalType": "address", "name": "recipient", "type": "address" }, {
            "internalType": "uint256",
            "name": "permitNonce",
            "type": "uint256"
        }, { "internalType": "uint256", "name": "permitDeadline", "type": "uint256" }, {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "preHooks", "type": "tuple[]"
        }, {
            "components": [{
                "internalType": "address",
                "name": "target",
                "type": "address"
            }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, {
                "internalType": "uint256",
                "name": "gasLimit",
                "type": "uint256"
            }], "internalType": "struct Hook[]", "name": "postHooks", "type": "tuple[]"
        }], "internalType": "struct IRouter.RequestCrossChainSwapPermit2Params", "name": "params", "type": "tuple"
    }],
    "name": "requestCrossChainSwapPermit2",
    "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
    }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, { "internalType": "uint256", "name": "fee", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "dstChainId",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "components": [{ "internalType": "address", "name": "target", "type": "address" }, {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
        }, { "internalType": "uint256", "name": "gasLimit", "type": "uint256" }],
        "internalType": "struct Hook[]",
        "name": "preHooks",
        "type": "tuple[]"
    }, {
        "components": [{ "internalType": "address", "name": "target", "type": "address" }, {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
        }, { "internalType": "uint256", "name": "gasLimit", "type": "uint256" }],
        "internalType": "struct Hook[]",
        "name": "postHooks",
        "type": "tuple[]"
    }],
    "name": "requestCrossChainSwapWithHooks",
    "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "_newImplementation",
        "type": "address"
    }, { "internalType": "bytes", "name": "_upgradeCalldata", "type": "bytes" }, {
        "internalType": "uint256",
        "name": "_upgradeTime",
        "type": "uint256"
    }, { "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "scheduleUpgrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "newSwapRequestCancellationWindow",
        "type": "uint256"
    }, { "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "setCancellationWindow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "_contractUpgradeBlsValidator",
        "type": "address"
    }, { "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "setContractUpgradeBlsValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "_minimumContractUpgradeDelay",
        "type": "uint256"
    }, { "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "setMinimumContractUpgradeDelay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "_swapRequestBlsValidator",
        "type": "address"
    }, { "internalType": "bytes", "name": "signature", "type": "bytes" }],
    "name": "setSwapRequestBlsValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "uint256", "name": "dstChainId", "type": "uint256" }, {
        "internalType": "address",
        "name": "dstToken",
        "type": "address"
    }, { "internalType": "address", "name": "srcToken", "type": "address" }],
    "name": "setTokenMapping",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "uint256", "name": "_verificationFeeBps", "type": "uint256" }],
    "name": "setVerificationFeeBps",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }],
    "name": "stageSwapRequestCancellation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
        "internalType": "address",
        "name": "solver",
        "type": "address"
    }],
    "name": "swapRequestParametersToBytes",
    "outputs": [{ "internalType": "bytes", "name": "message", "type": "bytes" }, {
        "internalType": "bytes",
        "name": "messageAsG1Bytes",
        "type": "bytes"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, {
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
    }], "name": "updateSolverFeesIfUnfulfilled", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }], "name": "withdrawVerificationFee", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}] as const
export const FAUCET_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "decimals_",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "faucetAmount_",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "CheckpointUnorderedInsertion",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ECDSAInvalidSignature",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "name": "ECDSAInvalidSignatureLength",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "ECDSAInvalidSignatureS",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "increasedSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cap",
                "type": "uint256"
            }
        ],
        "name": "ERC20ExceededSafeSupply",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "ERC2612ExpiredSignature",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC2612InvalidSigner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "timepoint",
                "type": "uint256"
            },
            {
                "internalType": "uint48",
                "name": "clock",
                "type": "uint48"
            }
        ],
        "name": "ERC5805FutureLookup",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ERC6372InconsistentClock",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "currentNonce",
                "type": "uint256"
            }
        ],
        "name": "InvalidAccountNonce",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidShortString",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "bits",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "SafeCastOverflowedUintDowncast",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "StringTooLong",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "expiry",
                "type": "uint256"
            }
        ],
        "name": "VotesExpiredSignature",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "delegator",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "fromDelegate",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "toDelegate",
                "type": "address"
            }
        ],
        "name": "DelegateChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "previousVotes",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newVotes",
                "type": "uint256"
            }
        ],
        "name": "DelegateVotesChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "EIP712DomainChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "faucetAmount",
                "type": "uint256"
            }
        ],
        "name": "FaucetAmountSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CLOCK_MODE",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DOMAIN_SEPARATOR",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "FAUCET_INTERVAL",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "pos",
                "type": "uint32"
            }
        ],
        "name": "checkpoints",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint48",
                        "name": "_key",
                        "type": "uint48"
                    },
                    {
                        "internalType": "uint208",
                        "name": "_value",
                        "type": "uint208"
                    }
                ],
                "internalType": "struct Checkpoints.Checkpoint208",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "clock",
        "outputs": [
            {
                "internalType": "uint48",
                "name": "",
                "type": "uint48"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "delegatee",
                "type": "address"
            }
        ],
        "name": "delegate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "delegatee",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiry",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "delegateBySig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "delegates",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eip712Domain",
        "outputs": [
            {
                "internalType": "bytes1",
                "name": "fields",
                "type": "bytes1"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "version",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "verifyingContract",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            },
            {
                "internalType": "uint256[]",
                "name": "extensions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "faucetAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "timepoint",
                "type": "uint256"
            }
        ],
        "name": "getPastTotalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timepoint",
                "type": "uint256"
            }
        ],
        "name": "getPastVotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getVotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "lastMint",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "nonces",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "numCheckpoints",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "faucetAmount_",
                "type": "uint256"
            }
        ],
        "name": "setFaucetAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const