import * as z from "zod"
import { Address, isAddress } from "viem"

export type SwapParams = {
    recipient: Address
    destChainId: bigint
    amountToApprove: bigint
    amountIn: bigint,
    amountOut: bigint,
    fee: bigint
    srcToken: Address
    destToken: Address
}

export function parseSwapParams(request: unknown | SwapParams): SwapParams {
    const parsed = swapRequestSchema.parse(request)

    return {
        recipient: parsed.recipient,
        destChainId: parsed.destChainId,
        amountToApprove: parsed.amountToApprove,
        amountIn: parsed.amountIn,
        fee: parsed.fee,
        amountOut: parsed.amountOut,
        srcToken: parsed.srcToken,
        destToken: parsed.destToken,
    }
}


const addressSchema = z
    .string()
    .refine((val) => isAddress(val), { message: "Invalid address" })
    .transform((val) => val as Address)

const bigintStringSchema = z
    .union([
        z.bigint(),
        z.string().regex(/^\d+$/, { message: "Expected numeric string" }),
        z.number().int().nonnegative()
    ])
    .transform((val) => BigInt(val))

// this allows number, bigint and strings (that look like bigints)
const swapRequestSchema = z.object({
    recipient: addressSchema,
    srcToken: addressSchema,
    destToken: addressSchema,
    amountToApprove: bigintStringSchema,
    amountIn: bigintStringSchema,
    amountOut: bigintStringSchema,
    fee: bigintStringSchema,
    destChainId: bigintStringSchema,
})
