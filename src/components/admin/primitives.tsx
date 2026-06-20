import { Download, Search, TrendingDown, TrendingUp } from "lucide-react";

// 1. --- PRODUCTION COUNTRY CONFIGURATION ---
// Moved here from mock data because the backend relies on these exact 2-letter codes.
export type Country = "US" | "CA" | "IN" | "AE" | "SA" | "GB";

export const COUNTRY_FLAG: Record<Country, string> = {
  US: "🇺🇸",
  CA: "🇨🇦",
  IN: "🇮🇳",
  AE: "🇦🇪",
  SA: "🇸🇦",
  GB: "🇬🇧",
};

export const COUNTRY_NAME: Record<Country, string> = {
  US: "USA",
  CA: "Canada",
  IN: "India",
  AE: "UAE",
  SA: "Saudi Arabia",
  GB: "UK",
};
// ------------------------------------------

export function Stat({
  label,
  value,
  sub,
  icon: Icon,
  delta,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: any;
  delta?: { value: string; up?: boolean };
  tone?: "default" | "brand";
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
      {tone === "brand" && (
        <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: "var(--gradient-brand)" }} />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        {Icon && (
          <div className="h-8 w-8 rounded-lg grid place-items-center bg-accent text-accent-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        {delta && (
          <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${delta.up ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-700 dark:text-red-400"}`}>
            {delta.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta.value}
          </span>
        )}
        {sub && <span className="truncate">{sub}</span>}
      </div>
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Pill({ tone = "muted", children }: { tone?: "muted" | "ok" | "warn" | "bad" | "info"; children: React.ReactNode }) {
  const map = {
    muted: "bg-muted text-muted-foreground",
    ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    warn: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    bad: "bg-red-500/10 text-red-700 dark:text-red-400",
    info: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${map}`}>{children}</span>;
}

export function ExportBtn() {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted">
      <Download className="h-3.5 w-3.5" /> Export CSV
    </button>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-64 rounded-md border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

// Updated to use the new 2-letter mapping dynamically
export function CountryFilter({ value, onChange }: { value: Country | "All"; onChange: (v: Country | "All") => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Country | "All")}
      className="rounded-md border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
      title="Filter by country"
    >
      <option value="All">🌍 All countries</option>
      {(Object.keys(COUNTRY_NAME) as Country[]).map((code) => (
        <option key={code} value={code}>
          {COUNTRY_FLAG[code]} {COUNTRY_NAME[code]}
        </option>
      ))}
    </select>
  );
}

// Updated to display the Full Name but accept the 2-letter code
export function CountryPill({ c }: { c?: Country | string }) {
  if (!c) return <span className="text-xs text-muted-foreground">—</span>;
  
  const flag = COUNTRY_FLAG[c as Country] || "🌐";
  const name = COUNTRY_NAME[c as Country] || c;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
      <span>{flag}</span>
      <span>{name}</span>
    </span>
  );
}

export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left font-medium px-4 py-2 ${className}`}>{children}</th>;
}
export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}