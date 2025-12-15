import { expect, test } from "@jest/globals"
import { createPublicClient, createWalletClient, http, Address, Hex, keccak256, encodeAbiParameters, parseEventLogs, parseAbi, zeroAddress, parseEther } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { avalancheFuji, baseSepolia, foundry } from "viem/chains"
import {
    AVAX_FUJI,
    BASE_SEPOLIA,
    RouterClient,
    ViemChainBackend,
    FeesRequest,
    fetchRecommendedFees,
    createBalanceOfCall,
    createAllowanceCall,
    createMintCall,
    createAaveV3SupplyHook,
    createERC20ApproveHook,
    createApproveCall,
    validateAaveV3Contract
} from "../src"
import { AAVE_V3_ABI } from "../src/abi"
import type { Hook } from "../src/model"

// foundry automatically signs unsigned transaction from genesis accounts, use a non-genesis wallet to make sure everything is signed properly
// > cast wallet new
// Successfully created new keypair.
// Address:     0x2602A1971CA485EF1026d0a06A30AAB3B847e78A
// Private key: 0xa5bdd3629c86f0dc2ceaacc30482101b77dce8d608a9aeb55aa216fb41c3b301
// account funded with 10 ETH in scripts/deploy-anvil.sh
const MY_ADDRESS: Address = "0x2602A1971CA485EF1026d0a06A30AAB3B847e78A"
const account = privateKeyToAccount("0xa5bdd3629c86f0dc2ceaacc30482101b77dce8d608a9aeb55aa216fb41c3b301")

