import { Abi, Address, PublicClient, WalletClient } from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import ERC20FaucetToken from "../onlysubs-solidity/out/ERC20FaucetToken.sol/ERC20FaucetToken.json"
import { throwOnError } from "./eth"

const DEFAULT_ABI: Abi = ERC20FaucetToken.abi as Abi

export interface RUSD {
    mint(): Promise<void>

    balanceOf(address: Address): Promise<bigint>

    approveSpend(address: Address, amount: bigint): Promise<void>
}

export class RUSDViemClient implements RUSD {

    constructor(
        private account: Address,
        private contractAddr: Address,
        private publicClient: PublicClient,
        private walletClient: WalletClient,
        private abi: Abi = DEFAULT_ABI
    ) {
    }

    async mint(): Promise<void> {
        const hash = await this.walletClient.writeContract({
            functionName: "mint",
            abi: this.abi,
            address: this.contractAddr,
            account: this.account,
            chain: this.walletClient.chain,
            args: [],
        })

        await waitForTransactionReceipt(this.walletClient, { hash  })
    }

    async balanceOf(address: Address): Promise<bigint> {
        const response = await this.publicClient.readContract({
            abi: this.abi,
            address: this.contractAddr,
            functionName: "balanceOf",
            args: [address]
        })
        return response as bigint
    }

    async approveSpend(address: Address, amount: bigint): Promise<void> {
        const approvalParams = {
            functionName: "approve",
            abi: this.abi,
            address: this.contractAddr,
            account: this.account,
            chain: this.walletClient.chain,
            args: [address, amount]
        }
        const hash = await this.walletClient.writeContract(approvalParams)

        const receipt = await waitForTransactionReceipt(this.walletClient, { hash })
        await throwOnError(receipt, this.abi, this.publicClient, approvalParams)
    }

}
