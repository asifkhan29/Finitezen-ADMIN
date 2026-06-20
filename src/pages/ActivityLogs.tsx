import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountryFilter, CountryPill, ExportBtn, Pill, SearchInput, Section, Td, Th } from "@/components/admin/primitives";
import { Loader2, ArrowRight } from "lucide-react";
import { adminActivityApi, ResumeLogDto, EmailLogDto } from "@/components/admin/api/adminActivityService";
import type { Country } from "@/components/admin/primitives";

const formatDate = (isoString: string) => {
  if (!isoString) return "Unknown";
  return new Date(isoString).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export function ActivityLogs() {
  const [tab, setTab] = useState<"resumes" | "emails">("resumes");
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<Country | "All">("All");
  
  const [resumes, setResumes] = useState<ResumeLogDto[] | null>(null);
  const [emails, setEmails] = useState<EmailLogDto[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Optimized useEffect: Only re-run when the 'tab' changes
  useEffect(() => {
    const fetchTab = async () => {
      try {
        if (tab === "resumes") {
          // If we already have the data, skip fetching to save API calls
          if (resumes !== null) return; 
          setIsLoading(true);
          const data = await adminActivityApi.getResumeLogs();
          setResumes(data);
        } else if (tab === "emails") {
          if (emails !== null) return;
          setIsLoading(true);
          const data = await adminActivityApi.getEmailLogs();
          setEmails(data);
        }
      } catch (error) {
        console.error(`Failed to load ${tab} logs:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTab();
  }, [tab]); // Removed 'resumes' and 'emails' from dependencies to prevent re-firing

  const filteredResumes = useMemo(() => {
    if (!resumes) return [];
    const term = q.toLowerCase();
    return resumes.filter((r) => {
      const c = (r.country || "US") as Country; 
      const by = r.by || "Unknown";
      const file = r.file || "Unknown";
      
      return (
        (country === "All" || c === country) &&
        (file.toLowerCase().includes(term) || by.toLowerCase().includes(term) || (r.method || "").toLowerCase().includes(term))
      );
    });
  }, [resumes, q, country]);

  const filteredEmails = useMemo(() => {
    if (!emails) return [];
    const term = q.toLowerCase();
    return emails.filter((e) => {
      const c = (e.country || "US") as Country;
      const hrAccount = e.hrEmail || "Unknown";
      const from = e.from || "Unknown";
      const to = e.to || "Unknown";
      
      return (
        (country === "All" || c === country) &&
        (hrAccount.toLowerCase().includes(term) || from.toLowerCase().includes(term) || to.toLowerCase().includes(term) || (e.status || "").toLowerCase().includes(term))
      );
    });
  }, [emails, q, country]);

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Activity Streams</h1>
          <p className="text-sm text-muted-foreground">
            {tab === "resumes" 
              ? `${filteredResumes.length} resume ingestion logs found` 
              : `${filteredEmails.length} email transmission logs found`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder={tab === "resumes" ? "Search resume or user" : "Search HR, sender, or recipient"}
          />
          <CountryFilter value={country} onChange={setCountry} />
          {/* <ExportBtn /> */}
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "resumes" | "emails")} className="w-full">
        <TabsList>
          <TabsTrigger value="resumes">Resume Ingestion</TabsTrigger>
          <TabsTrigger value="emails">Email Transmission</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumes" className="space-y-4">
          <Section title={`Resume ingestion logs (${filteredResumes.length})`} action={<ExportBtn />}>
            {isLoading ? (
               <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground bg-muted/40 border-b">
                    <tr><Th>File</Th><Th>Saved by</Th><Th>Country</Th><Th>Method</Th><Th>Timestamp</Th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredResumes.map((r, i) => (
                      <tr key={i} className="hover:bg-muted/10 transition-colors">
                        <Td className="max-w-[200px] truncate" title={r.file}>{r.file || "N/A"}</Td>
                        <Td className="font-medium">{r.by || "Unknown Node"}</Td>
                        <Td><CountryPill c={(r.country as Country) || "US"} /></Td>
                        <Td><Pill tone={r.method === "Bulk Upload" ? "info" : "muted"}>{r.method || "Email"}</Pill></Td>
                        <Td className="tabular-nums text-muted-foreground">{formatDate(r.ts)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Section title={`Email transmission logs (${filteredEmails.length})`} action={<ExportBtn />}>
            {isLoading ? (
               <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground bg-muted/40 border-b">
                    <tr>
                      <Th>HR Account</Th>
                      <Th>Transmission Route</Th>
                      <Th>Country</Th>
                      <Th>Status</Th>
                      <Th>Timestamp</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEmails.map((e, i) => (
                      <tr key={i} className="hover:bg-muted/10 transition-colors">
                        <Td className="font-medium text-foreground">{e.hrEmail || "Unknown HR"}</Td>
                        
                        <Td>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground truncate max-w-[120px]" title={e.from}>{e.from}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                            <span className="font-medium truncate max-w-[120px]" title={e.to}>{e.to}</span>
                          </div>
                        </Td>
                        
                        <Td><CountryPill c={(e.country as Country) || "US"} /></Td>
                        <Td><Pill tone={e.status === "Delivered" ? "ok" : e.status === "Bounced" ? "bad" : "info"}>{e.status}</Pill></Td>
                        <Td className="tabular-nums text-muted-foreground">{formatDate(e.ts)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}