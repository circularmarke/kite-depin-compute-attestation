import { HardwareFingerprintEngine, CapacityScheduler, POPCChallengeEngine } from "../src/index";

console.log("=== Running DePIN Hardware Benchmark Simulator ===");
const spec = { chipset: "NVIDIA RTX 4090", vramMb: 24576, flopsTier: 4 };
console.log("Validating Capacity:", HardwareFingerprintEngine.validateMinimumCapacity(spec));

const allocation = CapacityScheduler.scheduleWorkload("benchmark-node-0", spec.vramMb, spec.flopsTier, 4096);
console.log("Allocated Batch Size:", allocation.batchSize);
console.log("Allocated FLOPS:", allocation.allocatedFlops.toString());

const challenge = POPCChallengeEngine.generateChallenge("benchmark-node-0", 123456);
console.log("PoPC Challenge ID:", challenge.challengeId);
console.log("All systems operational.");
