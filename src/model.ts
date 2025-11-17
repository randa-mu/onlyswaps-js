import { Abi, Address, ContractFunctionName, Hex, ReadContractReturnType, } from "viem"
import { EncodedCall } from "./calls"

export type SwapRequest = {
    recipient: Address
    destChainId: bigint
    amountToApprove: bigint
    amountIn: bigint,
    amountOut: bigint,
    fee: bigint
    srcToken: Address
    destToken: Address
}

export type SwapResponse = {
    requestId: Hex
}

export type SwapRequestParameters = {
    sender: Hex,
    recipient: Hex,
    tokenIn: Hex,
    tokenOut: Hex,
    amountIn: bigint,
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
    requestId: Hex,
    srcChainId: bigint,
    dstChainId: bigint,
    tokenIn: Hex,
    tokenOut: Hex,
    // `fulfilled` is true when the solver has completed the transfer
    // but it may or may not have been verified by the dcipher network
    fulfilled: boolean
    solver: Hex
    recipient: Hex
    amountOut: bigint
    fulfilledAt: bigint
}

// this monstrosity gives us lovely type checking for different
// mutable and non-mutable calls based on solidity ABIs
export interface ChainBackend<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendTransaction(call: EncodedCall<any, any>): Promise<T>

    staticCall<
        const TAbi extends Abi,
        const TName extends ContractFunctionName<TAbi, "pure" | "view">
    >(
        call: EncodedCall<TAbi, TName>
    ): Promise<ReturnTypeOf<TAbi, TName>>

    simulate<
        const TAbi extends Abi,
        const TName extends ContractFunctionName<TAbi>
    >(
        call: EncodedCall<TAbi, TName>
    ): Promise<ReturnTypeOf<TAbi, TName>>
}

// this return type is necessary to get the right
// types out of the magical ABI inference
export type ReturnTypeOf<
    TAbi extends Abi,
    TName extends ContractFunctionName<TAbi, "pure" | "view">
> = ReadContractReturnType<TAbi, TName>
