import { Sparkles } from "lucide-react";
import { useProperties } from "../context/PropertyContext";

export default function Toast() {
  const { toastMessage } = useProperties();
  if (!toastMessage) return null;
  return (
    <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top duration-300 pointer-events-none">
      <div className="bg-slate-900/95 border border-rose-500/40 text-rose-100 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
