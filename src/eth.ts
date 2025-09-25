import { Abi, decodeErrorResult, PublicActions, TransactionReceipt } from "viem"

// throwOnError will do some magical parsing and simulation to get a useful error message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function throwOnError(receipt: TransactionReceipt, abi: Abi, client: PublicActions, params: any) {
    if (receipt.status === "success") {
        return
    }
    try {
        await client.simulateContract(params)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err)
        const errData = err?.data
        const decodedError = decodeErrorResult({ abi, data: errData })
        throw new Error(`transaction reverted: ${decodedError}`)
    }

    throw new Error("transaction failed for unknown revert reason")
}