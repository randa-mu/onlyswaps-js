import { Abi, Address, ContractFunctionArgs, ContractFunctionName, erc20Abi, Hex } from "viem"
import { FAUCET_ABI, ROUTER_ABI } from "./abi"
import { SwapParams } from "./parser"

export type EncodedCall<
    TAbi extends Abi,
    TName extends ContractFunctionName<TAbi>
> = {
    address: Address
    abi: TAbi
    functionName: TName
    args: ContractFunctionArgs<TAbi, never, TName>
}

export type OnlySwapsConfig = {
    routerAddress: Hex
}

export function createMintCall(tokenAddress: Address): EncodedCall<typeof FAUCET_ABI, "mint"> {
    return {
        address: tokenAddress,
        abi: FAUCET_ABI,
        functionName: "mint",
        args: []
    }
}

export type BalanceOfParams = {
    token: Address,
    wallet: Address,
}

export function createBalanceOfCall(params: BalanceOfParams): EncodedCall<typeof erc20Abi, "balanceOf"> {
    return {
        address: params.token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [params.wallet]
    }
}

type ApprovalParams = {
    srcToken: Address,
    totalAmount: bigint
}
export function createApproveCall(config: OnlySwapsConfig, request: ApprovalParams): EncodedCall<typeof erc20Abi, "approve"> {
    return {
        address: request.srcToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [config.routerAddress, request.totalAmount]
    }
}

export function createSwapCall(config: OnlySwapsConfig, request: SwapParams): EncodedCall<typeof ROUTER_ABI, "requestCrossChainSwap"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "requestCrossChainSwap",
        args: [
            request.srcToken,
            request.destToken,
            request.amountIn,
            request.amountOut,
            request.fee,
            request.destChainId,
            request.recipient,
        ]
    }
}

type UpdateFeesParams = {
    requestId: Hex,
    fee: bigint
}

export function createUpdateFeesCall(config: OnlySwapsConfig, params: UpdateFeesParams): EncodedCall<typeof ROUTER_ABI, "updateSolverFeesIfUnfulfilled"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "updateSolverFeesIfUnfulfilled",
        args: [params.requestId, params.fee]
    }
}

type GetSwapParams = {
    requestId: Hex,
}

export function createGetSwapParameters(config: OnlySwapsConfig, params: GetSwapParams): EncodedCall<typeof ROUTER_ABI, "getSwapRequestParameters"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "getSwapRequestParameters",
        args: [params.requestId]
    }
}

type GetSwapReceiptParams = {
    requestId: Hex,
}

export function createGetSwapReceipt(config: OnlySwapsConfig, params: GetSwapReceiptParams): EncodedCall<typeof ROUTER_ABI, "getSwapRequestReceipt"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "getSwapRequestReceipt",
        args: [params.requestId]
    }
}
