import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CountryFilter, CountryPill, ExportBtn, Pill, SearchInput, Section, Td, Th } from "@/components/admin/primitives";
import { Loader2 } from "lucide-react";
import { adminHrApi , HrUserDto } from "@/components/admin/api/adminHrService";
import type { Country } from "@/mock/data";

export function HRList() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<Country | "All">("All");
  
  const [users, setUsers] = useState<HrUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await adminHrApi.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Directory fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const c = (u.country || "US") as Country;
      return (country === "All" || c === country) &&
             (u.email + u.name + u.id).toLowerCase().includes(q.toLowerCase());
    });
  }, [q, country, users]);

  const toggleStatus = async (id: string) => {
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u)));
    try {
      await adminHrApi.toggleStatus(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase">Fetching Directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">HR Management</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {users.length} users</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput value={q} onChange={setQ} placeholder="Search by email, name, ID" />
          <CountryFilter value={country} onChange={setCountry} />
          {/* <ExportBtn /> */}
        </div>
      </div>

      <Section title="Directory">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40 border-b border-white/5">
              <tr>
                {/* ✅ Changed the header from "Mailboxes" back to "Nylas" */}
                <Th>Name / ID</Th><Th>Email</Th><Th>Country</Th><Th>Role</Th><Th>Status</Th><Th>Joined</Th><Th>Nylas</Th><Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <Td>
                    <Link to={`/hr/${u.id}`} className="font-medium hover:underline">{u.name}</Link>
                    <div className="text-[11px] text-muted-foreground">{u.id}</div>
                  </Td>
                  <Td className="text-muted-foreground">{u.email}</Td>
                  <Td><CountryPill c={(u.country as Country) || "US"} /></Td>
                  
                  <Td><Pill tone={u.role === "Admin" ? "info" : u.role.includes("Elite") || u.role.includes("Pro") ? "ok" : "muted"}>{u.role}</Pill></Td>
                  
                  <Td>
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className="inline-flex items-center gap-1.5 transition hover:opacity-80"
                      title="Toggle status"
                    >
                      <span className={`h-2 w-2 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                      <span className="text-xs">{u.status}</span>
                    </button>
                  </Td>
                  <Td className="tabular-nums text-muted-foreground">{u.joined}</Td>
                  
                  {/* The counts render here perfectly */}
                  <Td>
                    <div className="flex flex-col gap-1 items-start">
                      {u.activeNylas > 0 && <Pill tone="ok">{u.activeNylas} Active</Pill>}
                      {u.inactiveNylas > 0 && <Pill tone="warn">{u.inactiveNylas} Inactive</Pill>}
                      {u.activeNylas === 0 && u.inactiveNylas === 0 && <Pill tone="muted">None</Pill>}
                    </div>
                  </Td>
                  
                  <Td className="text-right">
                    <Link to={`/hr/${u.id}`} className="text-xs underline-offset-2 hover:underline text-blue-400">View</Link>
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