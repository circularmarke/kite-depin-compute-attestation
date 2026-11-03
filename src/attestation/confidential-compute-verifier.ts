import crypto from 'crypto';

export interface TeeAttestationReport {
  enclaveMeasurement: string;
  reportDataHex: string;
  signedQuoteBase64: string;
  timestamp: number;
}

export class ConfidentialComputeVerifier {
  public static verifyReportHash(expectedHash: string, actualReportDataHex: string): boolean {
    const cleanActual = actualReportDataHex.startsWith('0x') ? actualReportDataHex.slice(2) : actualReportDataHex;
    const cleanExpected = expectedHash.startsWith('0x') ? expectedHash.slice(2) : expectedHash;
    return cleanActual.toLowerCase() === cleanExpected.toLowerCase();
  }

  public static hashEnclavePayload(payload: Buffer): string {
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}
