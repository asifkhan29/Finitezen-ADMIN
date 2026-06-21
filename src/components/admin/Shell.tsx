import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, Mail, MessageSquare, CreditCard, Sliders,
  LogOut, Search, Moon, Sun, ChevronRight, CircleDot, Bell, Command,
  Menu, X,
} from "lucide-react";
// Import from react-router-dom
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDark } from "@/hooks/use-dark";
import { clearToken } from "@/lib/auth";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/activity", label: "Resume & Activity", icon: FileText },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/hrList", label: "HR Management", icon: Users },
      { to: "/nylas", label: "Email & Nylas", icon: Mail },
      { to: "/feedback", label: "Feedback", icon: MessageSquare },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/payments", label: "Payments", icon: CreditCard },
      { to: "/limits", label: "Limits & Settings", icon: Sliders },
    ],
  },
];

const flatNav = navGroups.flatMap((g) => g.items);

export function Shell() {
  const { dark, toggle } = useDark();
  const navigate = useNavigate();
  const loc = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const title = flatNav.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))?.label ?? "Admin";

  return (
    <div className="min-h-screen flex bg-background text-foreground relative">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`} 
        style={{ background: "var(--gradient-surface)" }}
      >
        <div className="px-4 h-16 flex items-center justify-between border-b">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl grid place-items-center text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-brand)" }}>F</div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Finitezen AI</div>
              <div className="text-[10px] uppercase text-muted-foreground">Admin · v2.4</div>
            </div>
          </div>
          <button className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
          {navGroups.map((g) => (
            <div key={g.label} className="mb-5">
              <div className="px-2 mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">{g.label}</div>
              <div className="space-y-0.5">
                {g.items.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-muted-foreground hover:bg-muted/60 hover:text-foreground ${
                        isActive ? "bg-accent text-accent-foreground font-medium shadow-sm text-foreground" : ""
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full" style={{ background: "var(--gradient-brand)" }} />}
                        <n.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{n.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="m-3 rounded-xl border bg-card/80 p-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full grid place-items-center text-xs font-semibold text-primary-foreground" style={{ background: "var(--gradient-brand)" }}>AD</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate">Admin User</div>
            </div>
            <button
              onClick={() => { clearToken(); navigate("/login"); }}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b px-6 flex items-center justify-between bg-background/70 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 -ml-2 rounded-md text-muted-foreground hover:bg-muted" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-semibold tracking-tight">{title}</span>
          </div>
          {/* Header actions... */}
        </header>
        <div className="p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}