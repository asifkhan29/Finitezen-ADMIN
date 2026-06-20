import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, Mail, MessageSquare, CreditCard, Sliders,
  LogOut, Search, Moon, Sun, ChevronRight, CircleDot, Bell, Command,
  Menu, X
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDark } from "@/hooks/use-dark";
import { clearToken } from "@/lib/auth";

const navGroups: { label: string; items: { to: string; label: string; icon: any; end?: boolean }[] }[] = [
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
      { to: "/hr", label: "HR Management", icon: Users },
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
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`} 
        style={{ background: "var(--gradient-surface)" }}
      >
        <div className="px-4 h-16 flex items-center justify-between border-b">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl grid place-items-center text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-brand)" }}>F</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight tracking-tight">Finitezen AI</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin · v2.4</div>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="md:hidden p-1.5 -mr-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
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
                      `group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
              <div className="text-[10px] text-muted-foreground truncate">admin@finitezen.ai</div>
            </div>
            <button
              onClick={() => { clearToken(); navigate("/login", { replace: true }); }}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b px-6 flex items-center justify-between bg-background/70 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden p-1.5 -ml-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Console</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold tracking-tight">{title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input placeholder="Search…" className="w-72 rounded-lg border bg-muted/40 pl-8 pr-12 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground"><Command className="h-2.5 w-2.5" />K</kbd>
            </div>
            <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-medium">
              <CircleDot className="h-3 w-3" /> Operational
            </span>
            <button className="relative h-9 w-9 grid place-items-center rounded-lg border bg-card hover:bg-muted" title="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>
            <button onClick={toggle} className="h-9 w-9 grid place-items-center rounded-lg border bg-card hover:bg-muted" title="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>
        
        <div className="p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}