// Solver account (using default Anvil account #0 for relayTokens testing)
// Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
const SOLVER_ADDRESS: Address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const solverAccount = privateKeyToAccount("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

// Test configuration constants
const RPC_URL = "http://localhost:31337"
const DEFAULT_AMOUNT_IN = 100n
const DEFAULT_AMOUNT_OUT = 100n
const DEFAULT_AMOUNT_TO_APPROVE = 101n
const DEFAULT_FEE = 1n
const UPDATED_FEE = 2n
const DEST_CHAIN_ID = 31338n
const DEFAULT_GAS_LIMIT = 100_000n
const TEST_AMOUNT_1000_ETH = parseEther("1000")
const RUSD_ADDRESS: Address = "0x13a6618E42AFb5b700534535B113eb013B746977"
const ONLYSWAPS_ROUTER_ADDRESS: Address = "0xE16716C8210D8C9e8B8C756e70558d049f8EAcA1"
const PREHOOK_APPROVAL_AMOUNT = 1n

// MockAaveV3 will be deployed fresh for each test that needs it
// MockAaveV3 bytecode (from onlyswaps-solidity/src/mocks/MockAaveV3.sol)
// This should be updated if the contract is recompiled
const MOCK_AAVE_V3_BYTECODE = "0x60808060405234601557610297908161001b8239f35b600080fdfe608080604052600436101561001357600080fd5b60003560e01c63617ba0371461002857600080fd5b3461025c57608036600319011261025c576004356001600160a01b0381169081900361025c576044356001600160a01b03811692602435929184900361025c576064359061ffff821680920361025c57821561022a575082156101f05783156101b6576040516323b872dd60e01b8152336004820152306024820152604481018490526020816064816000875af19081156101aa5760009161013f575b5015610108577fbc1106253c048849439055f47b49a5131462058bb8b62bcf9e7d067df7e54a2493608093604051938452602084015260408301526060820152a1005b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b60203d6020116101a3575b601f8101601f191682016001600160401b0381118382101761018f5760209183916040528101031261018b57519081151582036101885750386100c5565b80fd5b5080fd5b634e487b7160e01b84526041600452602484fd5b503d61014a565b6040513d6000823e3d90fd5b60405162461bcd60e51b815260206004820152601260248201527124b73b30b634b21037b72132b430b63327b360711b6044820152606490fd5b60405162461bcd60e51b81526020600482015260126024820152710416d6f756e74206d757374206265203e20360741b6044820152606490fd5b62461bcd60e51b815260206004820152600d60248201526c125b9d985b1a5908185cdcd95d609a1b6044820152606490fd5b600080fdfea264697066735822122068594191c464ca7ad044d1ce1029237cd5c190ce49cdc2d4468d211f2090673264736f6c634300081e0033" as Hex

const publicClient = createPublicClient({
    chain: foundry,
    transport: http(RPC_URL),
})

const walletClient = createWalletClient({
    chain: foundry,
    transport: http(RPC_URL),
    account,
})

const solverWalletClient = createWalletClient({
    chain: foundry,
    transport: http(RPC_URL),
    account: solverAccount,
})

// Helper functions
async function ensureTokensMinted(
    viemBackend: ViemChainBackend,
    tokenAddress: Address,
    walletAddress: Address
): Promise<void> {
    let balance = await viemBackend.staticCall(
        createBalanceOfCall({ token: tokenAddress, wallet: walletAddress })
    )
    if (balance === 0n) {
        await viemBackend.sendTransaction(createMintCall(tokenAddress), { simulate: true })
        balance = await viemBackend.staticCall(
            createBalanceOfCall({ token: tokenAddress, wallet: walletAddress })
        )
    }
    expect(balance).toBeGreaterThan(0n)
}

// Deploy MockAaveV3 contract
async function deployMockAaveV3(): Promise<Address> {
    // Deploy using deployContract from viem with ABI from abi.ts and bytecode constant
    const hash = await solverWalletClient.deployContract({
        abi: AAVE_V3_ABI,
        bytecode: MOCK_AAVE_V3_BYTECODE,
        account: solverAccount,
        args: [], // MockAaveV3 has no constructor arguments
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    if (!receipt.contractAddress) {
        throw new Error('MockAaveV3 deployment failed: no contract address in receipt')
    }

    return receipt.contractAddress
}

function createTestClients() {
    const viemBackend = new ViemChainBackend(MY_ADDRESS, publicClient, walletClient)
    const onlyswaps = new RouterClient(
        { routerAddress: ONLYSWAPS_ROUTER_ADDRESS },
        viemBackend
    )
    return { viemBackend, onlyswaps }
}

test("mint tokens, request a swap, update the fee, check everything has been updated", async () => {
    const { viemBackend, onlyswaps } = createTestClients()

    await ensureTokensMinted(viemBackend, RUSD_ADDRESS, MY_ADDRESS)

    const { requestId, transactionHash } = await onlyswaps.swap({
        recipient: MY_ADDRESS,
        srcToken: RUSD_ADDRESS,
        destToken: RUSD_ADDRESS,
        amountIn: DEFAULT_AMOUNT_IN,
        amountOut: DEFAULT_AMOUNT_OUT,
        amountToApprove: DEFAULT_AMOUNT_TO_APPROVE,
        fee: DEFAULT_FEE,
        destChainId: DEST_CHAIN_ID
    })

    expect(requestId).not.toBe(undefined)
    expect(transactionHash).not.toBe(undefined)

    const status = await onlyswaps.fetchRequestParams(requestId)
    expect(status.solverFee).toEqual(DEFAULT_FEE)

    await onlyswaps.updateFee(requestId, RUSD_ADDRESS, UPDATED_FEE)
    const statusAfter = await onlyswaps.fetchRequestParams(requestId)
    expect(statusAfter.solverFee).toEqual(UPDATED_FEE)
})

test("can fetch recommended fees from the API", async () => {
    const params: FeesRequest = {
        sourceToken: BASE_SEPOLIA.FUSD_ADDRESS!,
        destinationToken: AVAX_FUJI.RUSD_ADDRESS,
        sourceChainId: BigInt(baseSepolia.id),
        destinationChainId: BigInt(avalancheFuji.id),
        amount: TEST_AMOUNT_1000_ETH
    }
    const result = await fetchRecommendedFees(params)
    expect(result.src.swapFee).toBeGreaterThan(0n)

    expect(result.approvalAmount).toBeGreaterThan(result.transferAmount)
    expect(result.approvalAmount).toBeGreaterThan(result.fees.total)
    expect(result.transferAmount).toBeGreaterThan(result.fees.total)
    expect(result.fees.total).toBeGreaterThan(result.fees.network)
    expect(result.fees.total).toBeGreaterThan(result.fees.solver)
})

test("swap with only preHooks - recipient should not change and preHook should be executed before relay tokens", async () => {
    const { viemBackend, onlyswaps } = createTestClients()

    await ensureTokensMinted(viemBackend, RUSD_ADDRESS, MY_ADDRESS)

    // Before the swap preHook is executed, the allowance of the RUSD token set for test wallet 
    // by hook executor should be 0.
    const hookExecutor = await onlyswaps.getHookExecutor()
    const rusdAllowanceBefore = await viemBackend.staticCall(
        createAllowanceCall({ token: RUSD_ADDRESS, wallet: hookExecutor, spender: MY_ADDRESS })
    )
    expect(rusdAllowanceBefore).toBe(0n)

    const { requestId, transactionHash } = await onlyswaps.swap({
        recipient: MY_ADDRESS,
        srcToken: RUSD_ADDRESS,
        destToken: RUSD_ADDRESS,
        amountIn: DEFAULT_AMOUNT_IN,
        amountOut: DEFAULT_AMOUNT_OUT,
        amountToApprove: DEFAULT_AMOUNT_TO_APPROVE,
        fee: DEFAULT_FEE,
        destChainId: DEST_CHAIN_ID,
        preHooks: [
            createERC20ApproveHook(RUSD_ADDRESS, MY_ADDRESS, PREHOOK_APPROVAL_AMOUNT, DEFAULT_GAS_LIMIT)
        ]
    })

    expect(requestId).not.toBe(undefined)
    expect(transactionHash).not.toBe(undefined)

    // Verify the request was created with hooks
    const requestParams = await onlyswaps.fetchRequestParams(requestId)
    expect(requestParams).toBeDefined()
    
    // Note: The recipient in the request should still be the original recipient
    // since only preHooks were provided (no postHooks)
    expect(requestParams?.recipient).toBe(MY_ADDRESS)

    // After the swap, the allowance of the RUSD token should be PREHOOK_APPROVAL_AMOUNT
    const rusdAllowanceAfter = await viemBackend.staticCall(
        createAllowanceCall({ token: RUSD_ADDRESS, wallet: hookExecutor, spender: MY_ADDRESS })
    )
    expect(rusdAllowanceAfter).toBe(PREHOOK_APPROVAL_AMOUNT)
})

test("swap with only postHooks - recipient must be hook executor on destination chain and postHook should not be executed before relay tokens", async () => {
    // Deploy fresh MockAaveV3 for this test
    const MOCK_AAVE_V3_ADDRESS = await deployMockAaveV3()

    const { viemBackend, onlyswaps } = createTestClients()

    await ensureTokensMinted(viemBackend, RUSD_ADDRESS, MY_ADDRESS)

    // Before the swap, record the initial balance of the mock Aave V3 contract
    // (may not be 0 if previous tests ran)
    const mockAaveBalanceBefore = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: MOCK_AAVE_V3_ADDRESS })
    )

    // Get hook executor address (on destination chain - for cross-chain swaps this should be the hook executor on dest chain)
    const hookExecutor = await onlyswaps.getHookExecutor()
    expect(hookExecutor).not.toBe(zeroAddress)

    const { requestId, transactionHash } = await onlyswaps.swap({
        // For postHooks, recipient must be the hook executor on the destination chain
        // Users must manually set this to the hook executor address on the destination chain
        recipient: hookExecutor,
        srcToken: RUSD_ADDRESS,
        destToken: RUSD_ADDRESS,
        amountIn: DEFAULT_AMOUNT_IN,
        amountOut: DEFAULT_AMOUNT_OUT,
        amountToApprove: DEFAULT_AMOUNT_TO_APPROVE,
        fee: DEFAULT_FEE,
        destChainId: DEST_CHAIN_ID,
        postHooks: [
            createERC20ApproveHook(RUSD_ADDRESS, MOCK_AAVE_V3_ADDRESS, DEFAULT_AMOUNT_OUT, DEFAULT_GAS_LIMIT),
            await createAaveV3SupplyHook({
                asset: RUSD_ADDRESS,
                amount: DEFAULT_AMOUNT_OUT,
                onBehalfOf: MY_ADDRESS,
                referralCode: 0
            }, MOCK_AAVE_V3_ADDRESS, publicClient, DEFAULT_GAS_LIMIT)
        ]
    })

    expect(requestId).not.toBe(undefined)
    expect(transactionHash).not.toBe(undefined)

    // Verify the request was created with hooks
    const requestParams = await onlyswaps.fetchRequestParams(requestId)
    expect(requestParams).toBeDefined()
    
    // The recipient should be the hook executor (manually set above)
    expect(requestParams.recipient.toLowerCase()).toBe(hookExecutor.toLowerCase())

    // Verify the post hook was not executed yet by checking the balance of the mock Aave V3 contract
    const mockAaveBalanceAfter = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: MOCK_AAVE_V3_ADDRESS })
    )
    expect(mockAaveBalanceAfter).toBe(mockAaveBalanceBefore)
})

