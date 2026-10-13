export interface NodeEarningsAccount {
  nodeId: string;
  accumulatedWei: bigint;
  withdrawnWei: bigint;
  lastPayoutSlot: bigint;
}

export class StreamingLedger {
  private accounts: Map<string, NodeEarningsAccount> = new Map();
  public readonly ratePerTokenWei: bigint;

  constructor(ratePerTokenWei: bigint = 1000000000n) {
    this.ratePerTokenWei = ratePerTokenWei;
  }

  public creditInferenceTokens(nodeId: string, tokensGenerated: number, currentSlot: bigint): void {
    const acc = this.accounts.get(nodeId) || {
      nodeId,
      accumulatedWei: 0n,
      withdrawnWei: 0n,
      lastPayoutSlot: currentSlot,
    };

    const earned = BigInt(tokensGenerated) * this.ratePerTokenWei;
    acc.accumulatedWei += earned;
    acc.lastPayoutSlot = currentSlot;
    this.accounts.set(nodeId, acc);
  }

  public claimEarnings(nodeId: string): bigint {
    const acc = this.accounts.get(nodeId);
    if (!acc) throw new Error("Node account not found in ledger");

    const claimable = acc.accumulatedWei - acc.withdrawnWei;
    if (claimable <= 0n) throw new Error("No claimable rewards available");

    acc.withdrawnWei += claimable;
    return claimable;
  }

  public getBalance(nodeId: string): bigint {
    const acc = this.accounts.get(nodeId);
    return acc ? acc.accumulatedWei - acc.withdrawnWei : 0n;
  }
}
