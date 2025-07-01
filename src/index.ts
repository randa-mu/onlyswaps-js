

export type Swap = {
    amount: bigint
    sourceChain: bigint
    destinationChain: bigint
}


export class OnlySwaps {
    swap(options: Swap): Promise<void> {
        return Promise.resolve()
    }
}
