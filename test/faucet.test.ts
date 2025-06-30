import { beforeAll, describe, expect, it } from "@jest/globals"
import * as dotenv from "dotenv"
import { createWalletClient, http, parseEther } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { waitForTransactionReceipt } from "viem/actions"
import { Faucet } from "../src/faucet"
import { furnace } from "../src/furnace"

describe("faucet", () => {
    beforeAll(() => {
        dotenv.config()
    })

    it("can withdraw an ERC20", async () => {
        // first we fund our wallet
        const godWalletClient = createWalletClient({
            account: privateKeyToAccount(`0x${process.env.FURNACE_PRIVATE_KEY ?? ""}`),
            chain: furnace,
            transport: http()
        })
        const account = privateKeyToAccount(generatePrivateKey())
        const hash = await godWalletClient.sendTransaction({ to: account.address, value: parseEther("0.1") })
        await waitForTransactionReceipt(godWalletClient, { hash })

        // then we withdraw some ERC20
        const faucet = Faucet.createFurnace(account)
        await faucet.withdraw()

        const balance = await faucet.balanceOf(account.address)
        expect(balance).toEqual(100n)
    })
})
