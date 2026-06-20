import { useEffect, useMemo, useState } from "react";
import { CountryFilter, CountryPill, ExportBtn, Pill, SearchInput, Section, Stat, Td, Th } from "@/components/admin/primitives";
import { Loader2, Link2 } from "lucide-react";
import { adminNylasApi,  NylasMonitorResponse } from "@/components/admin/api/adminNylasService";
import type { Country } from "@/mock/data";

const formatDate = (isoString: string | null) => {
  if (!isoString) return "Unknown";
  return new Date(isoString).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export function NylasMonitor() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<Country | "All">("All");
  
  const [data, setData] = useState<NylasMonitorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = await adminNylasApi.getMonitorData();
        setData(payload);
      } catch (error) {
        console.error("Failed to load Nylas integrations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = q.toLowerCase();
    return data.grants.filter((g) => {
      const c = (g.country || "US") as Country;
      return (
        (country === "All" || c === country) &&
        (g.mailbox.toLowerCase().includes(term) || g.hrId.toLowerCase().includes(term) || g.ownerEmail.toLowerCase().includes(term))
      );
    });
  }, [data, q, country]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase text-[10px]">Verifying Active Webhooks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Email & Nylas Integrations</h1>
          <p className="text-sm text-muted-foreground">Connected mailbox grants across the workspace.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={q} onChange={setQ} placeholder="Search by mailbox, HR ID, or email" />
          <CountryFilter value={country} onChange={setCountry} />
          {/* <ExportBtn /> */}
        </div>
      </div>

      {/* Grid updated to 3 columns instead of 4 since volume was removed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat label="Total Grants" value={data?.totalGrants || 0} />
        <Stat label="Active" value={data?.activeGrants || 0} />
        <Stat label="Expired / Revoked" value={data?.revokedGrants || 0} />
      </div>

      <Section title={`Connected mailboxes (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <Th>Grant ID</Th>
                <Th>HR Owner</Th>
                <Th>Connected Mailbox</Th>
                <Th>Country</Th>
                <Th>Status</Th>
                <Th>Connected At</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((g) => (
                <tr key={g.grantId} className="hover:bg-muted/10 transition-colors">
                  <Td className="font-mono text-xs text-muted-foreground">{g.grantId}</Td>
                  <Td>
                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-mono">
                      ID: {g.hrId}
                    </div>
                  </Td>
                  <Td className="flex items-center gap-2 mt-2">
                    <Link2 className="h-3 w-3 text-muted-foreground" />
                    {g.mailbox}
                  </Td>
                  <Td><CountryPill c={(g.country as Country) || "US"} /></Td>
                  <Td>
                    <Pill tone={g.status === "Active" ? "ok" : g.status === "Expired" ? "warn" : "bad"}>
                      {g.status}
                    </Pill>
                  </Td>
                  <Td className="tabular-nums text-muted-foreground">{formatDate(g.lastSync)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}