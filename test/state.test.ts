import { describe, it, expect } from "@jest/globals"
import { fetchTransactions } from "../src/state"

describe("state API", () => {
    it("maps valid results", async () => {
        // here's a state stolen from the
        // [
        //     {
        //         "request_id": "0x47c48898ee916439a75c423b8ddca8b58294cdaf9fd8f218f576ecd8078bb589",
        //         "src_chain_id": 43113,
        //         "dest_chain_id": 84532,
        //         "sender": "0x23bcb0d1706d2733eb0f7f0e757f76957135448a",
        //         "recipient": "0x23bcb0d1706d2733eb0f7f0e757f76957135448a",
        //         "token_in": "0xfddcb87afed6b20cf7616a7339bc5f8ac37154c3",
        //         "token_out": "0x9eb392a6286138e5d59a40da5398e567ab3aad7c",
        //         "amount_in": "997575",
        //         "amount_out": "965150",
        //         "verification_fee": "2425",
        //         "solver_fee": "30000",
        //         "state": "verified",
        //         "solver": "0xebf1b841eff6d50d87d4022372bc1191e781ab68",
        //         "requested_time": 1764597498,
        //         "solved_time": 1764597506,
        //         "verified_time": 1764597509
        //     }
        // ]
        //

        const query = { requestId: "0x47c48898ee916439a75c423b8ddca8b58294cdaf9fd8f218f576ecd8078bb589" } as const
        const result = await fetchTransactions(query)
        expect(result.length).toEqual(1)
        expect(result[0].sourceChainId).toEqual(43113)
        expect(result[0].destinationChainId).toEqual(84532)
        expect(result[0].amountIn).toEqual(997575n)
        expect(result[0].requestedTimeMs).toEqual(1764597498000)
    })

    it("empty state returns empty array", async () => {
        const result = await fetchTransactions({ requestId: "0x00000000000000000000003b8ddca8b58294cdaf9fd8f218f576ecd8078bb589" })
        expect(result.length).toEqual(0)
    })
})