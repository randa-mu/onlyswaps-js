import RouterJson from "../onlysubs-solidity/out/Router.sol/Router.json"
import { Abi, Client, Transport, Chain, PublicActions, Account, WalletActions } from "viem"
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

export type SwapRequestParameters = {
    sender: `0x${string}`,
    recipient: `0x${string}`,
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    amountOut: bigint,
    srcChainId: bigint,
    dstChainId: bigint,
    verificationFee: bigint,
    solverFee: bigint,
    nonce: bigint,
    // `executed` is true when the solver has completed the transfer, and
    // it has been verified by the dcipher network
    executed: boolean,
    requestedAt: bigint,
}

export type SwapRequestReceipt = {
    requestId: `0x${string}`,
    srcChainId: bigint,
    dstChainId: bigint,
    token: `0x${string}`,
    // `fulfilled` is true when the solver has completed the transfer
    // but it may or may not have been verified by the dcipher network
    fulfilled: boolean
    solver: `0x${string}`
    recipient: `0x${string}`
    amountOut: bigint
    fulfilledAt: bigint
}

export interface OnlySwaps {
    swap(options: SwapRequest): Promise<SwapResponse>

    updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>

    fetchRecommendedFee(tokenAddress: `0x${string}`, amount: bigint, srcChainId: bigint, destChainId: bigint): Promise<bigint>

    // used to track the status on the sourceChain
    fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters>

    // used to track the status on the destinationChain
    fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt>
}

export type OSPublicClient = Client<Transport, Chain> & PublicActions<Transport, Chain, Account | undefined> // account optional for public client
export type OSWalletClient = Client<Transport, Chain> & PublicActions<Transport, Chain, Account> & WalletActions<Chain, Account>
export type OSBothClient = OSPublicClient & OSWalletClient
