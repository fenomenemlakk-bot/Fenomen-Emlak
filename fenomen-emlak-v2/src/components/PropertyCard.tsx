import { useState } from "react";
import { Heart, Layers, Share2, ChevronLeft, ChevronRight, MapPin, Sparkles, Phone } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { PHONE_TEL, waLink } from "../lib/constants";
import type { Property } from "../types";

export default function PropertyCard({ property: p }: { property: Property }) {
  const { setSelectedProperty, favorites, toggleFavorite, comparedIds, toggleCompare, incrementViews, showToast } =
    useProperties();
  const [idx, setIdx] = useState(0);
  const isFav = favorites.includes(p.id);
  const isCompared = comparedIds.includes(p.id);
  const priceText = new Intl.NumberFormat("tr-TR").format(p.price) + " " + p.currency;

  const open = () => {
    incrementViews(p.id);
    setSelectedProperty(p);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i === 0 ? p.images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i === p.images.length - 1 ? 0 : i + 1));
  };

  const wa = waLink(
    `Merhaba, Fenomen Emlak sitenizdeki "${p.title}" (İlan No: ${p.id}, Fiyat: ${priceText}) ilanınız hakkında bilgi ve detay almak istiyorum.`
  );

  const onShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("İlan bağlantısı panoya kopyalandı!");
    }
  };

  return (
    <div
      onClick={open}
      className="group bg-white rounded-3xl border border-slate-200 hover:border-rose-300 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[16/10] bg-white border-b border-slate-100 overflow-hidden">
        <img
          src={p.images[idx] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30 pointer-events-none" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold shadow-md ${
              p.status === "Satılık"
                ? "bg-rose-600 text-white"
                : p.status === "Kiralık"
                ? "bg-amber-600 text-white"
                : "bg-indigo-600 text-white"
            }`}
          >
            {p.status}
          </span>
          {p.badges.slice(0, 2).map((b, i) => (
            <span
              key={i}
              className="bg-slate-900/80 backdrop-blur-md text-white border border-white/20 px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-rose-400" />
              <span>{b}</span>
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(p.id);
            }}
            title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isFav ? "bg-rose-600 text-white shadow-lg" : "bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white shadow-xs"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(p.id);
            }}
            title="Karşılaştır"
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isCompared ? "bg-indigo-600 text-white shadow-lg" : "bg-white/90 text-slate-700 hover:text-indigo-600 hover:bg-white shadow-xs"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={onShare}
            title="Paylaş"
            className="p-2 rounded-xl bg-white/90 text-slate-700 hover:text-rose-600 backdrop-blur-md hover:bg-white transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        {p.images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20">
              {idx + 1} / {p.images.length}
            </div>
          </>
        )}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-rose-300 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border border-white/20">
          İlan No: {p.id}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-heading font-extrabold text-2xl text-rose-600">{priceText}</div>
            <span className="text-xs text-slate-700 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {p.category}
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-base text-slate-900 line-clamp-2 mb-3 leading-snug group-hover:text-rose-600 transition-colors">
            {p.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate font-medium">
              {p.location.neighborhood}, {p.location.district} / {p.location.city}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 mb-4">
            <div className="text-center border-r border-slate-200 pr-1">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Oda</span>
              <span className="font-extrabold text-slate-900">{p.specs.roomCount}</span>
            </div>
            <div className="text-center border-r border-slate-200 px-1">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">m² (Net)</span>
              <span className="font-extrabold text-slate-900">{p.specs.netM2} m²</span>
            </div>
            <div className="text-center pl-1">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Kat</span>
              <span className="font-extrabold text-slate-900 truncate block">{p.specs.floor}</span>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-200 flex items-center gap-2 bg-white">
          <a
            href={wa}
                        onClick={(e) => e.stopPropagation()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>WhatsApp'tan Ulaşın</span>
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <span>Bizi Arayın</span>
          </a>
        </div>
      </div>
    </div>
  );
}
