import { Address, Hex, TransactionReceipt, } from "viem"
import {
    createApproveCall,
    createGetSwapParameters,
    createGetSwapReceipt,
    createSwapCall,
    createSwapCallWithHooks,
    createGetHookExecutorCall,
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
import { fetchTransactions, TransactionState, TransactionStateQuery } from "./state"

export class RouterClient {
    constructor(
        private readonly config: OnlySwapsConfig,
        private readonly backend: ChainBackend<TransactionReceipt>,
    ) {
    }

    async swap(request: SwapRequest): Promise<SwapResponse> {
        const params = parseSwapRequest(request)

        // Check if there are any hooks
        const hasPreHooks = params.preHooks && params.preHooks.length > 0
        const hasPostHooks = params.postHooks && params.postHooks.length > 0
        const hasHooks = hasPreHooks || hasPostHooks
        
        // If there are any hooks, validate hook executor is not zero address
        let finalRequest = params
        if (hasHooks) {
            const hookExecutor = await this.getHookExecutor()
            if (hookExecutor === "0x0000000000000000000000000000000000000000") {
                throw new Error("Hook executor address is zero address, but hooks are provided")
            }
            
            // Only change recipient if there are postHooks
            // PostHooks need the hook executor to receive tokens and execute hooks
            if (hasPostHooks) {
                finalRequest = {
                    ...params,
                    recipient: hookExecutor
                }
            }
        }

        const approvalCall = createApproveCall(this.config, {
            srcToken: finalRequest.srcToken,
            approvalAmount: finalRequest.amountToApprove
        })
        await this.backend.sendTransaction(approvalCall)
        console.log("token spend approved")

        // Use hooks version if hooks are provided
        const swapCall = hasHooks 
            ? createSwapCallWithHooks(this.config, finalRequest)
            : createSwapCall(this.config, finalRequest)
        const swapReceipt = await this.backend.sendTransaction(swapCall)
        console.log("swap request complete")

        const requestId = extractRequestId(swapReceipt.logs)
        if (!requestId) {
            throw new Error("Swap transaction confirmed, but no requestId event found")
        }

        return { requestId, transactionHash: swapReceipt.transactionHash }
    }

    async getHookExecutor(): Promise<Address> {
        const hookExecutor = await this.backend.staticCall(createGetHookExecutorCall(this.config))
        return hookExecutor as Address
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

    async fetchTransactions(query: Partial<TransactionStateQuery>, apiUrl?: string): Promise<Array<TransactionState>> {
        return fetchTransactions(query, apiUrl)
    }

}
