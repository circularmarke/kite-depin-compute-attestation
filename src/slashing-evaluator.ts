export interface NodeHeartbeatReport {
  nodeId: string;
  expectedWorkloads: number;
  actualWorkloads: number;
  averageLatencyMs: number;
}

export class DePINSlashingEvaluator {
  public static evaluateCompliance(report: NodeHeartbeatReport, maxLatencyMs: number = 250): { isCompliant: boolean; slashingRatioBps: number } {
    if (report.actualWorkloads < report.expectedWorkloads * 0.8) {
      return { isCompliant: false, slashingRatioBps: 2000 }; // 20% slash for dropped capacity
    }
    if (report.averageLatencyMs > maxLatencyMs) {
      return { isCompliant: false, slashingRatioBps: 1000 }; // 10% slash for latency breach
    }
    return { isCompliant: true, slashingRatioBps: 0 };
  }
}
