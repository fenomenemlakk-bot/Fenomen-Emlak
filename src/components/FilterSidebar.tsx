import { SlidersHorizontal, X, Check, RotateCcw } from "lucide-react";
import { useProperties } from "../context/PropertyContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: Props) {
  const { filters, setFilters, resetFilters, filteredProperties } = useProperties();
  if (!isOpen) return null;

  const rooms = ["1+1", "2+1", "3+1", "4+1", "5+1", "6+1", "7+1", "Müstakil"];
  const districts = ["Tümü", "Merkez", "Erkmen", "İhsaniye (Gazlıgöl)", "Sandıklı", "Bolvadin", "Dinar"];
  const cats = ["Tümü", "Daire", "Villa", "Müstakil Ev", "Arsa", "İşyeri"];
  const ages = ["Tümü", "0 (Sıfır)", "1-5 Yaş", "6-10 Yaş", "11-15 Yaş", "16-20 Yaş", "21-25 Yaş", "26-30 Yaş", "30 ve Üzeri Yaş"];

  const toggleRoom = (r: string) =>
    setFilters((p) => ({
      ...p,
      roomCounts: p.roomCounts.includes(r) ? p.roomCounts.filter((x) => x !== r) : [...p.roomCounts, r],
    }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl text-slate-900 animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-rose-600" />
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Afyon İlan Filtreleri</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm bg-white">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">İlan Durumu</label>
            <div className="grid grid-cols-3 gap-2">
              {["Tümü", "Satılık", "Kiralık", "Devren Satılık", "Devren Kiralık"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters((p) => ({ ...p, status: s }))}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border ${
                    filters.status === s
                      ? "bg-rose-600 border-rose-600 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Gayrimenkul Tipi</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-rose-600"
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c === "Tümü" ? "Tüm Gayrimenkul Tipleri" : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Afyon Bölgesi / İlçe</label>
            <select
              value={filters.district}
              onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-rose-600"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "Tümü" ? "Tüm Afyon Bölgeleri" : d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Fiyat Aralığı (₺)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min TL"
                value={filters.minPrice ?? ""}
                onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value ? Number(e.target.value) : null }))}
                className="bg-white border border-slate-300 text-slate-900 font-medium rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-600"
              />
              <input
                type="number"
                placeholder="Max TL"
                value={filters.maxPrice ?? ""}
                onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value ? Number(e.target.value) : null }))}
                className="bg-white border border-slate-300 text-slate-900 font-medium rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Metrekare (m² Net)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min m²"
                value={filters.minM2 ?? ""}
                onChange={(e) => setFilters((p) => ({ ...p, minM2: e.target.value ? Number(e.target.value) : null }))}
                className="bg-white border border-slate-300 text-slate-900 font-medium rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-600"
              />
              <input
                type="number"
                placeholder="Max m²"
                value={filters.maxM2 ?? ""}
                onChange={(e) => setFilters((p) => ({ ...p, maxM2: e.target.value ? Number(e.target.value) : null }))}
                className="bg-white border border-slate-300 text-slate-900 font-medium rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Oda Sayısı</label>
            <div className="grid grid-cols-3 gap-2">
              {rooms.map((r) => {
                const active = filters.roomCounts.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRoom(r)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1 ${
                      active ? "bg-rose-600 border-rose-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Bina Yaşı</label>
            <select
              value={filters.buildingAge}
              onChange={(e) => setFilters((p) => ({ ...p, buildingAge: e.target.value }))}
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-rose-600"
            >
              {ages.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={filters.furnishedOnly}
                onChange={(e) => setFilters((p) => ({ ...p, furnishedOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-white border-slate-300"
              />
              <span>Sadece Eşyalı İlanlar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={filters.creditEligibleOnly}
                onChange={(e) => setFilters((p) => ({ ...p, creditEligibleOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-white border-slate-300"
              />
              <span>Sadece Krediye Uygun İlanlar</span>
            </label>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 bg-white flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all text-center"
          >
            İlanları Göster ({filteredProperties.length})
          </button>
        </div>
      </div>
    </div>
  );
}
