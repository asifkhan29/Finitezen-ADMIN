import { useEffect, useState } from "react";
import { Activity, DollarSign, Download, Globe2, Inbox, Mail, Sparkles, Users, Loader2 } from "lucide-react";
import { Section, Stat } from "@/components/admin/primitives";
import { adminDashboardApi , DashboardMetricsResponse } from "@/components/admin/api/adminDashboardService";

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await adminDashboardApi.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load telemetry data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase text-[10px]">Aggregating Platform Telemetry...</span>
      </div>
    );
  }

  // Safe percentage calculations to avoid NaN if totalUsers is 0
  const elitePct = metrics.totalUsers > 0 ? Math.round((metrics.eliteUsers / metrics.totalUsers) * 100) : 0;
  const proPct = metrics.totalUsers > 0 ? Math.round((metrics.proUsers / metrics.totalUsers) * 100) : 0;
  const normalPct = metrics.totalUsers > 0 ? 100 - elitePct - proPct : 0;

  const mailPct = metrics.totalResumes > 0 ? Math.round((metrics.byMail / metrics.totalResumes) * 100) : 0;
  const bulkPct = metrics.totalResumes > 0 ? Math.round((metrics.byBulk / metrics.totalResumes) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="absolute inset-0 -z-0 opacity-90" style={{ background: "var(--gradient-brand)" }} />
        <div className="absolute inset-0 -z-0 opacity-30 [background:radial-gradient(40%_60%_at_80%_20%,white,transparent_60%)]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-primary-foreground">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-medium mb-3">
              <Sparkles className="h-3 w-3" /> Welcome back, Admin
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Finitezen AI Console</h1>
            <p className="text-sm opacity-90 mt-1">Live snapshot of users, ingestion, integrations and revenue.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur px-3 py-2 text-xs font-medium transition">View report</button>
            <button className="rounded-lg bg-white text-foreground hover:bg-white/90 px-3 py-2 text-xs font-medium transition inline-flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat tone="brand" icon={Users} label="Total HR Users" value={metrics.totalUsers} delta={{ value: "Live", up: true }} sub="active nodes" />
        <Stat icon={Inbox} label="Resumes Processed" value={metrics.totalResumes.toLocaleString()} delta={{ value: "Live", up: true }} sub={`${metrics.byMail.toLocaleString()} via email`} />
        <Stat icon={Mail} label="Emails Sent" value={metrics.emailsSent.toLocaleString()} delta={{ value: "Live", up: true }} sub="global volume" />
        <Stat icon={DollarSign} label="Total Revenue" value={`$${metrics.totalRevenue.toFixed(2)}`} delta={{ value: "Live", up: true }} sub={`${metrics.transactionCount} transactions`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Role distribution" action={<span className="text-[11px] text-muted-foreground">{metrics.totalUsers} users</span>}>
          <div className="p-5 space-y-4">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${elitePct}%` }} />
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${proPct}%` }} />
              <div className="h-full bg-slate-400 transition-all duration-1000" style={{ width: `${normalPct}%` }} />
            </div>
            {[
              { label: "Elite HR", count: metrics.eliteUsers, pct: elitePct, dot: "bg-violet-500" },
              { label: "Pro HR", count: metrics.proUsers, pct: proPct, dot: "bg-emerald-500" },
              { label: "Normal HR", count: metrics.normalUsers, pct: normalPct, dot: "bg-slate-400" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${r.dot}`} /> {r.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {r.count.toLocaleString()} <span className="text-xs">· {r.pct}%</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Ingestion breakdown" action={<span className="text-[11px] text-muted-foreground">global lifetime</span>}>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">via Email</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{metrics.byMail.toLocaleString()}</div>
              <div className="text-[11px] text-muted-foreground">{mailPct}% of total</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">via Bulk</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{metrics.byBulk.toLocaleString()}</div>
              <div className="text-[11px] text-muted-foreground">{bulkPct}% of total</div>
            </div>
            <div className="col-span-2 rounded-lg border bg-muted/30 p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Active Nylas Grants</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">
                  {metrics.activeGrants}
                  <span className="text-sm text-muted-foreground font-normal"> / {metrics.totalGrants}</span>
                </div>
              </div>
              <Globe2 className="h-8 w-8 text-muted-foreground/40" />
            </div>
          </div>
        </Section>

        <Section title="Recent activity" action={<span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> live stream</span>}>
          <ol className="divide-y max-h-80 overflow-y-auto">
            {metrics.recentActivity.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No recent activity detected.</div>
            ) : (
              metrics.recentActivity.map((a, i) => (
                <li key={i} className="px-4 py-3 flex items-start gap-3 text-sm animate-in slide-in-from-right-4">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--gradient-brand)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">— {a.action}</span></div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">{a.ts}</div>
                  </div>
                </li>
              ))
            )}
          </ol>
        </Section>
      </div>
    </div>
  );
}