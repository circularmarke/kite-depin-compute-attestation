export interface GpuMetrics {
  gpuIndex: number;
  utilizationPercentage: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  temperatureCelsius: number;
  powerDrawWatts: number;
}

export interface NodeTelemetryPacket {
  nodeId: string;
  timestamp: number;
  gpus: GpuMetrics[];
  activeInferenceJobs: number;
  hardwareProofSignature: string;
}

export class TelemetryCollectorDaemon {
  private packetHistory: NodeTelemetryPacket[] = [];
  public readonly retentionWindowMs: number;

  constructor(retentionWindowMs: number = 3600_000) {
    this.retentionWindowMs = retentionWindowMs;
  }

  public recordTelemetry(packet: NodeTelemetryPacket): void {
    if (packet.gpus.length === 0) {
      throw new Error("Invalid telemetry packet: at least 1 GPU device must be present");
    }
    this.packetHistory.push(packet);
    this.pruneOldPackets(packet.timestamp);
  }

  public calculateAverageUtilization(): number {
    if (this.packetHistory.length === 0) return 0;
    let totalUtil = 0;
    let totalGpus = 0;

    for (const pkt of this.packetHistory) {
      for (const gpu of pkt.gpus) {
        totalUtil += gpu.utilizationPercentage;
        totalGpus++;
      }
    }
    return totalGpus > 0 ? totalUtil / totalGpus : 0;
  }

  private pruneOldPackets(currentTime: number): void {
    const cutoff = currentTime - this.retentionWindowMs;
    this.packetHistory = this.packetHistory.filter((p) => p.timestamp >= cutoff);
  }
}
