import { HardwareFingerprintEngine, HardwareSpec } from "./hardware-fingerprint";

export class KiteDePINClient {
  public readonly chainId: bigint;

  constructor(chainId: bigint = 2368n) {
    this.chainId = chainId;
  }

  public prepareNodeRegistration(spec: HardwareSpec, teeMeasurement: string) {
    if (!HardwareFingerprintEngine.validateMinimumCapacity(spec)) {
      throw new Error("Hardware specs below minimum threshold (16GB VRAM required)");
    }
    const fingerprint = HardwareFingerprintEngine.generateFingerprint(spec, teeMeasurement);
    return {
      fingerprint,
      spec,
    };
  }
}
