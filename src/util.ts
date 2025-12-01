import { parseAbi, parseEventLogs } from "viem"
import type { Log, RpcLog } from "viem"

export async function postJson<T>(
    url: string,
    body: unknown,
    errorMessage: string = "error posting: ",
): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        throw new Error(`${errorMessage} (status ${res.status} ${res.statusText})`)
    }

    return res.json()
}

export async function getJson<T>(
    url: string,
    errorMessage: string = "error getting: ",
): Promise<T> {
    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
        throw new Error(`${errorMessage} (status ${res.status} ${res.statusText})`)
    }

    return res.json()
}

export function extractRequestId(logs: Log[] | RpcLog[]): `0x${string}` | null {
    const events = parseEventLogs({
        abi: parseAbi([
            "event SwapRequested(bytes32 indexed requestId, uint256 indexed srcChainId, uint256 indexed dstChainId)",
        ]),
        eventName: "SwapRequested",
        logs,
    })

    return events.length > 0 ? events[0].args.requestId : null
}
