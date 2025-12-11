import { expect, test } from "@jest/globals"
import { createPublicClient, createWalletClient, http, Address } from "viem"
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
    createAaveV3SupplyHooks,
    createERC20ApproveHook
} from "../src"

// foundry automatically signs unsigned transaction from genesis accounts, use a non-genesis wallet to make sure everything is signed properly
// > cast wallet new
// Successfully created new keypair.
// Address:     0x2602A1971CA485EF1026d0a06A30AAB3B847e78A
// Private key: 0xa5bdd3629c86f0dc2ceaacc30482101b77dce8d608a9aeb55aa216fb41c3b301
// account funded with 10 ETH in scripts/deploy-anvil.sh
const MY_ADDRESS = "0x2602A1971CA485EF1026d0a06A30AAB3B847e78A"
const account = privateKeyToAccount("0xa5bdd3629c86f0dc2ceaacc30482101b77dce8d608a9aeb55aa216fb41c3b301")

// Test configuration constants
const RPC_URL = "http://localhost:31337"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address
const DEFAULT_AMOUNT_IN = 100n
const DEFAULT_AMOUNT_OUT = 100n
const DEFAULT_AMOUNT_TO_APPROVE = 101n
const DEFAULT_FEE = 1n
const UPDATED_FEE = 2n
const DEST_CHAIN_ID = 31338n
const DEFAULT_GAS_LIMIT = 100_000n
const TEST_AMOUNT_1_ETH = 1000n * 10n ** 18n // 1000 ETH in wei

const RUSD_ADDRESS = "0x13a6618E42AFb5b700534535B113eb013B746977"
const ONLYSWAPS_ROUTER_ADDRESS = "0xE16716C8210D8C9e8B8C756e70558d049f8EAcA1"
const MOCK_AAVE_V3_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const PREHOOK_APPROVAL_AMOUNT = 1n

const publicClient = createPublicClient({
    chain: foundry,
    transport: http(RPC_URL),
})

const walletClient = createWalletClient({
    chain: foundry,
    transport: http(RPC_URL),
    account,
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
        amount: TEST_AMOUNT_1_ETH
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
    const { viemBackend, onlyswaps } = createTestClients()

    await ensureTokensMinted(viemBackend, RUSD_ADDRESS, MY_ADDRESS)

    // Before the swap, the balance of the mock Aave V3 contract should be 0
    const mockAaveBalanceBefore = await viemBackend.staticCall(
        createBalanceOfCall({ token: RUSD_ADDRESS, wallet: MOCK_AAVE_V3_ADDRESS })
    )
    expect(mockAaveBalanceBefore).toBe(0n)

    // Get hook executor address (on destination chain - for cross-chain swaps this should be the hook executor on dest chain)
    const hookExecutor = await onlyswaps.getHookExecutor()
    expect(hookExecutor).not.toBe(ZERO_ADDRESS)

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
        postHooks: createAaveV3SupplyHooks({
            asset: RUSD_ADDRESS,
            amount: DEFAULT_AMOUNT_OUT,
            onBehalfOf: MY_ADDRESS,
            referralCode: 0
        }, MOCK_AAVE_V3_ADDRESS)
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
    const { viemBackend, onlyswaps } = createTestClients()

    await ensureTokensMinted(viemBackend, RUSD_ADDRESS, MY_ADDRESS)

    // Get hook executor address (on destination chain - for cross-chain swaps this should be the hook executor on dest chain)
    const hookExecutor = await onlyswaps.getHookExecutor()
    expect(hookExecutor).not.toBe(ZERO_ADDRESS)

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
        postHooks: createAaveV3SupplyHooks({
            asset: RUSD_ADDRESS,
            amount: DEFAULT_AMOUNT_OUT,
            onBehalfOf: MY_ADDRESS,
            referralCode: 0
        }, MOCK_AAVE_V3_ADDRESS)
    })

    expect(requestId).not.toBe(undefined)
    expect(transactionHash).not.toBe(undefined)

    // Verify the request was created with hooks
    const requestParams = await onlyswaps.fetchRequestParams(requestId)
    expect(requestParams).toBeDefined()
    
    // The recipient should be the hook executor (manually set above)
    expect(requestParams.recipient.toLowerCase()).toBe(hookExecutor.toLowerCase())
})

