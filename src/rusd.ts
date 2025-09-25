import { Abi, Address } from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import ERC20FaucetToken from "../onlysubs-solidity/out/ERC20FaucetToken.sol/ERC20FaucetToken.json"
import { throwOnError } from "./eth"
import Decimal from "decimal.js"
import { OSPublicClient, OSWalletClient } from "./model"

const DEFAULT_ABI: Abi = ERC20FaucetToken.abi as Abi

export interface RUSD {
    mint(): Promise<void>

    balanceOf(address: Address): Promise<bigint>

    approveSpend(address: Address, amount: bigint): Promise<void>
}

export class RUSDViemClient<client extends OSPublicClient> implements RUSD {
    constructor(
        private _account: Address, // _account may be used by future read functions
        private contractAddr: Address,
        private client: client,
        private abi: Abi = DEFAULT_ABI
    ) {
    }

    async mint(this: RUSDViemClient<client & OSWalletClient>): Promise<void> {
        const hash = await this.client.writeContract({
            functionName: "mint",
            abi: this.abi,
            address: this.contractAddr,
            chain: this.client.chain,
            args: [],
        })

        await waitForTransactionReceipt(this.client, { hash })
    }

    async balanceOf(address: Address): Promise<bigint> {
        const response = await this.client.readContract({
            abi: this.abi,
            address: this.contractAddr,
            functionName: "balanceOf",
            args: [address]
        })
        return response as bigint
    }

    async approveSpend(this: RUSDViemClient<client & OSWalletClient>, address: Address, amount: bigint): Promise<void> {
        const approvalParams = {
            functionName: "approve",
            abi: this.abi,
            address: this.contractAddr,
            chain: this.client.chain,
            args: [address, amount]
        }
        const hash = await this.client.writeContract(approvalParams)

        const receipt = await waitForTransactionReceipt(this.client, { hash })
        await throwOnError(receipt, this.abi, this.client, approvalParams)
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
