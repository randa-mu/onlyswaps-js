import { describe, it, expect } from "@jest/globals"
import { fetchTransactions } from "../src/state"

describe("state API", () => {
    it("maps valid results", async () => {
        // here's a state stolen from the state API
        // [
        //   {
        //     "request_id": "0x5d59dbac3aae43d4cebd09c6ef55a7cbcf00f4bf6169a44539df8b2db2c0b412",
        //     "src_chain_id": 84532,
        //     "dest_chain_id": 43113,
        //     "sender": "0x17b3cab3cd7502c6b85ed2e11fd5988af76cdd32",
        //     "recipient": "0x17b3cab3cd7502c6b85ed2e11fd5988af76cdd32",
        //     "token_in": "0x9eb392a6286138e5d59a40da5398e567ab3aad7c",
        //     "token_out": "0xfddcb87afed6b20cf7616a7339bc5f8ac37154c3",
        //     "amount_in": "9970000",
        //     "amount_out": "9945075",
        //     "verification_fee": "24925",
        //     "solver_fee": "30000",
        //     "state": "verified",
        //     "solver": "0xebf1b841eff6d50d87d4022372bc1191e781ab68",
        //     "requested_time": 1764846580,
        //     "solved_time": 1764846587,
        //     "verified_time": 1764935312,
        //     "requested_tx": "0x0000000000000000000000000000000000000000000000000000000000000000",
        //     "solved_tx": "0x0000000000000000000000000000000000000000000000000000000000000000",
        //     "verified_tx": "0x0000000000000000000000000000000000000000000000000000000000000000"
        //   }
        // ]

        const query = { requestId: "0x5d59dbac3aae43d4cebd09c6ef55a7cbcf00f4bf6169a44539df8b2db2c0b412" } as const
        const result = await fetchTransactions(query)
        expect(result.length).toEqual(1)
        expect(result[0].sourceChainId).toEqual(84532)
        expect(result[0].destinationChainId).toEqual(43113)
        expect(result[0].amountIn).toEqual(9970000n)
        expect(result[0].requestedTimeMs).toEqual(1764846580000)
        // test that the tx hashes are valid EVM formats
        const txHashRegex = /^0x([A-Fa-f0-9]{64})$/;
        expect(result[0].requestedTx).toMatch(txHashRegex)
        expect(result[0].solvedTx).toMatch(txHashRegex)
        expect(result[0].verifiedTx).toMatch(txHashRegex)
    })

    it("empty state returns empty array", async () => {
        const result = await fetchTransactions({ requestId: "0x00000000000000000000003b8ddca8b58294cdaf9fd8f218f576ecd8078bb589" })
        expect(result.length).toEqual(0)
    })
})