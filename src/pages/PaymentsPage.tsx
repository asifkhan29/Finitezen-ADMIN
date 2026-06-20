import { useEffect, useMemo, useState } from "react";
import { CountryFilter, CountryPill, ExportBtn, Pill, SearchInput, Section, Td, Th } from "@/components/admin/primitives";
import { ExternalLink, Loader2 } from "lucide-react";
import { adminPaymentApi , PaymentsLedgerResponse } from "@/components/admin/api/adminPaymentService";
import type { Country } from "@/mock/data";

const formatDate = (isoString: string | null) => {
  if (!isoString) return "Unknown";
  return new Date(isoString).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export function PaymentsPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<Country | "All">("All");
  
  const [data, setData] = useState<PaymentsLedgerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = await adminPaymentApi.getLedger();
        setData(payload);
      } catch (error) {
        console.error("Failed to load payment ledger:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = q.toLowerCase();
    return data.transactions.filter((p) => {
      const c = (p.country || "US") as Country;
      return (
        (country === "All" || c === country) &&
        (p.payer.toLowerCase().includes(term) || p.txnId.toLowerCase().includes(term))
      );
    });
  }, [data, q, country]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase text-[10px]">Syncing Billing Ledger...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Payments & Revenue</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} transactions · ${data?.totalRevenue.toFixed(2)} captured
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={q} onChange={setQ} placeholder="Search by email or txn id" />
          <CountryFilter value={country} onChange={setCountry} />
          {/* <ExportBtn /> */}
        </div>
      </div>

      <Section title="Ledger History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <Th>Txn ID</Th>
                <Th>Payer</Th>
                <Th>Country</Th>
                <Th>Purchased Tier</Th>
                <Th>Status</Th>
                <Th>Amount</Th>
                <Th>Timestamp</Th>
                <Th className="text-right">Receipt</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.txnId} className="hover:bg-muted/10 transition-colors">
                  <Td className="font-mono text-xs text-muted-foreground truncate max-w-[120px]" title={p.txnId}>
                    {p.txnId}
                  </Td>
                  <Td className="font-medium">{p.payer}</Td>
                  <Td><CountryPill c={(p.country as Country) || "US"} /></Td>
                  <Td>
                    <Pill tone={p.role === "ELITE" ? "info" : p.role === "PRO" ? "ok" : "muted"}>
                      {p.role}
                    </Pill>
                  </Td>
                  <Td>
                    <Pill tone={p.status?.toLowerCase() === "paid" ? "ok" : "bad"}>
                      {p.status?.toUpperCase() || "UNKNOWN"}
                    </Pill>
                  </Td>
                  <Td className="tabular-nums font-semibold">${p.amount.toFixed(2)}</Td>
                  <Td className="tabular-nums text-muted-foreground">{formatDate(p.ts)}</Td>
                  <Td className="text-right">
                    {p.invoiceUrl ? (
                      <a 
                        href={p.invoiceUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors hover:underline"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}