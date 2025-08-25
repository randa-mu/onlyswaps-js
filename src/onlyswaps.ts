import {
    Abi,
    Address,
    parseAbi,
    parseEventLogs,
    PublicClient,
    WalletClient,
    parseEther
} from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import { RUSD, RUSDViemClient } from "./rusd"
import { throwOnError } from "./eth"
import { DEFAULT_ABI, OnlySwaps, SwapRequest, SwapResponse, TransferParams, TransferReceipt } from "./model"

export class OnlySwapsViemClient implements OnlySwaps {
    constructor(
        private account: `0x${string}`,
        private contractAddress: Address,
        private publicClient: PublicClient,
        private walletClient: WalletClient,
        private abi: Abi = DEFAULT_ABI,
    ) {
    }

    async fetchRecommendedFee(tokenAddress: `0x${string}`, amount: bigint, srcChainId: bigint, destChainId: bigint): Promise<bigint> {
        const res = await fetch("https://fees.dcipher.network/fees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: tokenAddress,
                amount: Number(amount),
                src_chain_id: Number(srcChainId),
                dest_chain_id: Number(destChainId),
            })
        })
        if (!res.ok) {
            console.error("Failed to fetch recommended fees", res.statusText)
            throw new Error("failed to fetch recommended fee")
        }
        const { suggested_fee } = await res.json()
        return Promise.resolve(BigInt(suggested_fee))
    }

    async swap(request: SwapRequest, client?: RUSD): Promise<SwapResponse> {
        // first we approve the spend of RUSD for swapping
        const rusd = client ?? new RUSDViemClient(
            this.account,
            request.tokenAddress,
            this.publicClient,
            this.walletClient,
        )
        await rusd.approveSpend(this.contractAddress, parseEther(request.amount.toString(10)))

        const swapParams = {
            functionName: "requestCrossChainSwap",
            address: this.contractAddress,
            abi: this.abi,
            args: [request.tokenAddress, request.amount, request.fee, request.destinationChainId, request.recipient],
            account: this.account,
            chain: this.walletClient.chain,
        }
        const hash = await this.walletClient.writeContract(swapParams)

        const receipt = await waitForTransactionReceipt(this.walletClient, { hash })
        await throwOnError(receipt, this.abi, this.publicClient, swapParams)
        const eventAbi = "event SwapRequested(bytes32 indexed requestId, bytes message)"
        const events = parseEventLogs({
            abi: parseAbi([eventAbi]),
            eventName: "SwapRequested",
            logs: receipt.logs
        })

        if (events.length === 0) {
            throw new Error("unable to get requestId for swap")
        }

        return { requestId: events[0].args.requestId }
    }

    async updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void> {
        const hash = await this.walletClient.writeContract({
            address: this.contractAddress,
            abi: this.abi,
            account: this.account,
            chain: this.walletClient.chain,
            functionName: "updateFeesIfUnfulfilled",
            args: [requestId, newFee],
        })
        await waitForTransactionReceipt(this.walletClient, { hash })
    }

    async fetchStatus(requestId: `0x${string}`): Promise<TransferParams> {
        const response = await this.publicClient.readContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: "getTransferParameters",
            args: [requestId],
        })
        return response as TransferParams
    }

    async fetchReceipt(requestId: `0x${string}`): Promise<TransferReceipt> {
        const response = await this.publicClient.readContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: "getReceipt",
            args: [requestId],
        })
        const [, srcChainId, fulfilled, solver, recipient, token, amountOut, fulfilledAt] = response as TransferReceiptReturnType
        return {
            requestId,
            srcChainId,
            fulfilled,
            solver,
            recipient,
            token,
            amountOut,
            fulfilledAt
        }
    }
}

// the contract returns a tuple rather than a struct
type TransferReceiptReturnType = [
    requestId: `0x${string}`,
    srcChainId: bigint,
    // `fulfilled` is true when the solver has completed the transfer
    // but it may or may not have been verified by the dcipher network
    fulfilled: boolean,
    solver: `0x${string}`,
    recipient: `0x${string}`,
    token: `0x${string}`,
    amountOut: bigint,
    fulfilledAt: bigint,
]
