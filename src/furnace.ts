import { defineChain } from "viem"

export const furnace = defineChain({
    id: 64_630,
    name: "Furnace",
    network: "furnace",

    nativeCurrency: {
        name: "Furnace Token",
        symbol: "FIRE",
        decimals: 18
    },

    rpcUrls: {
        public:  {
            webSocket: ["wss://ws.furnace.dcipher.network"],
            http: ["https://api.furnace.dcipher.network"]
        },
        default: {
            webSocket: ["wss://ws.furnace.dcipher.network"],
            http: ["https://api.furnace.dcipher.network"]
        }
    },

    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://blockscout.firepit.network"
        }
    }
})
