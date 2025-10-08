import type { Hex } from "viem"
import { postJson } from "./util"

export type FeesRequest = {
    sourceToken: Hex
    destinationToken: Hex
    sourceChainId: bigint
    destinationChainId: bigint
    amount: bigint
}

type FeesResponse = {
    src: ChainFee,
    dest: ChainFee,
    fees: {
        solver: bigint,
        network: bigint,
        total: bigint,
    }
    timestamp: Date
}

type FeesDto = {
    src: ChainFeeDto,
    dest: ChainFeeDto,
    fees: {
        solver: string,
        network: string,
        total: string,
    }
    timestamp: number,
}

type ChainFeeDto = {
    currency: string
    decimals: number
    swap_fee: string
    relay_fee: string
    bps: number
    bps_divisor: number
}

type ChainFee = {
    currency: string
    decimals: number
    swapFee: bigint
    relayFee: bigint
    bps: number
    bpsDivisor: number
}

type FeeRequestDto = {
    src_chain_id: number
    dest_chain_id: number
    amount: string
    src_token: Hex
    dest_token: Hex
}

export async function fetchRecommendedFees(config: FeesRequest, apiUrl = "https://fees.onlyswaps.dcipher.network/fees"): Promise<FeesResponse> {
    const responseDto = await postJson<FeesDto>(
        apiUrl,
        createRequestDto(config),
        "failed to fetch recommended fee"
    )

    return parseFees(responseDto)
}

function createRequestDto(request: FeesRequest): FeeRequestDto {
    return {
        src_chain_id: Number(request.sourceChainId),
        dest_chain_id: Number(request.destinationChainId),
        amount: request.amount.toString(10),
        src_token: request.sourceToken,
        dest_token: request.destinationToken,
    }
}

function parseFees(feeResponseDto: FeesDto): FeesResponse {
    return {
        src: parseChainFee(feeResponseDto.src),
        dest: parseChainFee(feeResponseDto.dest),
        fees: {
            solver: BigInt(feeResponseDto.fees.solver),
            network: BigInt(feeResponseDto.fees.network),
            total: BigInt(feeResponseDto.fees.total),
        },
        timestamp: new Date(feeResponseDto.timestamp)
    }
}

function parseChainFee(unparsed: ChainFeeDto): ChainFee {
    return {
        currency: unparsed.currency,
        decimals: unparsed.decimals,
        swapFee: BigInt(unparsed.swap_fee),
        relayFee: BigInt(unparsed.relay_fee),
        bps: unparsed.bps,
        bpsDivisor: unparsed.bps_divisor
    }
}
