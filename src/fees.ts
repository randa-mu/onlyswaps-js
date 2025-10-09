import type { Hex } from "viem"
import { postJson } from "./util"

export type FeesRequest = {
    sourceToken: Hex
    destinationToken: Hex
    sourceChainId: bigint
    destinationChainId: bigint
    amount: bigint
}

export type FeesResponse = {
    src: ChainFee,
    dest: ChainFee,
    fees: {
        // the amount you pay the solver in wei (a flat fee)
        solver: bigint,
        // the amount the network charges in wei (scales with input amount)
        network: bigint,
        // the total of the solver and network fees
        total: bigint,
    },
    // the amount you should send to the contract to achieve the output amount you want on the destination chain
    transferAmount: bigint,
    // the amount you should approve on the ERC20 contract in order to cover all the fees
    approvalAmount: bigint,
    timestamp: Date
}

export type ChainFee = {
    // the name of the ERC-20 you're sending/receiving
    currency: string

    // the number of decimal places the currency supports; typically 18
    decimals: number

    // the average gas fee paid by solvers for fulfilling your transaction
    // on the destination chain
    swapFee: bigint

    // the average gas fee paid by the dcipher network for verifying your
    // transaction on the source chain
    relayFee: bigint

    // dcipher charges expressed as a hundredth of a percent, i.e. 500 = 5%
    bps: number
    // the divisor used to work out the fraction of token for the fee
    bpsDivisor: number
}

type FeesDto = {
    src: ChainFeeDto,
    dest: ChainFeeDto,
    fees: {
        solver: string,
        network: string,
        total: string,
    }
    transfer_amount: string,
    approval_amount: string,
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
        transferAmount: BigInt(feeResponseDto.transfer_amount),
        approvalAmount: BigInt(feeResponseDto.approval_amount),
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
