import { expect, test } from "@jest/globals"
import { createWalletClient, http, publicActions } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { foundry } from "viem/chains"
import { OnlySwapsViemClient, RUSDViemClient } from "../src"

const account = privateKeyToAccount("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d")


const client = createWalletClient({
    chain: foundry,
    transport: http("http://localhost:31337"),
    account,
}).extend(publicActions)

const RUSD_ADDRESS = "0xEFdbe33D9014FFde884Bf055D5202e3851213805"
const ONLYSWAPS_ROUTER_ADDRESS = "0x3d86B64a0f09Ca611edbcfB68309dFdEed87Ad89"
const MY_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

test("mint tokens, request a swap, update the fee, check everything has been updated", async () => {
    const rusd = new RUSDViemClient(
        MY_ADDRESS,
        RUSD_ADDRESS,
        client
    )
    const onlyswaps = new OnlySwapsViemClient(
        MY_ADDRESS,
        ONLYSWAPS_ROUTER_ADDRESS,
        client,
    )

    await rusd.mint()
    expect(await rusd.balanceOf(account.address)).toBeGreaterThan(0n)

    const { requestId } = await onlyswaps.swap({
        recipient: MY_ADDRESS,
        tokenAddress: RUSD_ADDRESS,
        amount: 100n,
        fee: 1n,
        destinationChainId: 1338n
    }, rusd)

    expect(requestId).not.toBe(undefined)

    const status = await onlyswaps.fetchStatus(requestId)
    expect(status.solverFee).toEqual(1n)

    await onlyswaps.updateFee(requestId, 2n)
    const statusAfter = await onlyswaps.fetchStatus(requestId)
    expect(statusAfter.solverFee).toEqual(2n)
})

test("can fetch suggested fee", async () => {
    const onlyswaps = new OnlySwapsViemClient(
        MY_ADDRESS,
        ONLYSWAPS_ROUTER_ADDRESS,
        client
    )

    const fee = await onlyswaps.fetchRecommendedFee("0x00000", 1n, 8453n, 43114n)
    expect(fee).toBeGreaterThan(0n)
})
