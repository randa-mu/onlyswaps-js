import * as z from "zod"
import { Address, isAddress } from "viem"

export type SwapParams = {
    recipient: Address
    destChainId: bigint
    totalAmount: bigint
    amount: bigint
    fee: bigint
    srcToken: Address
    destToken: Address
}

export function parseSwapParams(request: unknown | SwapParams): SwapParams {
    const parsed = swapRequestSchema.parse(request)
    const totalAmount = parsed.amount + parsed.fee

    return {
        recipient: parsed.recipient,
        destChainId: parsed.destChainId,
        totalAmount,
        amount: parsed.amount,
        fee: parsed.fee,
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
    amount: bigintStringSchema,
    fee: bigintStringSchema,
    destChainId: bigintStringSchema,
})
