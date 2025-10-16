import { expect, test } from "@jest/globals"
import { createPublicClient, createWalletClient, http } from "viem"
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
    createMintCall
} from "../src"

// foundry automatically signs unsigned transaction from genesis accounts, use a non-genesis wallet to make sure everything is signed properly
// > cast wallet new
// Successfully created new keypair.
// Address:     0x2602A1971CA485EF1026d0a06A30AAB3B847e78A
// Private key: 0xa5bdd3629c86f0dc2ceaacc30482101b77dce8d608a9aeb55aa216fb41c3b301
// account funded with 10 ETH in scripts/deploy-anvil.sh
const MY_ADDRESS = "0x2602A1971CA485EF1026d0a06A30AAB3B847e78A"
const account = privateKeyToAccount("0xa5bdd3629c86f0dc2ceaacc30482101b77dce8d608a9aeb55aa216fb41c3b301")

const publicClient = createPublicClient({
    chain: foundry,
    transport: http("http://localhost:31337"),
})

const walletClient = createWalletClient({
    chain: foundry,
    transport: http("http://localhost:31337"),
    account,
})

const RUSD_ADDRESS = "0x6b0fB8117C30B5ae16Db76aB7a1F2Bde9F7ED61b"
const ONLYSWAPS_ROUTER_ADDRESS = "0xA504fBff16352e397E3Bc1459A284c4426c55787"

test("mint tokens, request a swap, update the fee, check everything has been updated", async () => {
    const viemBackend = new ViemChainBackend(MY_ADDRESS, publicClient, walletClient)
    const onlyswaps = new RouterClient(
        { routerAddress: ONLYSWAPS_ROUTER_ADDRESS },
        viemBackend
    )

    await viemBackend.sendTransaction(createMintCall(RUSD_ADDRESS))
    const balance = await viemBackend.staticCall(createBalanceOfCall({ token: RUSD_ADDRESS, wallet: MY_ADDRESS }))
    expect(balance).toBeGreaterThan(0n)

    const { requestId } = await onlyswaps.swap({
        recipient: MY_ADDRESS,
        srcToken: RUSD_ADDRESS,
        destToken: RUSD_ADDRESS,
        amount: 100n,
        fee: 1n,
        destChainId: 31338n
    })

    expect(requestId).not.toBe(undefined)

    const status = await onlyswaps.fetchRequestParams(requestId)
    expect(status.solverFee).toEqual(1n)

    await onlyswaps.updateFee(requestId, RUSD_ADDRESS, 2n)
    const statusAfter = await onlyswaps.fetchRequestParams(requestId)
    expect(statusAfter.solverFee).toEqual(2n)
})

test("can fetch recommended fees from the API", async () => {
    const params: FeesRequest = {
        sourceToken: BASE_SEPOLIA.RUSD_ADDRESS,
        destinationToken: AVAX_FUJI.RUSD_ADDRESS,
        sourceChainId: BigInt(baseSepolia.id),
        destinationChainId: BigInt(avalancheFuji.id),
        amount: 1000000000000000000000n
    }
    const result = await fetchRecommendedFees(params)
    expect(result.src.swapFee).toBeGreaterThan(0n)

    expect(result.approvalAmount).toBeGreaterThan(result.transferAmount)
    expect(result.approvalAmount).toBeGreaterThan(result.fees.total)
    expect(result.transferAmount).toBeGreaterThan(result.fees.total)
    expect(result.fees.total).toBeGreaterThan(result.fees.network)
    expect(result.fees.total).toBeGreaterThan(result.fees.solver)
})
