import { getJson } from "./util"

export type TransactionStateQuery = {
    requestId: `0x${string}`
    chainId: number
    address: `0x${string}`
    sender: `0x${string}`
    recipient: `0x${string}`
    solver: `0x${string}`
    requestedTimeStartMs: number
    requestedTimeEndMs: number
    verifiedTimeStartMs: number
    verifiedTimeEndMs: number
    limit: number
    offset: number
}

export type TransactionState = {
    requestId: `0x${string}`
    sourceChainId: number
    destinationChainId: number
    sender: `0x${string}`
    recipient: `0x${string}`
    tokenIn: `0x${string}`
    tokenOut: `0x${string}`
    amountIn: bigint
    amountOut: bigint
    verificationFee: bigint
    solverFee: bigint
    state: string
    solver?: `0x${string}`
    requestedTimeMs: number
    solvedTimeMs?: number
    verifiedTimeMs?: number
    requestedTx?: `0x${string}`
    solvedTx?: `0x${string}`
    verifiedTx?: `0x${string}`
}

type TransactionStateDto = {
    request_id: `0x${string}`
    src_chain_id: number
    dest_chain_id: number
    sender: `0x${string}`
    recipient: `0x${string}`
    token_in: `0x${string}`
    token_out: `0x${string}`
    amount_in: string
    amount_out: string
    verification_fee: string
    solver_fee: string
    state: string
    solver?: `0x${string}`
    requested_time: number
    solved_time?: number
    verified_time?: number
    requested_tx?: `0x${string}`
    solved_tx?: `0x${string}`
    verified_tx?: `0x${string}`
}

const DEFAULT_API_URL = "https://onlyswaps-state-api-mainnet.onlyswaps.dcipher.network/transactions"
export async function fetchTransactions(query: Partial<TransactionStateQuery>, apiUrl = DEFAULT_API_URL): Promise<Array<TransactionState>> {
    const encodedQuery = createQueryString(query)
    const responseDto = await getJson<Array<TransactionStateDto>>(`${apiUrl}${encodedQuery}`)
    return responseDto.map(dto => parseTransactionState(dto))
}

function createQueryString(query: Partial<TransactionStateQuery>): string {
    const kv: Record<string, string> = {}
    if (query.requestId) {
        kv["request_id"] = query.requestId
    }
    if (query.chainId) {
        kv["chain_id"] = query.chainId.toString()
    }
    if (query.address) {
        kv["address"] = query.address
    }
    if (query.sender) {
        kv["sender"] = query.sender
    }
    if (query.recipient) {
        kv["recipient"] = query.recipient
    }
    if (query.solver) {
        kv["solver"] = query.solver
    }
    if (query.requestedTimeStartMs) {
        kv["requested_time_start"] = query.requestedTimeStartMs.toString()
    }
    if (query.requestedTimeEndMs) {
        kv["requested_time_end"] = query.requestedTimeEndMs.toString()
    }
    if (query.verifiedTimeStartMs) {
        kv["verified_time_start"] = query.verifiedTimeStartMs.toString()
    }
    if (query.limit) {
        kv["limit"] = query.limit.toString()
    }
    if (query.offset) {
        kv["offset"] = query.offset.toString()
    }

    let output = ""
    const records = Object.entries(kv)
    for (let i = 0; i < records.length; i++) {
        const [key, value] = records[i]
        if (i === 0) {
            output += `?${key}=${value}`
        } else {
            output += `&${key}=${value}`
        }
    }
    return output
}

function parseTransactionState(dto: TransactionStateDto): TransactionState {
    return {
        requestId: dto.request_id,
        sourceChainId: dto.src_chain_id,
        destinationChainId: dto.dest_chain_id,
        sender: dto.sender,
        recipient: dto.recipient,
        tokenIn: dto.token_in,
        tokenOut: dto.token_out,
        amountIn: BigInt(dto.amount_in),
        amountOut: BigInt(dto.amount_out),
        verificationFee: BigInt(dto.verification_fee),
        solverFee: BigInt(dto.solver_fee),
        state: dto.state,
        solver: dto.solver,
        requestedTimeMs: dto.requested_time * 1000,
        solvedTimeMs: dto.solved_time ? dto.solved_time * 1000 : undefined,
        verifiedTimeMs: dto.verified_time ? dto.verified_time * 1000 : undefined,
        requestedTx: dto.requested_tx,
        solvedTx: dto.solved_tx,
        verifiedTx: dto.verified_tx,
    }
}
