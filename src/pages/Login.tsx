import { useState } from "react";
// 1. UPDATED IMPORT TO TANSTACK ROUTER
import { useNavigate } from "@tanstack/react-router";
import { adminAuthApi } from "@/components/admin/api/authService";
import { Field } from "@/components/admin/primitives";
import { Loader2 } from "lucide-react";

export function Login() {
  const nav = useNavigate();
  const [u, setU] = useState("admin_finitezen"); 
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!u || !p) return setErr("Enter username and password");
    
    setErr("");
    setIsLoading(true);

    try {
      const data = await adminAuthApi.login(u, p);
      
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        // 2. UPDATED NAVIGATE SYNTAX
        nav({ to: "/", replace: true });
      } else {
        throw new Error("Payload compromised. Access token missing.");
      }
    } catch (error: any) {
      setErr(error.message || "Invalid administrative credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_20%_10%,oklch(0.55_0.22_277/0.15),transparent_60%),radial-gradient(50%_50%_at_90%_90%,oklch(0.62_0.2_320/0.15),transparent_60%)]" />
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl grid place-items-center text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-brand)" }}>F</div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Finitezen AI</div>
            <div className="text-[11px] text-muted-foreground">Admin Console</div>
          </div>
        </div>
        <h1 className="text-lg font-semibold">Welcome back</h1>
        <p className="text-xs text-muted-foreground mt-1">Sign in to your admin workspace.</p>
        
        <form onSubmit={submit} className="mt-5 space-y-3">
          <Field label="Username">
            <input 
              value={u} 
              disabled={isLoading}
              onChange={(e) => setU(e.target.value)} 
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" 
              placeholder="admin" 
            />
          </Field>
          <Field label="Password">
            <input 
              type="password" 
              value={p} 
              disabled={isLoading}
              onChange={(e) => setP(e.target.value)} 
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" 
              placeholder="••••••" 
            />
          </Field>
          
          {err && <p className="text-xs text-destructive">{err}</p>}
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50" 
            style={{ background: "var(--gradient-brand)" }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Authorizing...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}