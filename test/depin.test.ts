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
import { DePINSlashingEvaluator } from "../src/index";

describe("DePIN Slashing Evaluator Suite", () => {
  it("should evaluate node compliance and compute penalty ratio", () => {
    const good = DePINSlashingEvaluator.evaluateCompliance({
      nodeId: "node-1",
      expectedWorkloads: 100,
      actualWorkloads: 98,
      averageLatencyMs: 120,
    });
    assert.strictEqual(good.isCompliant, true);
    assert.strictEqual(good.slashingRatioBps, 0);

    const badLatency = DePINSlashingEvaluator.evaluateCompliance({
      nodeId: "node-2",
      expectedWorkloads: 100,
      actualWorkloads: 95,
      averageLatencyMs: 380, // Exceeds 250ms
    });
    assert.strictEqual(badLatency.isCompliant, false);
    assert.strictEqual(badLatency.slashingRatioBps, 1000);
  });
});
import { CapacityScheduler } from "../src/index";

describe("Capacity Scheduler Suite", () => {
  it("should calculate batch size and FLOPS allocation based on hardware specs", () => {
    const allocation = CapacityScheduler.scheduleWorkload("node-gpu-1", 32768, 4, 1000);
    assert.strictEqual(allocation.batchSize, 16);
    assert.strictEqual(allocation.allocatedFlops, 4000000000000n);
    assert.strictEqual(allocation.estimatedLatencyMs, 125);
  });
});
import { POPCChallengeEngine } from "../src/index";

describe("POPC Challenge Engine Suite", () => {
  it("should generate deterministic PoPC challenge seeds", () => {
    const c1 = POPCChallengeEngine.generateChallenge("node-1", 100);
    const c2 = POPCChallengeEngine.generateChallenge("node-1", 100);
    assert.strictEqual(c1.challengeId, c2.challengeId);
  });
});
