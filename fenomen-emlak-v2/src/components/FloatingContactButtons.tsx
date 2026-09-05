import { Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, waLink } from "../lib/constants";

export default function FloatingContactButtons() {
  const wa = waLink(
    "Merhaba, Afyon Fenomen Emlak sitenizden ulaşıyorum. Portföyünüzdeki gayrimenkuller hakkında bilgi almak istiyorum."
  );
  return (
    <div
      className="fixed right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <a
        href={`tel:${PHONE_TEL}`}
        title={`Bizi Arayın: ${PHONE_DISPLAY}`}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-slate-700 text-rose-500 shadow-xl hover:scale-110 hover:bg-rose-600 hover:text-white transition-all duration-300 cursor-pointer"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Bizi Arayın: {PHONE_DISPLAY}
        </span>
      </a>
      <a
        href={wa}
        title="WhatsApp'tan Ulaşın"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/50 hover:scale-110 hover:bg-emerald-500 transition-all duration-300 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none" />
        <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
        <span className="absolute right-16 bg-emerald-950 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          WhatsApp'tan Ulaşın
        </span>
      </a>
    </div>
  );
}
