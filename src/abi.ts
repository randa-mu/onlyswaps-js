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
export const FAUCET_ABI = [{
    "type": "constructor",
    "inputs": [{ "name": "name", "type": "string", "internalType": "string" }, {
        "name": "symbol",
        "type": "string",
        "internalType": "string"
    }, { "name": "decimals_", "type": "uint8", "internalType": "uint8" }, {
        "name": "faucetAmount_",
        "type": "uint256",
        "internalType": "uint256"
    }, { "name": "_owner", "type": "address", "internalType": "address" }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "CLOCK_MODE",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "DOMAIN_SEPARATOR",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "FAUCET_INTERVAL",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "allowance",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, {
        "name": "spender",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "approve",
    "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "burn",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }, {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "checkpoints",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }, {
        "name": "pos",
        "type": "uint32",
        "internalType": "uint32"
    }],
    "outputs": [{
        "name": "",
        "type": "tuple",
        "internalType": "struct Checkpoints.Checkpoint208",
        "components": [{ "name": "_key", "type": "uint48", "internalType": "uint48" }, {
            "name": "_value",
            "type": "uint208",
            "internalType": "uint208"
        }]
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "clock",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint48", "internalType": "uint48" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "delegate",
    "inputs": [{ "name": "delegatee", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "delegateBySig",
    "inputs": [{ "name": "delegatee", "type": "address", "internalType": "address" }, {
        "name": "nonce",
        "type": "uint256",
        "internalType": "uint256"
    }, { "name": "expiry", "type": "uint256", "internalType": "uint256" }, {
        "name": "v",
        "type": "uint8",
        "internalType": "uint8"
    }, { "name": "r", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "delegates",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [{ "name": "fields", "type": "bytes1", "internalType": "bytes1" }, {
        "name": "name",
        "type": "string",
        "internalType": "string"
    }, { "name": "version", "type": "string", "internalType": "string" }, {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
    }, { "name": "verifyingContract", "type": "address", "internalType": "address" }, {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
    }, { "name": "extensions", "type": "uint256[]", "internalType": "uint256[]" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "faucetAmount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getPastTotalSupply",
    "inputs": [{ "name": "timepoint", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getPastVotes",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }, {
        "name": "timepoint",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getVotes",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "lastMint",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "mint",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "nonces",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "numCheckpoints",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint32", "internalType": "uint32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "permit",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, {
        "name": "spender",
        "type": "address",
        "internalType": "address"
    }, { "name": "value", "type": "uint256", "internalType": "uint256" }, {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
    }, { "name": "v", "type": "uint8", "internalType": "uint8" }, {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
    }, { "name": "s", "type": "bytes32", "internalType": "bytes32" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "setFaucetAmount",
    "inputs": [{ "name": "faucetAmount_", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "transfer",
    "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "transferFrom",
    "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, {
        "name": "to",
        "type": "address",
        "internalType": "address"
    }, { "name": "value", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "event",
    "name": "Approval",
    "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "DelegateChanged",
    "inputs": [{
        "name": "delegator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "fromDelegate",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "toDelegate", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "DelegateVotesChanged",
    "inputs": [{
        "name": "delegate",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "previousVotes",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
    }, { "name": "newVotes", "type": "uint256", "indexed": false, "internalType": "uint256" }],
    "anonymous": false
}, { "type": "event", "name": "EIP712DomainChanged", "inputs": [], "anonymous": false }, {
    "type": "event",
    "name": "FaucetAmountSet",
    "inputs": [{ "name": "faucetAmount", "type": "uint256", "indexed": false, "internalType": "uint256" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [{
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "Transfer",
    "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }],
    "anonymous": false
}, { "type": "error", "name": "CheckpointUnorderedInsertion", "inputs": [] }, {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
}, {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [{ "name": "length", "type": "uint256", "internalType": "uint256" }]
}, {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [{ "name": "s", "type": "bytes32", "internalType": "bytes32" }]
}, {
    "type": "error",
    "name": "ERC20ExceededSafeSupply",
    "inputs": [{ "name": "increasedSupply", "type": "uint256", "internalType": "uint256" }, {
        "name": "cap",
        "type": "uint256",
        "internalType": "uint256"
    }]
}, {
    "type": "error",
    "name": "ERC20InsufficientAllowance",
    "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, {
        "name": "allowance",
        "type": "uint256",
        "internalType": "uint256"
    }, { "name": "needed", "type": "uint256", "internalType": "uint256" }]
}, {
    "type": "error",
    "name": "ERC20InsufficientBalance",
    "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
    }, { "name": "needed", "type": "uint256", "internalType": "uint256" }]
}, {
    "type": "error",
    "name": "ERC20InvalidApprover",
    "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "ERC20InvalidReceiver",
    "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "ERC20InvalidSender",
    "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "ERC20InvalidSpender",
    "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "ERC2612ExpiredSignature",
    "inputs": [{ "name": "deadline", "type": "uint256", "internalType": "uint256" }]
}, {
    "type": "error",
    "name": "ERC2612InvalidSigner",
    "inputs": [{ "name": "signer", "type": "address", "internalType": "address" }, {
        "name": "owner",
        "type": "address",
        "internalType": "address"
    }]
}, {
    "type": "error",
    "name": "ERC5805FutureLookup",
    "inputs": [{ "name": "timepoint", "type": "uint256", "internalType": "uint256" }, {
        "name": "clock",
        "type": "uint48",
        "internalType": "uint48"
    }]
}, { "type": "error", "name": "ERC6372InconsistentClock", "inputs": [] }, {
    "type": "error",
    "name": "InvalidAccountNonce",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }, {
        "name": "currentNonce",
        "type": "uint256",
        "internalType": "uint256"
    }]
}, { "type": "error", "name": "InvalidShortString", "inputs": [] }, {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "SafeCastOverflowedUintDowncast",
    "inputs": [{ "name": "bits", "type": "uint8", "internalType": "uint8" }, {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
    }]
}, {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [{ "name": "str", "type": "string", "internalType": "string" }]
}, {
    "type": "error",
    "name": "VotesExpiredSignature",
    "inputs": [{ "name": "expiry", "type": "uint256", "internalType": "uint256" }]
}] as const