test("swap with both preHooks and postHooks - recipient should be hook executor on destination chain", async () => {
    // Deploy fresh MockAaveV3 for this test
    const MOCK_AAVE_V3_ADDRESS = await deployMockAaveV3()

    const { viemBackend, onlyswaps } = createTestClients()

    await ensureTokensMinted(viemBackend, RUSD_ADDRESS, MY_ADDRESS)

    // Get hook executor address (on destination chain - for cross-chain swaps this should be the hook executor on dest chain)
    const hookExecutor = await onlyswaps.getHookExecutor()
    expect(hookExecutor).not.toBe(zeroAddress)

    const { requestId, transactionHash } = await onlyswaps.swap({
        // For postHooks, recipient must be the hook executor on the destination chain
        // Users must manually set this to the hook executor address on the destination chain
        recipient: hookExecutor,
        srcToken: RUSD_ADDRESS,
        destToken: RUSD_ADDRESS,
        amountIn: DEFAULT_AMOUNT_IN,
        amountOut: DEFAULT_AMOUNT_OUT,
        amountToApprove: DEFAULT_AMOUNT_TO_APPROVE,
        fee: DEFAULT_FEE,
        destChainId: DEST_CHAIN_ID,
        preHooks: [
            createERC20ApproveHook(RUSD_ADDRESS, MY_ADDRESS, PREHOOK_APPROVAL_AMOUNT, DEFAULT_GAS_LIMIT)
        ],
        postHooks: [
            createERC20ApproveHook(RUSD_ADDRESS, MOCK_AAVE_V3_ADDRESS, DEFAULT_AMOUNT_OUT, DEFAULT_GAS_LIMIT),
            await createAaveV3SupplyHook({
                asset: RUSD_ADDRESS,
                amount: DEFAULT_AMOUNT_OUT,
                onBehalfOf: MY_ADDRESS,
                referralCode: 0
            }, MOCK_AAVE_V3_ADDRESS, publicClient, DEFAULT_GAS_LIMIT)
        ]
    })

    expect(requestId).not.toBe(undefined)
    expect(transactionHash).not.toBe(undefined)

    // Verify the request was created with hooks
    const requestParams = await onlyswaps.fetchRequestParams(requestId)
    expect(requestParams).toBeDefined()
    
    // The recipient should be the hook executor (manually set above)
    expect(requestParams.recipient.toLowerCase()).toBe(hookExecutor.toLowerCase())
})

