import { expect, test } from "@jest/globals"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { foundry } from "viem/chains"
import { OnlySwapsViemClient, ViemRUSDClient } from "../src"

const account = privateKeyToAccount("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")
const publicClient = createPublicClient({
    chain: { ...foundry, id: 1337 },
    transport: http("http://localhost:1337"),
})

const walletClient = createWalletClient({
    chain: { ...foundry, id: 1337 },
    transport: http("http://localhost:1337"),
    account,
})

const RUSD_ADDRESS = "0x46D346f8d9582f8963110108A7988B1a0bB3668D"
const ONLYSWAPS_ROUTER_ADDRESS = "0xD10fdc7B6E049Ee482a1C202dB996eC4fFA36370"
const MY_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

test("mint tokens, request a swap, update the fee, check everything has been updated", async () => {
    const rusd = new ViemRUSDClient(
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

