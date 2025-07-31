import { expect, describe, it } from "@jest/globals"
import { rusdToString, rusdFromString, rusdFromNumber } from "../src"

describe("rusd (18 decimal places)", () => {
    describe("rusdToString", () => {
        it("formats whole numbers with 0 decimals", () => {
            expect(rusdToString(123000000000000000000n, 0)).toBe("123")
            expect(rusdToString(1000000000000000000n, 0)).toBe("1")
        })

        it("formats numbers with decimal output", () => {
            expect(rusdToString(1111000000000000000n, 3)).toBe("1.111")
            expect(rusdToString(1111000000000000000n, 6)).toBe("1.111000")
            expect(rusdToString(1999999000000000000n, 2)).toBe("1.99")
        })

        it("handles small values with leading decimal zeros", () => {
            expect(rusdToString(1n, 6)).toBe("0.000000")
            expect(rusdToString(42n, 6)).toBe("0.000000")
            expect(rusdToString(42000000000000n, 6)).toBe("0.000042")
        })

        it("handles negative values correctly", () => {
            expect(rusdToString(-2500000000000000000n, 1)).toBe("-2.5")
            expect(rusdToString(-1n, 6)).toBe("-0.000000")
            expect(rusdToString(-1000000000000n, 6)).toBe("-0.000001")
        })

        it("truncates decimals > 18 to exactly 18", () => {
            expect(rusdToString(1n, 19)).toBe("0.000000000000000001") // implementation should truncate to 18 dp
        })

        it("formats exactly 6 decimals", () => {
            expect(rusdToString(123456789000000000000n, 6)).toBe("123.456789")
        })

        it("truncates instead of rounding", () => {
            expect(rusdToString(1999999000000000000n, 4)).toBe("1.9999") // not 2.0000
        })
    })

    describe("rusdFromString", () => {
        it("parses whole numbers correctly", () => {
            expect(rusdFromString("1")).toBe(1000000000000000000n)
            expect(rusdFromString("123")).toBe(123000000000000000000n)
        })

        it("parses decimals with fewer than 18 places", () => {
            expect(rusdFromString("1.1")).toBe(1100000000000000000n)
            expect(rusdFromString("1.11")).toBe(1110000000000000000n)
            expect(rusdFromString("1.111")).toBe(1111000000000000000n)
        })

        it("parses decimals with exactly 18 places", () => {
            expect(rusdFromString("1.123456789012345678")).toBe(1123456789012345678n)
        })

        it("parses decimals with more than 18 places (truncated)", () => {
            expect(rusdFromString("1.9999999999999999999")).toBe(1999999999999999999n)
        })

        it("parses small fractional values", () => {
            expect(rusdFromString("0.000000000000000001")).toBe(1n)
            expect(rusdFromString("0.0000000000000000009")).toBe(0n)
        })

        it("handles negative numbers", () => {
            expect(rusdFromString("-2.5")).toBe(-2500000000000000000n)
            expect(rusdFromString("-0.000000000000000001")).toBe(-1n)
        })
    })

    describe("rusdFromNumber", () => {
        it("converts whole numbers correctly", () => {
            expect(rusdFromNumber(1)).toBe(1000000000000000000n)
            expect(rusdFromNumber(123)).toBe(123000000000000000000n)
        })

        it("converts decimals accurately", () => {
            expect(rusdFromNumber(1.1)).toBe(1100000000000000000n)
            expect(rusdFromNumber(1.11)).toBe(1110000000000000000n)
            expect(rusdFromNumber(1.111)).toBe(1111000000000000000n)
            expect(rusdFromNumber(1.123456789045678)).toBe(1123456789045678000n)
        })

        it("rounds extra decimal precision beyond 18 places", () => {
            expect(rusdFromNumber(0.0000000000000000009)).toBe(1n)
            expect(rusdFromNumber(0.0000000000000000004)).toBe(0n)
        })

        it("handles small fractional values", () => {
            expect(rusdFromNumber(0.000000000000000001)).toBe(1n)
            expect(rusdFromNumber(0.000000000000042)).toBe(42000n)
        })

        it("handles negative values", () => {
            expect(rusdFromNumber(-2.5)).toBe(-2500000000000000000n)
            expect(rusdFromNumber(-0.000000000000000001)).toBe(-1n)
        })

        it("handles zero", () => {
            expect(rusdFromNumber(0)).toBe(0n)
            expect(rusdFromNumber(-0)).toBe(0n)
        })
    })
})
