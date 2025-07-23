import { expect, test } from "@jest/globals"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { foundry } from "viem/chains"
import { OnlySwapsViemClient, RUSDViemClient } from "../src"

const account = privateKeyToAccount("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d")
const publicClient = createPublicClient({
    chain: foundry,
    transport: http("http://localhost:31337"),
})

const walletClient = createWalletClient({
    chain: foundry,
    transport: http("http://localhost:31337"),
    account,
})

const RUSD_ADDRESS = "0x21C07ff0A3Fb809E5919d5Bef0186D30EF48d660"
const ONLYSWAPS_ROUTER_ADDRESS = "0xB1a49d61b8D77d270cdA4ced5D6E5fcEf53708dC"
const MY_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

test("mint tokens, request a swap, update the fee, check everything has been updated", async () => {
    const rusd = new RUSDViemClient(
        MY_ADDRESS,
        RUSD_ADDRESS,
        publicClient,
        walletClient
    )
    const onlyswaps = new OnlySwapsViemClient(
        MY_ADDRESS,
        ONLYSWAPS_ROUTER_ADDRESS,
        publicClient,
        walletClient
    )

    await rusd.mint(account.address)
    expect(await rusd.balanceOf(account.address)).toBeGreaterThan(0n)

    const { requestId } = await onlyswaps.swap({
        recipient: MY_ADDRESS,
        tokenAddress: RUSD_ADDRESS,
        amount: 100n,
        fee: 1n,
        destinationChainId: 1338n
    })

    expect(requestId).not.toBe(undefined)

    const status = await onlyswaps.fetchStatus(requestId)
    expect(status.solverFee).toEqual(1n)

    await onlyswaps.updateFee(requestId, 2n)
    const statusAfter = await onlyswaps.fetchStatus(requestId)
    expect(statusAfter.solverFee).toEqual(2n)
})

