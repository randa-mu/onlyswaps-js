import {
    Abi,
    Address,
    parseAbi,
    parseEventLogs,
    PublicClient,
    WalletClient
} from "viem"
import { waitForTransactionReceipt } from "viem/actions"

export type SwapRequest = {
    recipient: `0x${string}`
    tokenAddress: `0x${string}`
    amount: bigint
    fee: bigint
    destinationChainId: bigint
}

export type SwapResponse = {
    requestId: `0x${string}`
}

export interface OnlySwaps {
    swap(options: SwapRequest): Promise<SwapResponse>

    updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>

    fetchRecommendedFee(tokenAddress: `0x${string}`, sourceChainId: bigint, destinationChainId: bigint): Promise<bigint>

    waitForVerification(requestId: `0x${string}`, timeoutMs?: number): Promise<void>
}

export class OnlySwapsViemClient implements OnlySwaps {
    constructor(
        private address: `0x${string}`,
        private contract: { abi: Abi; address: Address },
        private publicClient: PublicClient,
        private walletClient: WalletClient
    ) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchRecommendedFee(_tokenAddress: `0x${string}`, _sourceChainId: bigint, _destinationChainId: bigint): Promise<bigint> {
        return Promise.resolve(1n)
    }

    async swap(request: SwapRequest): Promise<SwapResponse> {
        const hash = await this.walletClient.writeContract({
            ...this.contract,
            functionName: "requestCrossChainSwap",
            args: [request.tokenAddress, request.amount, request.fee, request.destinationChainId, request.recipient],
            account: this.address,
            chain: this.walletClient.chain,
        })

        const receipt = await waitForTransactionReceipt(this.walletClient, { hash })
        const eventAbi = "event SwapRequested(bytes32 indexed requestId, bytes message)"
        const events = parseEventLogs({
            abi: parseAbi([eventAbi]),
            eventName: "SwapRequested",
            logs: receipt.logs
        })
        const { args } = events[0]
        const { requestId } = args
        return { requestId }
    }

    async updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void> {
        const hash = await this.walletClient.writeContract({
            ...this.contract,
            functionName: "updateFeesIfUnfulfilled",
            args: [requestId, newFee],
            account: this.address,
            chain: this.walletClient.chain,
        })
        await waitForTransactionReceipt(this.walletClient, { hash })
    }

    async waitForVerification(requestId: `0x${string}`, timeoutMs: number = 30_000): Promise<void> {
        if (timeoutMs <= 0) {
            throw new Error("timed out waiting for verification")
        }

        const transferParams: any = await this.publicClient.readContract({
            ...this.contract,
            functionName: "getTransferParameters",
            args: [requestId],
        })
        if (transferParams.executed) {
            return
        }
        return new Promise(resolve =>
            setTimeout(() => resolve(this.waitForVerification(requestId, timeoutMs - 1000)), 1000)
        )
    }
}
