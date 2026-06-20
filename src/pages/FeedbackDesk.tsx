import { useEffect, useState } from "react";
import { Pill } from "@/components/admin/primitives";
import { Loader2 } from "lucide-react";
import { adminFeedbackApi , AdminFeedbackDto } from "@/components/admin/api/adminFeedbackService"; 

const formatDate = (isoString: string | null) => {
  if (!isoString) return "Unknown";
  return new Date(isoString).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export function FeedbackDesk() {
  const [open, setOpen] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await adminFeedbackApi.getFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to load feedback", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleResolve = async (id: string) => {
    // Optimistic UI update
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: "Resolved" } : f));
    try {
      await adminFeedbackApi.resolve(id);
    } catch (err) {
      console.error("Resolution failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium tracking-widest uppercase text-[10px]">Fetching Support Queue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div>
        <h1 className="text-xl font-semibold">Feedback & Support</h1>
        <p className="text-sm text-muted-foreground">User-submitted queries with prioritization.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((f) => (
          <div key={f.id} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <Pill tone={f.role?.includes("ELITE") ? "info" : f.role?.includes("PRO") ? "ok" : "muted"}>
                {f.role || "NORMAL HR"}
              </Pill>
              <Pill tone={f.status === "Pending" ? "warn" : "ok"}>{f.status}</Pill>
            </div>
            
            <div className="text-sm font-medium">{f.email}</div>
            <p className="mt-2 text-sm text-muted-foreground flex-grow whitespace-pre-wrap">{f.message}</p>
            
            {/* Multi-Image Display Logic */}
            {f.images && f.images.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {f.images.map((imgBase64, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setOpen(imgBase64)} 
                    className="flex-shrink-0 block w-24 h-24 overflow-hidden rounded-md border bg-muted/30 hover:opacity-80 transition"
                  >
                    <img src={imgBase64} alt={`Attachment ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="tabular-nums">{formatDate(f.ts)}</span>
              {f.status === "Pending" && (
                <button 
                  onClick={() => handleResolve(f.id)} 
                  className="font-medium text-primary hover:underline"
                >
                  Mark resolved
                </button>
              )}
            </div>
          </div>
        ))}

        {feedbacks.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-12 text-center text-muted-foreground border rounded-xl border-dashed">
            Queue is completely clear. No pending feedback.
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-6 animate-in fade-in duration-200">
          <img src={open} alt="attachment full" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}