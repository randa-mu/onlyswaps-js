import { describe, expect, it } from "@jest/globals"
import { parseSwapParams, SwapParams } from "../src/parser"

const VALID_ADDR = "0x1111111111111111111111111111111111111111"
const VALID_TOKEN_A = "0x2222222222222222222222222222222222222222"
const VALID_TOKEN_B = "0x3333333333333333333333333333333333333333"

describe("parseSwapRequest", () => {
    it("parses valid request with string amount", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "1050",
            amountIn: "1000",
            amountOut: "1000",
            fee: "50",
            destChainId: 84532n,
        }

        const res = parseSwapParams(req)

        expect(res).toEqual({
            recipient: VALID_ADDR,
            destChainId: 84532n,
            amountToApprove: 1050n,
            amountIn: 1000n,
            amountOut: 1000n,
            fee: 50n,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
        })
    })

    it("parses a valid request that uses number for amount", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: 1050,
            amountIn: 1000,
            amountOut: "1000",
            fee: "50",
            destChainId: 84532n,
        }

        const res = parseSwapParams(req)

        expect(res).toEqual({
            recipient: VALID_ADDR,
            destChainId: 84532n,
            amountToApprove: 1050n,
            amountIn: 1000n,
            amountOut: 1000n,
            fee: 50n,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
        })
    })


    it("parses when destChainId is a string", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "110",
            amountIn: "100",
            amountOut: "100",
            fee: "10",
            destChainId: "84532",
        }

        const res = parseSwapParams(req)
        expect(res.destChainId).toBe(84532n)
    })

    it("throws if recipient is not a valid address", () => {
        const req = {
            recipient: "notanaddress",
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "1010",
            amountIn: "1000",
            amountOut: "1000",
            fee: "10",
            destChainId: 84532n,
        }

        expect(() => parseSwapParams(req)).toThrow(/Invalid address/)
    })

    it("throws if srcToken is invalid", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: "0x123",
            destToken: VALID_TOKEN_B,
            amountToApprove: "1010",
            amountIn: "1000",
            amountOut: "1000",
            fee: "10",
            destChainId: 84532n,
        }

        expect(() => parseSwapParams(req)).toThrow(/Invalid address/)
    })


    it("throws if missing amountOut", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "1010",
            amountIn: "1000",
            fee: "10",
            destChainId: 84532n,
        }

        expect(() => parseSwapParams(req)).toThrow(/Invalid input/)
    })

    it("throws if amount is non-numeric", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "1010",
            amountIn: "abc",
            amountOut: "1000",
            fee: "10",
            destChainId: 84532n,
        }

        expect(() => parseSwapParams(req)).toThrow(/Expected numeric string/)
    })

    it("throws if fee is non-numeric", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "110",
            amountIn: "100",
            amountOut: "100",
            fee: "fee10",
            destChainId: 84532n,
        }

        expect(() => parseSwapParams(req)).toThrow(/Expected numeric string/)
    })

    it("throws if destChainId is invalid string", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "110",
            amountIn: "100",
            amountOut: "100",
            fee: "10",
            destChainId: "xyz",
        }

        expect(() => parseSwapParams(req)).toThrow()
    })

    it("correctly computes totalAmount = amount + fee", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "750",
            amountIn: "500",
            amountOut: "500",
            fee: "250",
            destChainId: 1n,
        }

        const res = parseSwapParams(req)
        expect(res.amountToApprove).toBe(750n)
    })
    it("correctly handles really big numbers", () => {
        const req = {
            recipient: VALID_ADDR,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
            amountToApprove: "75000000000000000",
            amountIn: "50000000000000000",
            amountOut: "50000000000000000",
            fee: "25000000000000000",
            destChainId: 1n,
        }

        const res = parseSwapParams(req)
        expect(res.amountToApprove).toBe(75000000000000000n)
    })

    it("accepts an already valid swap params", () => {
        const req: SwapParams = {
            recipient: VALID_ADDR,
            destChainId: 84532n,
            amountToApprove: 1050n,
            amountIn: 1000n,
            amountOut: 1000n,
            fee: 50n,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
        }

        const res = parseSwapParams(req)

        expect(res).toEqual({
            recipient: VALID_ADDR,
            destChainId: 84532n,
            amountToApprove: 1050n,
            amountIn: 1000n,
            amountOut: 1000n,
            fee: 50n,
            srcToken: VALID_TOKEN_A,
            destToken: VALID_TOKEN_B,
        })
    })
})