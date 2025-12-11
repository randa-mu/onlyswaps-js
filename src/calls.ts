import { Abi, Address, ContractFunctionArgs, ContractFunctionName, encodeFunctionData, erc20Abi, Hex } from "viem"
import { FAUCET_ABI, AAVE_V3_ABI, ROUTER_ABI } from "./abi"

import { SwapRequest, type Hook } from "./model"

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

type AllowanceParams = {
    token: Address,
    wallet: Address,
    spender: Address,
}

export function createAllowanceCall(params: AllowanceParams): EncodedCall<typeof erc20Abi, "allowance"> {
    return {
        address: params.token,
        abi: erc20Abi,
        functionName: "allowance",
        args: [params.wallet, params.spender]
    }
}

type ApprovalParams = {
    srcToken: Address,
    approvalAmount: bigint
}
export function createApproveCall(config: OnlySwapsConfig, request: ApprovalParams): EncodedCall<typeof erc20Abi, "approve"> {
    return {
        address: request.srcToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [config.routerAddress, request.approvalAmount]
    }
}

export function createSwapCall(config: OnlySwapsConfig, request: SwapRequest): EncodedCall<typeof ROUTER_ABI, "requestCrossChainSwap"> {
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

export function createSwapCallWithHooks(config: OnlySwapsConfig, request: SwapRequest): EncodedCall<typeof ROUTER_ABI, "requestCrossChainSwapWithHooks"> {
    const preHooks: Hook[] = request.preHooks || []
    const postHooks: Hook[] = request.postHooks || []
    
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "requestCrossChainSwapWithHooks",
        args: [
            request.srcToken,
            request.destToken,
            request.amountIn,
            request.amountOut,
            request.fee,
            request.destChainId,
            request.recipient,
            preHooks,
            postHooks,
        ]
    }
}

export function createGetHookExecutorCall(config: OnlySwapsConfig): EncodedCall<typeof ROUTER_ABI, "hookExecutor"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "hookExecutor" as any,
        args: []
    } as EncodedCall<typeof ROUTER_ABI, "hookExecutor">
}

type GetSwapRequestIdParams = {
    sender: Address,
    recipient: Address,
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint,
    amountOut: bigint,
    srcChainId: bigint,
    dstChainId: bigint,
    verificationFee: bigint,
    solverFee: bigint,
    nonce: bigint,
    executed: boolean,
    requestedAt: bigint,
    preHooks: Hook[],
    postHooks: Hook[]
}

export function createGetSwapRequestIdCall(config: OnlySwapsConfig, params: GetSwapRequestIdParams): EncodedCall<typeof ROUTER_ABI, "getSwapRequestId"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "getSwapRequestId",
        args: [{
            sender: params.sender,
            recipient: params.recipient,
            tokenIn: params.tokenIn,
            tokenOut: params.tokenOut,
            amountIn: params.amountIn,
            amountOut: params.amountOut,
            srcChainId: params.srcChainId,
            dstChainId: params.dstChainId,
            verificationFee: params.verificationFee,
            solverFee: params.solverFee,
            nonce: params.nonce,
            executed: params.executed,
            requestedAt: params.requestedAt,
            preHooks: params.preHooks,
            postHooks: params.postHooks,
        }]
    }
}

type RelayTokensParams = {
    solverRefundAddress: Address,
    requestId: Hex,
    sender: Address,
    recipient: Address,
    tokenIn: Address,
    tokenOut: Address,
    amountOut: bigint,
    srcChainId: bigint,
    nonce: bigint,
    preHooks: Hook[],
    postHooks: Hook[]
}

export function createRelayTokensCall(config: OnlySwapsConfig, params: RelayTokensParams): EncodedCall<typeof ROUTER_ABI, "relayTokens"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "relayTokens",
        args: [
            params.solverRefundAddress,
            params.requestId,
            params.sender,
            params.recipient,
            params.tokenIn,
            params.tokenOut,
            params.amountOut,
            params.srcChainId,
            params.nonce,
            params.preHooks,
            params.postHooks,
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

export type AaveV3SupplyParams = {
    asset: Address,
    amount: bigint,
    onBehalfOf: Address,
    referralCode?: number
}

/**
 * Creates encoded call data for Aave V3 supply function hook.
 * This can be used directly in preHooks or postHooks when creating swap requests.
 * 
 * @param params - Parameters for the Aave V3 supply function
 * @returns Encoded function call data as Hex string
 */
export function createAaveV3SupplyHookCallData(params: AaveV3SupplyParams): Hex {
    return encodeFunctionData({
        abi: AAVE_V3_ABI,
        functionName: "supply",
        args: [
            params.asset,
            params.amount,
            params.onBehalfOf,
            params.referralCode ?? 0
        ]
    })
}

/**
 * Returns an array with two post hooks for Aave V3 supply:
 * 1. ERC20 approve for the AaveV3 Pool contract (uses createERC20ApproveHookCallData).
 * 2. Aave V3 Pool supply call (uses createAaveV3SupplyHookCallData).
 *
 * @param params - Parameters for the supply and approval hook.
 * @param aaveV3PoolAddress - Target address for Aave V3 Pool contract.
 * @param gasLimit - Gas limit for each hook.
 * @returns Array with two hook objects.
 */
export function createAaveV3SupplyHooks(
    params: AaveV3SupplyParams,
    aaveV3PoolAddress: Address,
    gasLimit: bigint = 100_000n
): Hook[] {
    return [
        {
            target: params.asset,
            callData: createERC20ApproveHookCallData(aaveV3PoolAddress, params.amount),
            gasLimit,
        },
        {
            target: aaveV3PoolAddress,
            callData: createAaveV3SupplyHookCallData(params),
            gasLimit,
        }
    ]
}

/**
 * Creates encoded call data for ERC20 approve function hook.
 * This can be used directly in preHooks or postHooks when creating swap requests.
 * 
 * @param spender - Address to approve for spending tokens
 * @param amount - Amount of tokens to approve
 * @returns Encoded function call data as Hex string
 */
export function createERC20ApproveHookCallData(spender: Address, amount: bigint): Hex {
    return encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount]
    })
}

/**
 * Creates a complete ERC20 approve hook for use in preHooks or postHooks.
 * 
 * @param tokenAddress - Address of the ERC20 token to approve
 * @param spender - Address to approve for spending tokens
 * @param amount - Amount of tokens to approve
 * @param gasLimit - Gas limit for the hook execution
 * @returns A Hook object ready to use in swap requests
 * 
 * @example
 * ```ts
 * import { createERC20ApproveHook } from 'onlyswaps-js'
 * 
 * const approveHook = createERC20ApproveHook(
 *   USDT_ADDRESS,        // token address
 *   SPENDER_ADDRESS,     // address to approve
 *   1000n,               // amount to approve
 *   100_000n             // gas limit
 * )
 * 
 * await onlyswaps.swap({
 *   // ... other params
 *   preHooks: [approveHook]
 * })
 * ```
 */
export function createERC20ApproveHook(
    tokenAddress: Address,
    spender: Address,
    amount: bigint,
    gasLimit: bigint = 100_000n
): Hook {
    return {
        target: tokenAddress,
        callData: createERC20ApproveHookCallData(spender, amount),
        gasLimit,
    }
}
