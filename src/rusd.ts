import { Abi, Address, PublicClient, WalletClient } from "viem"
import Decimal from "decimal.js"
import { waitForTransactionReceipt } from "viem/actions"
import ERC20FaucetToken from "../onlyswaps-solidity/out/ERC20FaucetToken.sol/ERC20FaucetToken.json"
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

        await waitForTransactionReceipt(this.walletClient, { hash })
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

const RUSD_FRACTION_DIGITS = 18

export function rusdToString(value: bigint, decimals: number = 2): string {
    if (decimals > RUSD_FRACTION_DIGITS) {
        decimals = RUSD_FRACTION_DIGITS
    }

    const negative = value < 0n
    const absValue = negative ? -value : value

    const factor = 10n ** BigInt(RUSD_FRACTION_DIGITS)
    const integerPart = absValue / factor
    const decimalPart = absValue % factor

    const decimalStr = decimalPart.toString()
        .padStart(RUSD_FRACTION_DIGITS, "0")
        .slice(0, decimals)

    return decimals === 0
        ? `${negative ? "-" : ""}${integerPart.toString()}`
        : `${negative ? "-" : ""}${integerPart.toString()}.${decimalStr}`
}

export function rusdFromString(input: string): bigint {
    const regex = /^\s*([+-]?\d+)(?:\.(\d*))?\s*$/;
    const match = input.match(regex)
    if (!match) {
        throw new Error("cannot parse string as RUSD value")
    }

    const integerPart = match[1]
    const decimalPart = (match[2] || "").padEnd(RUSD_FRACTION_DIGITS, "0").slice(0, RUSD_FRACTION_DIGITS)
    const combined = integerPart + decimalPart
    return BigInt(combined)
}

export function rusdFromNumber(input: number): bigint {
    const d = new Decimal(input)
    const scaled = d.mul(new Decimal(10).pow(RUSD_FRACTION_DIGITS))
    return BigInt(scaled.round().toFixed(0))
}
