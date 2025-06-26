import { OnlySwaps } from "../src"
import { test } from "@jest/globals"

test("swap resolve", async () => {
  const onlyswaps = new OnlySwaps()
  await onlyswaps.swap({ amount: 1n, sourceChain: 1n, destinationChain: 2n })
})

