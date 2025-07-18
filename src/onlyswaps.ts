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
import { RUSD, ViemRUSDClient } from "./rusd"
import { throwOnError } from "./eth"
import RouterJson from "../onlysubs-solidity/out/Router.sol/Router.json"

const DEFAULT_ABI: Abi = RouterJson.abi as Abi
export type SwapRequest = {
    recipient: `0x${string}`
    tokenAddress: `0x${string}`
    amount: bigint // the amount of stablecoin in ether, e.g. 100n == 100 USD
    fee: bigint // the fee amount in stablecoin expressed as ether, e.g. 1n == 1 USD
    destinationChainId: bigint
}

export type SwapResponse = {
    requestId: `0x${string}`
}

type TransferParams = {
    sender: `0x${string}`,
    recipient: `0x${string}`,
    token: `0x${string}`,
    amount: bigint,
    srcChainId: bigint,
    dstChainId: bigint,
    swapFee: bigint,
    solverFee: bigint,
    nonce: bigint,
    executed: boolean,
}

export interface OnlySwaps {
    swap(options: SwapRequest): Promise<SwapResponse>

    updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>

    fetchRecommendedFee(tokenAddress: `0x${string}`, sourceChainId: bigint, destinationChainId: bigint): Promise<bigint>

    fetchStatus(requestId: `0x${string}`): Promise<TransferParams>
}

export class OnlySwapsViemClient implements OnlySwaps {
    constructor(
        private account: `0x${string}`,
        private contractAddress: Address,
        private publicClient: PublicClient,
        private walletClient: WalletClient,
        private abi: Abi = DEFAULT_ABI,
    ) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchRecommendedFee(_tokenAddress: `0x${string}`, _sourceChainId: bigint, _destinationChainId: bigint): Promise<bigint> {
        return Promise.resolve(1n)
    }

    async swap(request: SwapRequest, client?: RUSD): Promise<SwapResponse> {
        // first we approve the spend of RUSD for swapping
        const rusd = client ?? new ViemRUSDClient(
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
}
