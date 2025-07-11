import { expect, test } from "@jest/globals"
import { Abi, createPublicClient, createWalletClient, http } from "viem"
import { foundry } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { OnlySwapsViemClient } from "../src"
import RouterJson from "../onlysubs-solidity/out/Router.sol/Router.json"

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

test("swap resolve", async () => {
    const client = new OnlySwapsViemClient(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        { abi: RouterJson.abi as Abi , address: "0xD10fdc7B6E049Ee482a1C202dB996eC4fFA36370" },
        publicClient,
        walletClient
    )

    const { requestId } = await client.swap({
        recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        tokenAddress: RUSD_ADDRESS,
        amount: 100n,
        fee: 1n,
        destinationChainId: 1338n
    })

    expect(requestId).not.toBe(undefined)
})

