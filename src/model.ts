import RouterJson from "../onlysubs-solidity/out/Router.sol/Router.json"
import { Abi } from "viem"

export const DEFAULT_ABI: Abi = RouterJson.abi as Abi
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

export type TransferParams = {
    sender: `0x${string}`,
    recipient: `0x${string}`,
    token: `0x${string}`,
    amount: bigint,
    srcChainId: bigint,
    dstChainId: bigint,
    swapFee: bigint,
    solverFee: bigint,
    nonce: bigint,
    // `executed` is true when the solver has completed the transfer, and
    // it has been verified by the dcipher network
    executed: boolean,
}

export type TransferReceipt = {
    requestId: `0x${string}`
    srcChainId: bigint
    // `fulfilled` is true when the solver has completed the transfer
    // but it may or may not have been verified by the dcipher network
    fulfilled: boolean
    solver: `0x${string}`
    amountOut: bigint
    fulfilledAt: bigint
}

export interface OnlySwaps {
    swap(options: SwapRequest): Promise<SwapResponse>

    updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>

    fetchRecommendedFee(tokenAddress: `0x${string}`, sourceChainId: bigint, destinationChainId: bigint): Promise<bigint>

    // used to track the status on the sourceChain
    fetchStatus(requestId: `0x${string}`): Promise<TransferParams>

    // used to track the status on the destinationChain
    fetchReceipt(requestId: `0x${string}`): Promise<TransferReceipt>
}
