/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Abi } from "abitype"
import {
    ContractFunctionName,
    decodeErrorResult,
    PublicClient,
    TransactionReceipt,
    WalletClient
} from "viem"
import { waitForTransactionReceipt } from "viem/actions"

import { EncodedCall } from "./calls"
import { ChainBackend, ReturnTypeOf } from "./model"

export class ViemChainBackend implements ChainBackend<TransactionReceipt> {
    constructor(
        private readonly account: `0x${string}`,
        private readonly publicClient: PublicClient,
        private readonly walletClient: WalletClient,
    ) {
    }

    async sendTransaction(call: EncodedCall<any, any>): Promise<TransactionReceipt> {
        const viemTransaction = {
            ...call,
            account: this.account,
            chain: this.walletClient.chain,
        }

        // we simulate first to catch any obvious errors before showing wallet popups
        await this.simulate(call)

        // then we execute the actual transaction
        let hash: `0x${string}`
        try {
            hash = await this.walletClient.writeContract({ ...viemTransaction })
        } catch (err) {
            throw new Error(`Failed to send transaction ${call.functionName}: ${(err as Error).message}`)
        }

        // we wait for the receipt, and if it somehow failed, we simulate the call again to find out why.
        // If the `simulate` call doesn't fail, then we have no idea why it failed and throw a wtf error
        const receipt = await waitForTransactionReceipt(this.walletClient, { hash })
        if (receipt.status !== "success") {
            await this.simulate(call)
            throw new Error("transaction failed for an unknown reason")
        }

        return receipt
    }

    async staticCall<
        const TAbi extends Abi,
        const TName extends ContractFunctionName<TAbi, "pure" | "view">
    >(call: EncodedCall<TAbi, TName>): Promise<ReturnTypeOf<TAbi, TName>> {
        const result = await this.publicClient.readContract({
            ...call,
            account: this.account,
        })
        return result as ReturnTypeOf<TAbi, TName>
    }

    async simulate<
        const TAbi extends Abi,
        const TName extends ContractFunctionName<TAbi, "nonpayable" | "payable">
    >(call: EncodedCall<TAbi, TName>): Promise<ReturnTypeOf<TAbi, TName>> {
        try {
            const { result } = await this.publicClient.simulateContract({
                ...call,
                chain: this.walletClient.chain,
                account: this.account,
            } as any)
            return result as ReturnTypeOf<TAbi, TName>
        } catch (err: any) {
            const errData = err?.data
            try {
                const decoded = decodeErrorResult({ abi: call.abi, data: errData })
                throw new Error(`transaction reverted: ${decoded.errorName}`)
            } catch {
                throw new Error(`transaction failed: ${(err as Error).message}`)
            }
        }
    }
}

