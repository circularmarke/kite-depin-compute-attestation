export interface WorkloadAllocation {
  nodeId: string;
  batchSize: number;
  allocatedFlops: bigint;
  estimatedLatencyMs: number;
}

export class CapacityScheduler {
  public static scheduleWorkload(
    nodeId: string,
    vramMb: number,
    flopsTier: number,
    requiredTokens: number
  ): WorkloadAllocation {
    if (vramMb < 16384) {
      throw new Error("Insufficient VRAM to schedule batch: 16GB required");
    }

    const batchSize = Math.min(Math.floor(vramMb / 2048), 32);
    const allocatedFlops = BigInt(flopsTier) * 1000000000000n; // FLOPS multiplier
    const estimatedLatencyMs = Math.max(20, Math.floor(1000 / (flopsTier * 2)));

    return {
      nodeId,
      batchSize,
      allocatedFlops,
      estimatedLatencyMs,
    };
  }
}
