import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { apiClient } from "./api/apiClient"; // Double-check your import route

const SystemLoader = () => {
  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden bg-background">
      {/* Dynamic Ambient Background matched perfectly to Login Page styling */}
      <div className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_20%_10%,oklch(0.55_0.22_277/0.15),transparent_60%),radial-gradient(50%_50%_at_90%_90%,oklch(0.62_0.2_320/0.15),transparent_60%)]" />

      {/* Card Body Architecture matched to the Login panel shape */}
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)] text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6 self-start text-left">
          <div
            className="h-10 w-10 rounded-xl grid place-items-center text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] animate-pulse"
            style={{ background: "var(--gradient-brand)" }}
          >
            F
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">
              Finitezen AI
            </div>
            <div className="text-[11px] text-muted-foreground">
              Admin Console
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 my-4">
          <h1 className="text-lg font-semibold tracking-tight text-left">
            Verifying Session
          </h1>
          <p className="text-xs text-muted-foreground text-left mt-1">
            Establishing link with the security workspace cluster.
          </p>

          {/* Synchronized Action Progress Module */}
          <div
            className="w-full rounded-lg py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Authorizing Access
            Node...
          </div>
        </div>
      </div>
    </div>
  );
};

export function Protected({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    const checkTokenStatus = async () => {
      if (!token) {
        setTimeout(() => setIsValid(false), 600);
        return;
      }

      try {
        console.log("Checking token:", token); // ADD THIS
        const response = await apiClient("/api/auth/check-token", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: token,
        });

        const statusText = await response.text();
        console.log("Server response:", statusText); // ADD THIS

        if (statusText === "true") {
          setIsValid(true);
        } else {
          localStorage.removeItem("token");
          setTimeout(() => setIsValid(false), 600);
        }
      } catch (err) {
        console.error("Administrative authentication clearance failed:", err);
        setTimeout(() => setIsValid(false), 600);
      }
    };

    checkTokenStatus();
  }, [token]);

  return (
    <AnimatePresence mode="wait">
      {isValid === null ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SystemLoader />
        </motion.div>
      ) : isValid ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {children}
        </motion.div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </AnimatePresence>
  );
}