test("should relay tokens with Aave V3 post hooks and store a receipt", async () => {
    // Deploy fresh MockAaveV3 for this test
    const actualMockAaveAddress = await deployMockAaveV3()

    const { viemBackend, onlyswaps } = createTestClients()
    const solverBackend = new ViemChainBackend(SOLVER_ADDRESS, publicClient, solverWalletClient)
    const solverOnlyswaps = new RouterClient(
        { routerAddress: ONLYSWAPS_ROUTER_ADDRESS },
        solverBackend
    )

    const amount = DEFAULT_AMOUNT_OUT
    const dstChainId = 31337n

    // Get hook executor address from the solver's router contract (destination chain where relay happens)
    const hookExecutor = await solverOnlyswaps.getHookExecutor()
    expect(hookExecutor).not.toBe(zeroAddress)
    expect(hookExecutor).not.toBe("0x0000000000000000000000000000000000000000")
    
    // Verify the deployed MockAaveV3 contract
    const mockAaveCode = await publicClient.getBytecode({ address: actualMockAaveAddress })
    
    if (!mockAaveCode || mockAaveCode === "0x") {
        throw new Error(`MockAaveV3 contract not found at address ${actualMockAaveAddress}. Deployment may have failed.`)
    }

    // Record initial balances before swap (may not be 0 if previous tests ran)
    const recipientBalanceBefore = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: MY_ADDRESS })
    )
    const aaveBalanceBefore = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: actualMockAaveAddress })
    )

    // Mint tokens for solver
    await ensureTokensMinted(solverBackend, RUSD_ADDRESS, SOLVER_ADDRESS)

    // Approve Router to spend solver's tokens
    await solverBackend.sendTransaction(
        createApproveCall({ routerAddress: ONLYSWAPS_ROUTER_ADDRESS }, {
            srcToken: RUSD_ADDRESS,
            approvalAmount: amount
        })
    )

    // Create post hooks: approve + supply to Aave V3
    // Create approve and supply hooks separately with different gas limits
    // Use the actual deployed MockAaveV3 address
    const postHooks = [
        createERC20ApproveHook(RUSD_ADDRESS, actualMockAaveAddress, amount, 100_000n),
        await createAaveV3SupplyHook({
            asset: RUSD_ADDRESS,
            amount: amount,
            onBehalfOf: MY_ADDRESS,
            referralCode: 0
        }, actualMockAaveAddress, publicClient, 10_000_000n)
    ]
    

    // Verify hooks have callData before using them
    postHooks.forEach((hook, index) => {
        const hasCallData = !!hook.callData && hook.callData !== "0x" && hook.callData.length > 2
        if (!hasCallData) {
            throw new Error(`Post hook ${index} is missing callData. Hook: ${JSON.stringify({
                target: hook.target,
                callData: hook.callData,
                gasLimit: hook.gasLimit.toString()
            })}`)
        }
    })
    
    // Double-check: verify callData is actually a valid hex string
    postHooks.forEach((hook, index) => {
        if (!hook.callData.startsWith("0x")) {
            throw new Error(`Hook ${index} callData doesn't start with 0x: ${hook.callData}`)
        }
        // Approve callData should be ~68 bytes (4 byte selector + 32 bytes address + 32 bytes uint256)
        // Supply callData should be longer
        if (index === 0 && hook.callData.length < 68) {
            throw new Error(`Hook ${index} (approve) callData too short: ${hook.callData.length} bytes, expected ~68`)
        }
    })

    // Pre-compute valid requestId matching _createRequestId in contract
    // _createRequestId uses: sender, recipient, tokenIn, tokenOut, amountOut, srcChainId, dstChainId, nonce, preHooks, postHooks
    const srcChainId = 1n
    const nonce = 1n
    const preHooks: Hook[] = []
    
    
    // Ensure hooks have callData before computing hash
    const hooksForHash = postHooks.map(hook => {
        if (!hook.callData || hook.callData === "0x" || hook.callData.length <= 2) {
            throw new Error(`Hook missing callData for hash computation: ${JSON.stringify(hook)}`)
        }
        return [hook.target, hook.callData, hook.gasLimit] as const
    })
    
    // Compute hooks hashes (contract hashes the hooks arrays)
    const preHooksHash = keccak256(
        encodeAbiParameters(
            [{ type: "tuple[]", components: [{ type: "address" }, { type: "bytes" }, { type: "uint256" }] }],
            [preHooks.map(hook => [hook.target, hook.callData, hook.gasLimit] as const)]
        )
    )
    const postHooksHash = keccak256(
        encodeAbiParameters(
            [{ type: "tuple[]", components: [{ type: "address" }, { type: "bytes" }, { type: "uint256" }] }],
            [hooksForHash]
        )
    )
    
    // Compute requestId matching _createRequestId: sender, recipient, tokenIn, tokenOut, amountOut, srcChainId, dstChainId, nonce, preHooksHash, postHooksHash
    const requestId = keccak256(
        encodeAbiParameters(
            [
                { type: "address" }, // sender
                { type: "address" }, // recipient
                { type: "address" }, // tokenIn
                { type: "address" }, // tokenOut
                { type: "uint256" }, // amountOut
                { type: "uint256" }, // srcChainId
                { type: "uint256" }, // dstChainId (getChainId())
                { type: "uint256" }, // nonce
                { type: "bytes32" }, // preHooksHash
                { type: "bytes32" }, // postHooksHash
            ],
            [
                MY_ADDRESS, // sender
                hookExecutor, // recipient is hook executor for hooks execution
                RUSD_ADDRESS, // tokenIn
                RUSD_ADDRESS, // tokenOut
                amount, // amountOut
                srcChainId,
                dstChainId, // destination chain ID (getChainId() in contract)
                nonce,
                preHooksHash,
                postHooksHash,
            ]
        )
    ) as Hex

    // Verify hooks have callData before passing to relayTokens
    postHooks.forEach((hook, i) => {
        const hasCallData = !!hook.callData && hook.callData !== "0x" && hook.callData.length > 2
        if (!hasCallData) {
            throw new Error(`Hook ${i} missing callData before relayTokens call`)
        }
    })
    
    // Verify hook executor is set and not zero before relaying
    expect(hookExecutor).not.toBe(zeroAddress)
    expect(hookExecutor.toLowerCase()).not.toBe("0x0000000000000000000000000000000000000000")
    
    // Relay tokens with post hooks (use original postHooks - they should already have callData)
    const relayReceipt = await solverOnlyswaps.relayTokens({
        solverRefundAddress: SOLVER_ADDRESS,
        requestId: requestId,
        sender: MY_ADDRESS,
        recipient: hookExecutor, // recipient is hook executor
        tokenIn: RUSD_ADDRESS,
        tokenOut: RUSD_ADDRESS,
        amountOut: amount,
        srcChainId: srcChainId,
        nonce: nonce,
        preHooks: preHooks,
        postHooks: postHooks,
    })
    
    // Verify transaction succeeded
    expect(relayReceipt.status).toBe("success")
    
    // Check for any revert reasons or errors in the transaction
    if (relayReceipt.status !== "success") {
        throw new Error(`Relay transaction failed with status: ${relayReceipt.status}`)
    }
    
    // Verify hook executor balance after relay
    // Hook executor should have 0 tokens because they were transferred to MockAaveV3 in the supply posthook
    const hookExecutorBalanceAfter = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: hookExecutor })
    )
    expect(hookExecutorBalanceAfter).toBe(0n)
    
    // Verify hooks have callData
    postHooks.forEach((hook, index) => {
        if (!hook.callData || hook.callData === "0x" || hook.callData.length <= 2) {
            throw new Error(`Post hook ${index} is missing callData. Hook: ${JSON.stringify(hook)}`)
        }
    })
  
    // Verify events emitted
    const swapRequestFulfilledEvents = parseEventLogs({
        abi: parseAbi([
            "event SwapRequestFulfilled(bytes32 indexed requestId, uint256 indexed srcChainId, uint256 indexed dstChainId)"
        ]),
        eventName: "SwapRequestFulfilled",
        logs: relayReceipt.logs,
    })
    expect(swapRequestFulfilledEvents.length).toBeGreaterThan(0)

    // Check for HookExecuted events from the hook executor
    const hookExecutedEvents = parseEventLogs({
        abi: parseAbi([
            "event HookExecuted(address indexed target, bool success)"
        ]),
        eventName: "HookExecuted",
        logs: relayReceipt.logs,
    })
    // Verify both hooks executed (should have 2 HookExecuted events for 2 post hooks)
    if (hookExecutedEvents.length !== postHooks.length) {
        throw new Error(`Expected ${postHooks.length} HookExecuted events but found ${hookExecutedEvents.length}. This suggests some hooks did not execute or failed silently.`)
    }
    
    // Verify all hooks executed successfully
    hookExecutedEvents.forEach((event, i) => {
        if (!event.args.success) {
            throw new Error(`Hook ${i} at target ${event.args.target} executed but returned success=false`)
        }
    })
    
    // Map HookExecuted events to our hooks to verify which one is which
    const approveHookTarget = postHooks[0].target.toLowerCase()
    const supplyHookTarget = postHooks[1].target.toLowerCase()
    
    const approveHookExecuted = hookExecutedEvents.find(e => e.args.target.toLowerCase() === approveHookTarget)
    const supplyHookExecuted = hookExecutedEvents.find(e => e.args.target.toLowerCase() === supplyHookTarget)
    
    // Verify the supply hook target matches MockAaveV3 address
    if (supplyHookTarget.toLowerCase() !== actualMockAaveAddress.toLowerCase()) {
        throw new Error(`Supply hook target (${supplyHookTarget}) does not match MockAaveV3 address (${actualMockAaveAddress})`)
    }
    
    if (!supplyHookExecuted || !supplyHookExecuted.args.success) {
        throw new Error(`Supply hook did not execute successfully. HookExecuted event: ${JSON.stringify(supplyHookExecuted)}`)
    }
    
    // FIRST: Check for Supplied and Transfer events - these are definitive proof that transferFrom succeeded
    // If supply hook executed successfully, these events MUST exist
    // The MockAaveV3.supply() function emits Supplied AFTER transferFrom succeeds
    const suppliedEvents = parseEventLogs({
        abi: parseAbi([
            "event Supplied(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)"
        ]),
        eventName: "Supplied",
        logs: relayReceipt.logs,
    })
    // Check for Transfer events from hookExecutor to MockAaveV3
    const transferEvents = parseEventLogs({
        abi: parseAbi([
            "event Transfer(address indexed from, address indexed to, uint256 value)"
        ]),
        eventName: "Transfer",
        logs: relayReceipt.logs,
    })
    
    // Filter for transfers from hookExecutor to MockAaveV3
    const aaveTransferEvents = transferEvents.filter(event => 
        event.args.from.toLowerCase() === hookExecutor.toLowerCase() &&
        event.args.to.toLowerCase() === actualMockAaveAddress.toLowerCase() &&
        event.args.value === amount
    )
    
    // If supply hook executed successfully, we MUST see either Supplied event or Transfer event
    // The MockAaveV3.supply() function emits Supplied AFTER transferFrom succeeds
    // So if Supplied event exists, transferFrom definitely succeeded
    if (supplyHookExecuted && supplyHookExecuted.args.success) {
        if (suppliedEvents.length === 0 && aaveTransferEvents.length === 0) {
            // Check if MockAaveV3 contract actually exists and has code
            const mockAaveCodeAfter = await publicClient.getBytecode({ address: actualMockAaveAddress })
            
            try {
                // Check if we can read the contract - try to call a view function or check code
                const hasCode = mockAaveCodeAfter && mockAaveCodeAfter !== "0x"
                
                if (!hasCode) {
                    throw new Error(`MockAaveV3 contract has no code at address ${actualMockAaveAddress}. The contract may not be deployed or the address is incorrect.`)
                }
            } catch (error) {
                throw new Error(`Failed to verify MockAaveV3 contract: ${(error as Error).message}`)
            }
            
            throw new Error(`Supply hook executed successfully (HookExecuted shows success=true) but NO Supplied event and NO Transfer event found. This is impossible - if MockAaveV3.supply() executed successfully, it must have called transferFrom and emitted Supplied event. MockAaveV3 address: ${actualMockAaveAddress}, Hook target: ${supplyHookExecuted.args.target}`)
        }
    }
    
    // Check balances after verifying events
    // Hook executor should have 0 tokens because they were transferred to MockAaveV3 in the supply posthook
    const hookExecutorBalanceAfterAllHooks = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: hookExecutor })
    )
    const aaveBalanceAfterAllHooks = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: actualMockAaveAddress })
    )
    expect(hookExecutorBalanceAfterAllHooks).toBe(0n)
    
    // If we have events but balance is 0, this is a state sync issue
    if (supplyHookExecuted && supplyHookExecuted.args.success) {
        if ((suppliedEvents.length > 0 || aaveTransferEvents.length > 0) && aaveBalanceAfterAllHooks === 0n) {
            throw new Error(`Supplied/Transfer events found (confirming transferFrom succeeded) but MockAaveV3 balance is ${aaveBalanceAfterAllHooks}, expected ${amount}. This suggests a state synchronization issue - the transfer happened but balance is not reflecting it.`)
        }
        
        // If no events and no balance, the hook didn't actually execute
        if (suppliedEvents.length === 0 && aaveTransferEvents.length === 0 && aaveBalanceAfterAllHooks === 0n) {
            throw new Error(`Supply hook reported success=true but NO Supplied event, NO Transfer event, and balance is 0. This suggests the hook execution was reported as successful but MockAaveV3.supply() did not actually execute.`)
        }
    }
    
    const approvalEvents = parseEventLogs({
        abi: parseAbi([
            "event Approval(address indexed owner, address indexed spender, uint256 value)"
        ]),
        eventName: "Approval",
        logs: relayReceipt.logs,
    })
    expect(approvalEvents.length).toBeGreaterThan(0)
    
    // Check approval amount - should be approved from hook executor to Aave
    if (approvalEvents.length > 0) {
        // Verify the approval is from hook executor to Aave
        const hookExecutorApproval = await viemBackend.staticCall(
            createAllowanceCall({ 
                token: RUSD_ADDRESS, 
                wallet: hookExecutor, 
                spender: actualMockAaveAddress 
            })
        )
        // Hook executor should have 0 allowance after the relay
        // because the tokens were transferred to the MockAaveV3 contract in the AaveV3 supply posthook
        expect(hookExecutorApproval).toBe(0n)
    }

    // Check balances immediately after transaction
    // The transaction receipt means it's already mined, so state should be available
    let hookExecutorBalance = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: hookExecutor })
    )
    // Hook executor should have 0 tokens after the relay
    // because the tokens are transferred to the MockAaveV3 contract in the AaveV3 supply posthook
    expect(hookExecutorBalance).toBe(0n)
    
    // Check Aave balance after the relay
    let aaveBalance = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: actualMockAaveAddress })
    )
    // MockAaveV3 should have received the tokens after the relay
    // Check the balance increase (delta) rather than absolute value
    expect(aaveBalance - aaveBalanceBefore).toBe(amount)


    // Check swap request receipt
    const swapRequestReceipt = await onlyswaps.fetchFulfilmentReceipt(requestId)
    expect(swapRequestReceipt.fulfilled).toBe(true)
    expect(swapRequestReceipt.amountOut).toBe(amount)
    expect(swapRequestReceipt.solver.toLowerCase()).toBe(SOLVER_ADDRESS.toLowerCase()) // solverRefundAddr

    // Check fulfilled transfers from Router contract
    const fulfilledTransfers = await onlyswaps.getFulfilledTransfers()
    expect(fulfilledTransfers.includes(requestId)).toBe(true)
    expect(fulfilledTransfers.length).toBeGreaterThanOrEqual(1)

    // Try to relay again - should fail because the requestId is already fulfilled
    await expect(
        solverOnlyswaps.relayTokens({
            solverRefundAddress: SOLVER_ADDRESS,
            requestId: requestId,
            sender: MY_ADDRESS,
            recipient: hookExecutor,
            tokenIn: RUSD_ADDRESS,
            tokenOut: RUSD_ADDRESS,
            amountOut: amount,
            srcChainId: srcChainId,
            nonce: nonce,
            preHooks: preHooks,
            postHooks: postHooks,
        })
    ).rejects.toThrow()

    // Verify fulfilled transfers count has not changed
    const fulfilledTransfersAfter = await onlyswaps.getFulfilledTransfers()
    expect(fulfilledTransfersAfter.length).toBe(fulfilledTransfers.length)
})

