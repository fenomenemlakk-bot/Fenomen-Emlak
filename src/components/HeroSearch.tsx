import { useState } from "react";
import {
  ShieldCheck,
  Search,
  MapPin,
  Building2,
  ChevronDown,
  Wallet,
  SlidersHorizontal,
  RotateCcw,
  Award,
  Users,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";

interface Props {
  onOpenFilterDrawer: () => void;
}

export default function HeroSearch({ onOpenFilterDrawer }: Props) {
  const { filters, setFilters, resetFilters, filteredProperties } = useProperties();
  const [tab, setTab] = useState("Satılık");

  const setStatus = (status: string) => {
    setTab(status);
    setFilters((p) => ({ ...p, status }));
  };

  const districts = ["Tümü", "Merkez", "Erkmen", "İhsaniye (Gazlıgöl)", "Sandıklı", "Bolvadin", "Dinar"];
  const cats = ["Tümü", "Daire", "Villa", "Müstakil Ev", "Arsa", "İşyeri"];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById("listings-feed")?.scrollIntoView({ behavior: "smooth" });
  };

  const tabBtn = (label: string) => (
    <button
      onClick={() => setStatus(label)}
      className={`px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all whitespace-nowrap ${
        tab === label
          ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="relative bg-slate-900 border-b border-slate-200 py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-villa.jpg"
          alt="Afyon Lüks Konut"
          className="w-full h-full object-cover object-center filter scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          <span>T.C. Ticaret Bakanlığı Taşınmaz Ticareti Yetkili Afyon Emlak Portalı</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-xs">
          Afyonkarahisar'da Hayalinizdeki Mülkü <br />
          <span className="text-rose-600">Güvenle Bulun &amp; Anında İletişime Geçin</span>
        </h1>
        <p className="mt-3.5 text-slate-700 text-base sm:text-lg max-w-2xl mx-auto font-medium">
          Fenomen Emlak güvencesiyle detaylı Afyonkarahisar ilanları, güncel fiyatlar ve doğrudan
          WhatsApp ya da telefon görüşmesi ile anında randevu alabilirsiniz.
        </p>

        <div className="mt-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-300/50 max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 overflow-x-auto scrollbar-none">
            {tabBtn("Satılık")}
            {tabBtn("Kiralık")}
            {tabBtn("Devren Satılık")}
            {tabBtn("Devren Kiralık")}
            {tabBtn("Tümü")}
          </div>
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                Arama veya İlan No
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Uydukent, Erkmen, Erenler veya ilan adı..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
                  className="w-full bg-white text-slate-900 text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-600 placeholder-slate-400 font-medium"
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                İlçe / Bölge
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.district}
                  onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
                  className="w-full bg-white text-slate-900 text-sm pl-9 pr-7 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-600 appearance-none font-semibold cursor-pointer"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d === "Tümü" ? "Tüm İlçeler" : d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                Emlak Tipi
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-white text-slate-900 text-sm pl-9 pr-7 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-600 appearance-none font-semibold cursor-pointer"
                >
                  {cats.map((c) => (
                    <option key={c} value={c}>
                      {c === "Tümü" ? "Tüm Tipler" : c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                Max Fiyat (₺)
              </label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  placeholder="Max TL"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      maxPrice: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full bg-white text-slate-900 text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-600 placeholder-slate-400 font-medium"
                />
              </div>
            </div>
            <div className="lg:col-span-2 flex items-end gap-2">
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Ara ({filteredProperties.length})</span>
              </button>
              <button
                type="button"
                onClick={onOpenFilterDrawer}
                title="Detaylı Filtre"
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-rose-600 border border-slate-300 flex items-center justify-center transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap text-slate-600">
              <span className="font-bold text-slate-800">Hızlı Filtre:</span>
              <button
                type="button"
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    badgeFilter: p.badgeFilter === "Öne Çıkan" ? "Tümü" : "Öne Çıkan",
                  }))
                }
                className={`px-3 py-1 rounded-full border transition-all ${
                  filters.badgeFilter === "Öne Çıkan"
                    ? "bg-rose-100 border-rose-300 text-rose-800 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                ⭐ Öne Çıkan İlanlar
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilters((p) => ({ ...p, district: p.district === "Erkmen" ? "Tümü" : "Erkmen" }))
                }
                className={`px-3 py-1 rounded-full border transition-all ${
                  filters.district === "Erkmen"
                    ? "bg-rose-100 border-rose-300 text-rose-800 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🏡 Erkmen Villaları
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilters((p) => ({ ...p, district: p.district === "Merkez" ? "Tümü" : "Merkez" }))
                }
                className={`px-3 py-1 rounded-full border transition-all ${
                  filters.district === "Merkez"
                    ? "bg-rose-100 border-rose-300 text-rose-800 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🏢 Uydukent &amp; Merkez
              </button>
            </div>
            {(filters.searchQuery ||
              filters.status !== "Satılık" ||
              filters.category !== "Tümü" ||
              filters.district !== "Tümü" ||
              filters.maxPrice) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Filtreleri Temizle</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-heading font-extrabold text-slate-900 text-sm">Resmi Yetki Belgeli</div>
              <div className="text-slate-500 text-xs">Taşınmaz Ticareti Lisansı</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-heading font-extrabold text-slate-900 text-sm">%100 Tapu &amp; Sözleşme Onaylı</div>
              <div className="text-slate-500 text-xs">Şeffaf &amp; Doğrulanmış Portföy</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-heading font-extrabold text-slate-900 text-sm">Afyon Yerel Uzmanı</div>
              <div className="text-slate-500 text-xs">Doğrudan İletişim &amp; Danışmanlık</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
