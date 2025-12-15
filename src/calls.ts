import { Abi, Address, ContractFunctionArgs, ContractFunctionName, encodeFunctionData, erc20Abi, Hex, PublicClient, zeroAddress } from "viem"
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
        functionName: "hookExecutor",
        args: []
    }
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

export function createGetFulfilledTransfersCall(config: OnlySwapsConfig): EncodedCall<typeof ROUTER_ABI, "getFulfilledTransfers"> {
    return {
        address: config.routerAddress,
        abi: ROUTER_ABI,
        functionName: "getFulfilledTransfers",
        args: []
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
 * Validates that an address is a contract (not an EOA) and implements the Aave V3 supply function.
 * 
 * @param publicClient - Public client to query the contract
 * @param aaveV3PoolAddress - Address to validate
 * @throws Error if address is not a contract or doesn't implement the supply function
 */
export async function validateAaveV3Contract(
    publicClient: PublicClient,
    aaveV3PoolAddress: Address
): Promise<void> {
    // Check if address is a contract (has bytecode)
    const bytecode = await publicClient.getBytecode({ address: aaveV3PoolAddress })
    if (!bytecode || bytecode === "0x") {
        throw new Error(`Address ${aaveV3PoolAddress} is not a contract (EOA or no code). Aave V3 Pool must be a deployed contract.`)
    }

    // Check if contract implements the supply function by checking for the function selector in bytecode
    // The function selector for supply(address,uint256,address,uint16) is the first 4 bytes of keccak256("supply(address,uint256,address,uint16)")
    // This is: 0x617ba037 (from AAVE_V3_ABI)
    try {
        // Encode the function call to get the selector
        const supplyFunctionData = encodeFunctionData({
            abi: AAVE_V3_ABI,
            functionName: "supply",
            args: [
                zeroAddress, // dummy asset
                0n, // dummy amount
                zeroAddress, // dummy onBehalfOf
                0 // dummy referralCode
            ]
        })
        
        // Extract the function selector (first 4 bytes after 0x)
        const functionSelector = supplyFunctionData.slice(0, 10) // 0x + 4 bytes = 10 chars
        const selectorBytes = functionSelector.slice(2) // Remove 0x prefix
        
        // Check if the function selector exists in the contract bytecode
        // Convert bytecode to lowercase for case-insensitive comparison
        if (!bytecode.toLowerCase().includes(selectorBytes.toLowerCase())) {
            throw new Error(`Contract at ${aaveV3PoolAddress} does not implement the Aave V3 supply function. Function selector ${functionSelector} not found in contract bytecode.`)
        }
    } catch (error) {
        if (error instanceof Error && error.message.includes("does not implement")) {
            throw error
        }
        throw new Error(`Failed to validate Aave V3 supply function at ${aaveV3PoolAddress}: ${(error as Error).message}`)
    }
}

/**
 * Creates a complete Aave V3 supply hook for use in preHooks or postHooks.
 * This only creates the supply hook - approve hook should be created separately.
 *
 * @param params - Parameters for the Aave V3 supply function
 * @param aaveV3PoolAddress - Target address for Aave V3 Pool contract
 * @param publicClient - Public client to validate the contract address. Validates that the address is a contract and implements the supply function.
 * @param gasLimit - Optional gas limit for the hook. Defaults to 100000.
 * @returns Hook object for Aave V3 supply
 * @throws Error if validation fails
 */
export async function createAaveV3SupplyHook(
    params: AaveV3SupplyParams,
    aaveV3PoolAddress: Address,
    publicClient: PublicClient,
    gasLimit?: bigint
): Promise<Hook> {
    // Validate contract
    await validateAaveV3Contract(publicClient, aaveV3PoolAddress)

    const hookGasLimit = gasLimit ?? 100_000n
    return {
        target: aaveV3PoolAddress,
        callData: createAaveV3SupplyHookCallData(params),
        gasLimit: hookGasLimit,
    }
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
 * @param gasLimit - Optional gas limit for the hook execution. Defaults to 100000.
 * @returns A Hook object ready to use in swap requests
 * 
 * @example
 * ```ts
 * import { createERC20ApproveHook } from 'onlyswaps-js'
 * 
 * // With default gas limit
 * const approveHook = createERC20ApproveHook(
 *   USDT_ADDRESS,        // token address
 *   SPENDER_ADDRESS,     // address to approve
 *   1000n                // amount to approve
 * )
 * 
 * // With custom gas limit
 * const approveHookWithCustomGas = createERC20ApproveHook(
 *   USDT_ADDRESS,
 *   SPENDER_ADDRESS,
 *   1000n,
 *   150_000n             // custom gas limit
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
    gasLimit?: bigint
): Hook {
    const hookGasLimit = gasLimit ?? 100_000n
    return {
        target: tokenAddress,
        callData: createERC20ApproveHookCallData(spender, amount),
        gasLimit: hookGasLimit,
    }
}
