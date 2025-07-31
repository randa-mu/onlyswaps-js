import { expect, describe, it } from "@jest/globals"
import { rusdToString, rusdFromString, rusdFromNumber } from "../src"

describe("rusd", () => {
    describe("formatNumber", () => {
        it("formats whole numbers with 0 decimals", () => {
            expect(rusdToString(123000000n, 0)).toBe("123")
            expect(rusdToString(1000000n, 0)).toBe("1")
        })

        it("formats numbers with decimal output", () => {
            expect(rusdToString(1111000n, 3)).toBe("1.111")
            expect(rusdToString(1111000n, 6)).toBe("1.111000")
            expect(rusdToString(1999999n, 2)).toBe("1.99")
        })

        it("handles small values with leading decimal zeros", () => {
            expect(rusdToString(1n, 6)).toBe("0.000001")
            expect(rusdToString(42n, 6)).toBe("0.000042")
        })

        it("handles negative values correctly", () => {
            expect(rusdToString(-2500000n, 1)).toBe("-2.5")
            expect(rusdToString(-1n, 6)).toBe("-0.000001")
        })

        it("truncates decimals > 6 to exactly 6", () => {
            expect(rusdToString(1n, 7)).toBe("0.000001")
        })

        it("formats exactly 6 decimals", () => {
            expect(rusdToString(123456789n, 6)).toBe("123.456789")
        })

        it("truncates instead of rounding", () => {
            expect(rusdToString(1999999n, 4)).toBe("1.9999") // not 2.0000
        })
    })
    describe("formatRusd", () => {
        it("parses whole numbers correctly", () => {
            expect(rusdFromString("1")).toBe(1000000n)
            expect(rusdFromString("123")).toBe(123000000n)
        })

        it("parses decimals with fewer than 6 places", () => {
            expect(rusdFromString("1.1")).toBe(1100000n)
            expect(rusdFromString("1.11")).toBe(1110000n)
            expect(rusdFromString("1.111")).toBe(1111000n)
        })

        it("parses decimals with exactly 6 places", () => {
            expect(rusdFromString("1.123456")).toBe(1123456n)
        })

        it("parses decimals with more than 6 places (truncated)", () => {
            expect(rusdFromString("1.9999999")).toBe(1999999n)
        })

        it("parses small fractional values", () => {
            expect(rusdFromString("0.000001")).toBe(1n)
            expect(rusdFromString("0.0000009")).toBe(0n)
        })

        it("handles negative numbers", () => {
            expect(rusdFromString("-2.5")).toBe(-2500000n)
            expect(rusdFromString("-0.000001")).toBe(-1n)
        })
    })

    describe("rusdFromFloat", () => {
        it("converts whole numbers correctly", () => {
            expect(rusdFromNumber(1)).toBe(1000000n)
            expect(rusdFromNumber(123)).toBe(123000000n)
        })

        it("converts decimals accurately", () => {
            expect(rusdFromNumber(1.1)).toBe(1100000n)
            expect(rusdFromNumber(1.11)).toBe(1110000n)
            expect(rusdFromNumber(1.111)).toBe(1111000n)
            expect(rusdFromNumber(1.123456)).toBe(1123456n)
        })

        it("rounds up/down extra decimal precision beyond 6 places", () => {
            expect(rusdFromNumber(1.9999999)).toBe(2000000n)
            expect(rusdFromNumber(0.0000009)).toBe(1n)
            expect(rusdFromNumber(0.0000004)).toBe(0n)
        })

        it("handles small fractional values", () => {
            expect(rusdFromNumber(0.000001)).toBe(1n)
            expect(rusdFromNumber(0.000042)).toBe(42n)
        })

        it("handles negative values", () => {
            expect(rusdFromNumber(-2.5)).toBe(-2500000n)
            expect(rusdFromNumber(-0.000001)).toBe(-1n)
        })

        it("handles zero", () => {
            expect(rusdFromNumber(0)).toBe(0n)
            expect(rusdFromNumber(-0)).toBe(0n)
        })
    })
})
