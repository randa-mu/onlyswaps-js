import { Address, Hex, TransactionReceipt, } from "viem"
import {
    createApproveCall,
    createGetSwapParameters,
    createGetSwapReceipt,
    createSwapCall,
    createUpdateFeesCall,
    OnlySwapsConfig
} from "./calls"
import { parseSwapRequest } from "./parser"
import {
    SwapResponse,
    SwapRequestParameters,
    SwapRequestReceipt,
    ChainBackend,
    SwapRequest,
} from "./model"
import { extractRequestId } from "./util"

export class RouterClient {
    constructor(
        private readonly config: OnlySwapsConfig,
        private readonly backend: ChainBackend<TransactionReceipt>,
    ) {
    }

    async swap(request: SwapRequest): Promise<SwapResponse> {
        const params = parseSwapRequest(request)

        const approvalCall = createApproveCall(this.config, {
            srcToken: params.srcToken,
            approvalAmount: params.amountToApprove
        })
        await this.backend.sendTransaction(approvalCall)
        console.log("token spend approved")

        const swapCall = createSwapCall(this.config, params)
        const swapReceipt = await this.backend.sendTransaction(swapCall)
        console.log("swap request complete")

        const requestId = extractRequestId(swapReceipt.logs)
        if (!requestId) {
            throw new Error("Swap transaction confirmed, but no requestId event found")
        }

        return { requestId }
    }

    async updateFee(requestId: Hex, srcToken: Address, newFee: bigint): Promise<void> {
        // first we must approve more funds
        const approvalParams = { srcToken, approvalAmount: newFee }
        const approvalCall = createApproveCall(this.config, approvalParams)
        await this.backend.sendTransaction(approvalCall)

        // then we make the actual transfer
        const params = { requestId, fee: newFee }
        const updateFeesCall = createUpdateFeesCall(this.config, params)
        await this.backend.sendTransaction(updateFeesCall)
    }

    async fetchRequestParams(requestId: Hex): Promise<SwapRequestParameters> {
        const requestParams = await this.backend.staticCall(createGetSwapParameters(this.config, { requestId }))
        // the solidity code doesn't provide an `amountIn`, so we calculate it
        return {
            ...requestParams,
            amountIn: requestParams.amountOut + requestParams.solverFee + requestParams.verificationFee
        }
    }

    async fetchFulfilmentReceipt(requestId: Hex): Promise<SwapRequestReceipt> {
        const response = await this.backend.staticCall(createGetSwapReceipt(this.config, { requestId }))
        const [, srcChainId, dstChainId, tokenIn, tokenOut, fulfilled, solver, recipient, amountOut, fulfilledAt] = response

        return {
            requestId,
            srcChainId,
            dstChainId,
            tokenIn,
            tokenOut,
            fulfilled,
            solver,
            recipient,
            amountOut,
            fulfilledAt,
        }
    }

}