test("should relay tokens with two approve post hooks and verify both approvals are executed and allowance is updated", async () => {
    // Deploy fresh MockAaveV3 for this test
    const actualMockAaveAddress = await deployMockAaveV3()

    const { viemBackend, onlyswaps } = createTestClients()
    const solverBackend = new ViemChainBackend(SOLVER_ADDRESS, publicClient, solverWalletClient)
    const solverOnlyswaps = new RouterClient(
        { routerAddress: ONLYSWAPS_ROUTER_ADDRESS },
        solverBackend
    )

    const amount = DEFAULT_AMOUNT_OUT
    const dstChainId = 31337n

    // Get hook executor address from the solver's router contract
    const hookExecutor = await solverOnlyswaps.getHookExecutor()
    expect(hookExecutor).not.toBe(zeroAddress)
    
    // Verify the deployed MockAaveV3 contract
    const mockAaveCode = await publicClient.getBytecode({ address: actualMockAaveAddress })
    if (!mockAaveCode || mockAaveCode === "0x") {
        throw new Error(`MockAaveV3 contract not found at address ${actualMockAaveAddress}. Deployment may have failed.`)
    }

    // Mint tokens for solver
    await ensureTokensMinted(solverBackend, RUSD_ADDRESS, SOLVER_ADDRESS)

    // Approve Router to spend solver's tokens
    await solverBackend.sendTransaction(
        createApproveCall({ routerAddress: ONLYSWAPS_ROUTER_ADDRESS }, {
            srcToken: RUSD_ADDRESS,
            approvalAmount: amount
        })
    )

    // Create two approve post hooks (no Aave supply hook)
    // First approve: 100n to MockAaveV3
    // Second approve: 101n to MockAaveV3
    const postHooks = [
        createERC20ApproveHook(RUSD_ADDRESS, actualMockAaveAddress, 100n, 100_000n),
        createERC20ApproveHook(RUSD_ADDRESS, actualMockAaveAddress, 101n, 100_000n),
    ]

    // Pre-compute valid requestId
    const srcChainId = 1n
    const nonce = 2n // Different nonce to avoid conflicts
    
    const preHooks: Hook[] = []
    const hooksForHash = postHooks.map(hook => {
        if (!hook.callData || hook.callData === "0x" || hook.callData.length <= 2) {
            throw new Error(`Hook missing callData for hash computation`)
        }
        return [hook.target, hook.callData, hook.gasLimit] as const
    })
    
    const preHooksHash = keccak256(
        encodeAbiParameters(
            [{ type: "tuple[]", components: [{ type: "address" }, { type: "bytes" }, { type: "uint256" }] }],
            [preHooks.map(hook => [hook.target, hook.callData, hook.gasLimit] as const)]
        )
    )
    const postHooksHash = keccak256(
        encodeAbiParameters(
            [{ type: "tuple[]", components: [{ type: "address" }, { type: "bytes" }, { type: "uint256" }] }],
            [hooksForHash]
        )
    )
    
    const requestId = keccak256(
        encodeAbiParameters(
            [
                { type: "address" },
                { type: "address" },
                { type: "address" },
                { type: "address" },
                { type: "uint256" },
                { type: "uint256" },
                { type: "uint256" },
                { type: "uint256" },
                { type: "bytes32" },
                { type: "bytes32" },
            ],
            [
                MY_ADDRESS,
                hookExecutor,
                RUSD_ADDRESS,
                RUSD_ADDRESS,
                amount,
                srcChainId,
                dstChainId,
                nonce,
                preHooksHash,
                postHooksHash,
            ]
        )
    ) as Hex

    // Relay tokens with two approve post hooks
    const relayReceipt = await solverOnlyswaps.relayTokens({
        solverRefundAddress: SOLVER_ADDRESS,
        requestId: requestId,
        sender: MY_ADDRESS,
        recipient: hookExecutor,
        tokenIn: RUSD_ADDRESS,
        tokenOut: RUSD_ADDRESS,
        amountOut: amount,
        srcChainId: srcChainId,
        nonce: nonce,
        preHooks: preHooks,
        postHooks: postHooks,
    })

    expect(relayReceipt.status).toBe("success")

    // Check for HookExecuted events
    const hookExecutedEvents = parseEventLogs({
        abi: parseAbi([
            "event HookExecuted(address indexed target, bool success)"
        ]),
        eventName: "HookExecuted",
        logs: relayReceipt.logs,
    })
    expect(hookExecutedEvents.length).toBe(postHooks.length)
    
    // Verify all hooks executed successfully
    hookExecutedEvents.forEach((event) => {
        expect(event.args.success).toBe(true)
    })

    // Check for Approval events
    const approvalEvents = parseEventLogs({
        abi: parseAbi([
            "event Approval(address indexed owner, address indexed spender, uint256 value)"
        ]),
        eventName: "Approval",
        logs: relayReceipt.logs,
    })
    expect(approvalEvents.length).toBe(postHooks.length)

    // Verify approval amounts - should be from hookExecutor to MockAaveV3
    approvalEvents.forEach((event, i) => {
        expect(event.args.owner.toLowerCase()).toBe(hookExecutor.toLowerCase())
        expect(event.args.spender.toLowerCase()).toBe(actualMockAaveAddress.toLowerCase())
        // First approval should be 100n, second should be 101n
        const expectedAmount = i === 0 ? 100n : 101n
        expect(event.args.value).toBe(expectedAmount)
    })

    // Check final allowance - should be 101n (last approval overwrites the first)
    const finalAllowance = await viemBackend.staticCall(
        createAllowanceCall({ 
            token: RUSD_ADDRESS, 
            wallet: hookExecutor, 
            spender: actualMockAaveAddress 
        })
    )
    expect(finalAllowance).toBe(101n) // Last approval overwrites the first

    // Verify hook executor received tokens as the recipient of the relay transaction
    const hookExecutorBalance = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: hookExecutor })
    )
    expect(hookExecutorBalance).toBe(amount)

    // Check receipt
    const swapRequestReceipt = await onlyswaps.fetchFulfilmentReceipt(requestId)
    expect(swapRequestReceipt.fulfilled).toBe(true)
    expect(swapRequestReceipt.amountOut).toBe(amount)
    expect(swapRequestReceipt.solver.toLowerCase()).toBe(SOLVER_ADDRESS.toLowerCase())

    // Check fulfilled transfers
    const fulfilledTransfers = await onlyswaps.getFulfilledTransfers()
    expect(fulfilledTransfers.includes(requestId)).toBe(true)
    expect(fulfilledTransfers.length).toBeGreaterThanOrEqual(1)
})

test("validateAaveV3Contract should reject zero address", async () => {
    await expect(
        validateAaveV3Contract(publicClient, zeroAddress)
    ).rejects.toThrow("is not a contract (EOA or no code)")
})

test("validateAaveV3Contract should reject EOA address", async () => {
    // Use MY_ADDRESS which is an EOA (externally owned account)
    await expect(
        validateAaveV3Contract(publicClient, MY_ADDRESS)
    ).rejects.toThrow("is not a contract (EOA or no code)")
})

test("validateAaveV3Contract should reject contract without supply function", async () => {
    // Use the Router contract address which doesn't implement the supply function
    await expect(
        validateAaveV3Contract(publicClient, ONLYSWAPS_ROUTER_ADDRESS)
    ).rejects.toThrow("does not implement the Aave V3 supply function")
})

test("validateAaveV3Contract should accept valid MockAaveV3 contract", async () => {
    // Deploy fresh MockAaveV3 for this test
    const mockAaveAddress = await deployMockAaveV3()

    // Should not throw for a valid contract
    await expect(
        validateAaveV3Contract(publicClient, mockAaveAddress)
    ).resolves.not.toThrow()
})
