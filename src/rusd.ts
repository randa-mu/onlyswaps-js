import { Abi, Address, PublicClient, WalletClient } from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import ERC20Token from "../onlysubs-solidity/out/ERC20Token.sol/ERC20Token.json"
import { throwOnError } from "./eth"

const DEFAULT_ABI: Abi = ERC20Token.abi as Abi

export interface RUSD {
    mint(address: Address): Promise<void>

    balanceOf(address: Address): Promise<bigint>

    approveSpend(address: Address, amount: bigint): Promise<void>
}

const DEFAULT_WITHDRAWAL_AMOUNT = 1_000_000_000_000_000_000n

export class RUSDViemClient implements RUSD {

    constructor(
        private account: Address,
        private contractAddr: Address,
        private publicClient: PublicClient,
        private walletClient: WalletClient,
        private abi: Abi = DEFAULT_ABI
    ) {
    }

    async mint(address: Address): Promise<void> {
        const hash = await this.walletClient.writeContract({
            functionName: "mint",
            abi: this.abi,
            address: this.contractAddr,
            account: this.account,
            chain: this.walletClient.chain,
            args: [address, DEFAULT_WITHDRAWAL_AMOUNT],
        })

        await waitForTransactionReceipt(this.walletClient, { hash })
    }

    async balanceOf(address: Address): Promise<bigint> {
        const response = await this.publicClient.readContract({
            abi: DEFAULT_ABI,
            address: this.contractAddr,
            functionName: "balanceOf",
            args: [address]
        })
        return response as bigint
    }

    async approveSpend(address: Address, amount: bigint): Promise<void> {
        const approvalParams = {
            functionName: "approve",
            abi: DEFAULT_ABI,
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
