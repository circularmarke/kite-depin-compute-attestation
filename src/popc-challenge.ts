import { ethers } from "ethers";

export interface POPCChallenge {
  challengeId: string;
  seed: string;
  difficulty: number;
}

export class POPCChallengeEngine {
  public static generateChallenge(nodeId: string, slot: number): POPCChallenge {
    const seed = ethers.solidityPackedKeccak256(["string", "uint256"], [nodeId, slot]);
    return {
      challengeId: ethers.id(seed),
      seed,
      difficulty: 4,
    };
  }

  public static verifyProofOfPhysicalCompute(
    challenge: POPCChallenge,
    solution: string
  ): boolean {
    const hash = ethers.solidityPackedKeccak256(
      ["string", "string"],
      [challenge.seed, solution]
    );
    return hash.slice(2, 2 + challenge.difficulty) === "0".repeat(challenge.difficulty);
  }
}
