import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { CountryFilter, CountryPill, Pill, SearchInput, Section, Th } from "@/components/admin/primitives";
import { adminLimitsApi ,  AdminUserLimitDto } from "@/components/admin/api/adminLimitsService";
import type { Country } from "@/mock/data";

// Extracted fixed enum values for the top reference cards
const roleCaps = {
  "Normal HR": { searches: 2, grants: 1, emails: 25 },
  "Pro HR": { searches: 10, grants: 5, emails: 50 },
  "Elite HR": { searches: 25, grants: 10, emails: 100 },
};

function CapBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/40 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value.toLocaleString()}</div>
    </div>
  );
}

function LimitCell({ used, cap }: { used: number; cap: number }) {
  const pct = Math.min(100, Math.round((used / Math.max(1, cap)) * 100));
  const remaining = Math.max(0, cap - used);
  
  return (
    <td className="px-4 py-3 min-w-[150px]">
      <div className="flex items-center justify-between gap-2">
        <span className="tabular-nums text-sm font-medium">
          {used.toLocaleString()} <span className="text-muted-foreground text-xs font-normal">/ {cap.toLocaleString()}</span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${pct > 90 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500"}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>{pct}% used</span>
        <span>{remaining.toLocaleString()} left</span>
      </div>
    </td>
  );
}

export function LimitsPage() {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Normal HR" | "Pro HR" | "Elite HR">("All");
  const [country, setCountry] = useState<Country | "All">("All");

  const [users, setUsers] = useState<AdminUserLimitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const data = await adminLimitsApi.getLimits();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch limits:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLimits();
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return users.filter((u) => {
      const c = (u.country || "US") as Country;
      return (
        (roleFilter === "All" || u.role === roleFilter) &&
        (country === "All" || c === country) &&
        ((u.email || "").toLowerCase().includes(term) || (u.name || "").toLowerCase().includes(term))
      );
    });
  }, [users, q, roleFilter, country]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase text-[10px]">Calculating Global Quotas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Per-User Usage Limits</h1>
          <p className="text-sm text-muted-foreground">
            Strict daily quotas enforced by Stripe subscription tiers.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={q} onChange={setQ} placeholder="Search by email or name" />
          <CountryFilter value={country} onChange={setCountry} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="rounded-md border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Tiers</option>
            <option value="Normal HR">Normal HR</option>
            <option value="Pro HR">Pro HR</option>
            <option value="Elite HR">Elite HR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(roleCaps) as Array<keyof typeof roleCaps>).map((role) => (
          <div key={role} className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <Pill tone={role === "Elite HR" ? "info" : role === "Pro HR" ? "ok" : "muted"}>{role}</Pill>
              <span className="text-[11px] text-muted-foreground">Hardware locked</span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <CapBlock label="Searches" value={roleCaps[role].searches} />
              <CapBlock label="Grants" value={roleCaps[role].grants} />
              <CapBlock label="Emails" value={roleCaps[role].emails} />
            </dl>
          </div>
        ))}
      </div>

      <Section title={`Live user quotas (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <Th>User Node</Th>
                <Th>Country</Th>
                <Th>Assigned Tier</Th>
                <Th>Daily Searches</Th>
                <Th>Active Grants</Th>
                <Th>Outreach Emails</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.userId} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <Link to="/hrDetail/$id" params={{ id: u.userId }} className="font-medium hover:underline text-primary truncate max-w-[150px] block">
                      {u.name || "Unknown"}
                    </Link>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 align-top"><CountryPill c={(u.country as Country) || "US"} /></td>
                  <td className="px-4 py-3 align-top">
                    <Pill tone={u.role === "Elite HR" ? "info" : u.role === "Pro HR" ? "ok" : "muted"}>{u.role}</Pill>
                  </td>
                  <LimitCell used={u.searchesUsed} cap={u.searchesCap} />
                  <LimitCell used={u.grantsUsed} cap={u.grantsCap} />
                  <LimitCell used={u.emailsUsed} cap={u.emailsCap} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}