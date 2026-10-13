import { ethers } from "ethers";

export interface HardwareSpec {
  chipset: string;
  vramMb: number;
  flopsTier: number;
}

export class HardwareFingerprintEngine {
  public static generateFingerprint(spec: HardwareSpec, teeMeasurement: string): string {
    return ethers.solidityPackedKeccak256(
      ["string", "uint256", "uint256", "string"],
      [spec.chipset, spec.vramMb, spec.flopsTier, teeMeasurement]
    );
  }

  public static validateMinimumCapacity(spec: HardwareSpec): boolean {
    // Minimum 16GB VRAM for decent LLM inference
    return spec.vramMb >= 16384 && spec.flopsTier >= 1;
  }
}
