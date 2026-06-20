import { useEffect, useState } from "react";
// 1. UPDATED IMPORTS TO TANSTACK ROUTER
import { Link, useParams } from "@tanstack/react-router";
import { ShieldCheck, Loader2 } from "lucide-react";
import { CountryPill, Pill, Section, Stat, Td, Th } from "@/components/admin/primitives";
import { adminHrApi, HrDetailResponse } from "@/components/admin/api/adminHrService";
import type { Country } from "@/mock/data";

export function HRDetail() {
  // 2. UPDATED useParams TO DISABLE STRICT TYPING IN THE COMPONENT FILE
  const { id } = useParams({ strict: false }) as { id: string };
  
  const [data, setData] = useState<HrDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadDetail = async () => {
      try {
        const payload = await adminHrApi.getDetail(id);
        setData(payload);
      } catch (error) {
        console.error("Failed to load HR details", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase">Loading Node Profile...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="text-sm text-muted-foreground">User not found. <Link className="underline" to="/hr">Back</Link></div>;
  }

  const { profile, stats, recentResumes, recentEmails } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/hrList" className="text-xs text-muted-foreground hover:underline">← HR Management</Link>          <h1 className="text-xl font-semibold mt-1">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.email} · {profile.id}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <CountryPill c={(profile.country as Country) || "US"} />
          
          <Pill tone={profile.role === "Admin" ? "info" : profile.role.includes("Elite") || profile.role.includes("Pro") ? "ok" : "muted"}>
            {profile.role}
          </Pill>
          
          <Pill tone={profile.status === "Active" ? "ok" : "bad"}>{profile.status}</Pill>
          
          {profile.activeNylas > 0 && (
            <Pill tone="ok"><ShieldCheck className="h-3 w-3 mr-1 inline" /> {profile.activeNylas} Active Mailboxes</Pill>
          )}
          {profile.inactiveNylas > 0 && (
            <Pill tone="warn">{profile.inactiveNylas} Inactive</Pill>
          )}
          {profile.activeNylas === 0 && profile.inactiveNylas === 0 && (
            <Pill tone="muted">No Mailboxes</Pill>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat 
          label="Today's Searches" 
          value={stats.dailySearchesUsed} 
          sub="Resets at midnight local" 
        />
        <Stat 
          label="Today's Outreach" 
          value={`${stats.dailyEmailsSent} / ${stats.emailLimit}`} 
          sub={`${stats.emailLimit > 0 ? Math.round((stats.dailyEmailsSent / stats.emailLimit) * 100) : 0}% of daily limit`} 
        />
        <Stat 
          label="Active Grants" 
          value={stats.activeGrants} 
          sub="Connected Nylas mailboxes"
        />
        <Stat 
          label="Lifetime Outreach" 
          value={stats.lifetimeEmailsSent.toLocaleString()} 
          sub="Total emails sent all-time" 
        />
        <Stat 
          label="Lifetime Resumes" 
          value={(stats.resumesByBulk + stats.resumesByMail).toLocaleString()} 
          sub={`${stats.resumesByMail} mail · ${stats.resumesByBulk} bulk`} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Recent Email Transmissions">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40"><tr><Th>Recipient</Th><Th>Status</Th><Th>Timestamp</Th></tr></thead>
            <tbody className="divide-y">
              {recentEmails.length === 0 ? (
                <tr><Td colSpan={3} className="text-center text-muted-foreground py-4">No recent emails.</Td></tr>
              ) : (
                recentEmails.map((e, i) => (
                  <tr key={i}><Td className="text-muted-foreground truncate max-w-[150px]">{e.to}</Td><Td><Pill tone="ok">{e.status}</Pill></Td><Td className="tabular-nums text-muted-foreground">{e.ts}</Td></tr>
                ))
              )}
            </tbody>
          </table>
        </Section>
        
        <Section title="Recent Resume Ingestion">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40"><tr><Th>File</Th><Th>Method</Th><Th>Timestamp</Th></tr></thead>
            <tbody className="divide-y">
              {recentResumes.length === 0 ? (
                <tr><Td colSpan={3} className="text-center text-muted-foreground py-4">No recent resumes.</Td></tr>
              ) : (
                recentResumes.map((r, i) => (
                  <tr key={i}><Td className="truncate max-w-[150px]" title={r.file}>{r.file}</Td><Td><Pill tone={r.method === "Bulk Upload" ? "info" : "muted"}>{r.method || "Email"}</Pill></Td><Td className="tabular-nums text-muted-foreground">{r.ts}</Td></tr>
                ))
              )}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}