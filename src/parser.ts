import * as z from "zod"
import { Address, Hex, isAddress, isHex } from "viem"
import { SwapRequest, Hook } from "./model"

export function parseSwapRequest(request: unknown | SwapRequest): SwapRequest {
    const parsed = swapRequestSchema.parse(request)
    let amountToApprove = parsed.amountToApprove
    if (!amountToApprove) {
        amountToApprove = parsed.amountIn + parsed.fee
    }

    return {
        recipient: parsed.recipient,
        destChainId: parsed.destChainId,
        amountIn: parsed.amountIn,
        amountOut: parsed.amountOut,
        fee: parsed.fee,
        amountToApprove,
        srcToken: parsed.srcToken,
        destToken: parsed.destToken,
        preHooks: parsed.preHooks,
        postHooks: parsed.postHooks,
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

const hexSchema = z
    .string()
    .refine((val) => isHex(val), { message: "Invalid hex string" })
    .transform((val) => val as Hex)

const hookSchema = z.object({
    target: addressSchema,
    callData: hexSchema,
    gasLimit: bigintStringSchema,
})

// this allows number, bigint and strings (that look like bigints)
const swapRequestSchema = z.object({
    recipient: addressSchema,
    srcToken: addressSchema,
    destToken: addressSchema,
    amountToApprove: bigintStringSchema.optional(),
    amountIn: bigintStringSchema,
    amountOut: bigintStringSchema,
    fee: bigintStringSchema,
    destChainId: bigintStringSchema,
    preHooks: z.array(hookSchema).optional(),
    postHooks: z.array(hookSchema).optional(),
})
