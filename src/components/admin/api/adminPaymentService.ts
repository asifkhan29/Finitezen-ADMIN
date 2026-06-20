import { apiClient } from "./apiClient";

export interface PaymentTxnDto {
  txnId: string;
  payer: string;
  country: string;
  role: string;
  amount: number;
  status: string;
  invoiceUrl: string | null;
  ts: string | null;
}

export interface PaymentsLedgerResponse {
  transactionCount: number;
  totalRevenue: number;
  transactions: PaymentTxnDto[];
}

export const adminPaymentApi = {
  getLedger: async (): Promise<PaymentsLedgerResponse> => {
    const res = await apiClient("/api/admin/payments", { method: "GET" });
    if (!res.ok) throw new Error("Failed to load payment ledger.");
    return res.json();
  }
};