import {
    Abi,
    Address,
    parseAbi,
    parseEventLogs,
    parseEther,
} from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import { RUSD, RUSDViemClient } from "./rusd"
import { throwOnError } from "./eth"
import { DEFAULT_ABI, OnlySwaps, SwapRequest, SwapResponse, SwapRequestParameters, SwapRequestReceipt, OSPublicClient, OSWalletClient } from "./model"

export class OnlySwapsViemClient<client extends OSPublicClient> implements OnlySwaps {
    constructor(
        private account: `0x${string}`,
        private contractAddress: Address,
        private client: client,
        private abi: Abi = DEFAULT_ABI,
    ) {
    }

    async fetchRecommendedFee(tokenAddress: `0x${string}`, amount: bigint, srcChainId: bigint, dstChainId: bigint): Promise<bigint> {
        const res = await fetch("https://fees.dcipher.network/fees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: tokenAddress,
                amount: Number(amount),
                src_chain_id: Number(srcChainId),
                dest_chain_id: Number(dstChainId),
            })
        })
        if (!res.ok) {
            console.error("Failed to fetch recommended fees", res.statusText)
            throw new Error("failed to fetch recommended fee")
        }
        const { suggested_fee } = await res.json()
        return Promise.resolve(BigInt(suggested_fee))
    }

    async swap(this: OnlySwapsViemClient<client & OSWalletClient>, request: SwapRequest, client?: RUSD): Promise<SwapResponse> {
        // first we approve the spend of RUSD for swapping
        const rusd = client ?? new RUSDViemClient(
            this.account,
            request.tokenAddress,
            this.client,
        )
        await rusd.approveSpend(this.contractAddress, parseEther((request.amount + request.fee).toString(10)))
        const swapParams = {
            functionName: "requestCrossChainSwap",
            address: this.contractAddress,
            abi: this.abi,
            // right now, we only support the same token address on multiple chains
            args: [request.tokenAddress, request.tokenAddress, request.amount, request.fee, request.destinationChainId, request.recipient],
            chain: this.client.chain,
        }
        const hash = await this.client.writeContract(swapParams)

        const receipt = await waitForTransactionReceipt(this.client, { hash })
        await throwOnError(receipt, this.abi, this.client, swapParams)
        const eventAbi = "event SwapRequested(bytes32 indexed requestId, uint256 indexed srcChainId, uint256 indexed dstChainId)"
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

    async updateFee(this: OnlySwapsViemClient<client & OSWalletClient>, requestId: `0x${string}`, newFee: bigint): Promise<void> {
        const hash = await this.client.writeContract({
            address: this.contractAddress,
            abi: this.abi,
            chain: this.client.chain,
            functionName: "updateSolverFeesIfUnfulfilled",
            args: [requestId, newFee],
        })
        await waitForTransactionReceipt(this.client, { hash })
    }

    async fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters> {
        const response = await this.client.readContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: "getSwapRequestParameters",
            args: [requestId],
        })
        return response as SwapRequestParameters
    }

    async fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt> {
        const response = await this.client.readContract({
            address: this.contractAddress,
            abi: this.abi,
            functionName: "getSwapRequestReceipt",
            args: [requestId],
        }) as TransferReceiptReturnType
        const [, srcChainId, dstChainId, token, fulfilled, solver, recipient, amountOut, fulfilledAt] = response

        return {
            requestId,
            srcChainId,
            dstChainId,
            token,
            fulfilled,
            solver,
            recipient,
            amountOut,
            fulfilledAt,
        }
    }
}

// the contract returns a tuple rather than a struct
type TransferReceiptReturnType = [
    requestId: `0x${string}`,
    srcChainId: bigint,
    dstChainId: bigint,
    token: `0x${string}`,
    // `fulfilled` is true when the solver has completed the transfer
    // but it may or may not have been verified by the dcipher network
    fulfilled: boolean,
    solver: `0x${string}`,
    recipient: `0x${string}`,
    amountOut: bigint,
    fulfilledAt: bigint,
]
