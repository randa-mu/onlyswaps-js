import { abi as faucetAbi } from "@/solidity/ERC20FaucetToken.sol/ERC20FaucetToken.json"
import {
    Account,
    Address,
    createWalletClient,
    getContract,
    GetContractReturnType,
    http, publicActions,
    WalletClient
} from "viem"
import { furnace } from "./furnace"
import { waitForTransactionReceipt } from "viem/actions"
import { baseSepolia } from "viem/chains"

type FaucetInstance = GetContractReturnType<typeof faucetAbi, WalletClient>

export class Faucet {

    static createFurnace(account: Account | Address) {
        return new Faucet(createWalletClient({
            account,
            chain: furnace,
            transport: http()
        }), "0xb1F323844dcfde76710fC801F33D4E24d7201B84")
    }

    static createBaseSepolia(account: Account | Address) {
        return new Faucet(createWalletClient({
            account,
            chain: baseSepolia,
            transport: http()
        }), "0xA7970378BcdeE68378DB2d2E3f86691b3e1afe4c")
    }

    private contract: FaucetInstance

    constructor(private readonly client: WalletClient, contractAddress: `0x${string}`) {
        this.contract = getContract({
            client: client.extend(publicActions),
            address: contractAddress,
            abi: faucetAbi
        })
    }

    async withdraw(): Promise<void> {
        const hash = await this.contract.write.mint()
        await waitForTransactionReceipt(this.client, { hash })
    }

    async balanceOf(address: `0x${string}`): Promise<bigint> {
        return await this.contract.read.balanceOf([address]) as unknown as bigint
    }
}
