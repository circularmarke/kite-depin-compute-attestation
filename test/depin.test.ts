import { describe, it } from "node:test";
import assert from "node:assert";
import { HardwareFingerprintEngine, KiteDePINClient } from "../src/index";

describe("Kite DePIN Compute Attestation Test Suite", () => {
  it("should validate minimum hardware capacity requirements", () => {
    assert.strictEqual(HardwareFingerprintEngine.validateMinimumCapacity({
      chipset: "RTX-4090",
      vramMb: 24576,
      flopsTier: 3,
    }), true);

    assert.strictEqual(HardwareFingerprintEngine.validateMinimumCapacity({
      chipset: "GTX-1060",
      vramMb: 6144, // 6GB
      flopsTier: 0,
    }), false);
  });

  it("should generate deterministic TEE hardware fingerprints", () => {
    const spec = { chipset: "H100-SXM", vramMb: 81920, flopsTier: 5 };
    const fp1 = HardwareFingerprintEngine.generateFingerprint(spec, "measurement-abc");
    const fp2 = HardwareFingerprintEngine.generateFingerprint(spec, "measurement-abc");
    assert.strictEqual(fp1, fp2);
  });

  it("should prepare valid node registration payload via client", () => {
    const client = new KiteDePINClient();
    const result = client.prepareNodeRegistration(
      { chipset: "A100-80GB", vramMb: 81920, flopsTier: 4 },
      "tee-hash-123"
    );
    assert.strictEqual(result.spec.vramMb, 81920);
  });
});
