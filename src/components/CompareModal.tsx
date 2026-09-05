import { Layers, X } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import type { Property } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareModal({ isOpen, onClose }: Props) {
  const { comparedIds, toggleCompare, clearCompared, getPropertyById, setSelectedProperty } = useProperties();
  if (!isOpen) return null;

  const items = comparedIds.map((id) => getPropertyById(id)).filter(Boolean) as Property[];

  const rows: { label: string; render: (p: Property) => React.ReactNode; cls?: string }[] = [
    {
      label: "Fiyat",
      render: (p) => `${new Intl.NumberFormat("tr-TR").format(p.price)} ${p.currency}`,
      cls: "font-extrabold text-rose-600 text-sm",
    },
    { label: "Emlak Tipi & Durum", render: (p) => `${p.status} • ${p.category}`, cls: "font-bold text-slate-900" },
    { label: "Konum", render: (p) => `${p.location.district} / ${p.location.city}` },
    { label: "m² (Net / Brüt)", render: (p) => `${p.specs.netM2} m² / ${p.specs.grossM2} m²`, cls: "font-bold text-slate-900" },
    { label: "Oda Sayısı", render: (p) => p.specs.roomCount, cls: "font-bold text-slate-900" },
    { label: "Bina Yaşı", render: (p) => p.specs.buildingAge },
    { label: "Bulunduğu Kat", render: (p) => p.specs.floor },
    { label: "Isıtma", render: (p) => p.specs.heating },
    { label: "Krediye Uygun", render: (p) => (p.specs.creditEligible ? "✓ Evet" : "Hayır"), cls: "font-bold text-emerald-600" },
    { label: "Eşyalı", render: (p) => (p.specs.furnished ? "✓ Evet" : "Hayır") },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-rose-600" />
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">İlan Karşılaştırma Tablosu</h3>
              <p className="text-xs text-slate-500 font-medium">Seçtiğiniz gayrimenkulleri yan yana inceleyin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCompared}
                className="px-3 py-1.5 bg-slate-100 text-rose-600 hover:bg-slate-200 rounded-xl text-xs font-bold"
              >
                Listeyi Temizle
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-x-auto flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium">
                Karşılaştırmak istediğiniz ilanların üzerindeki katman simgesine tıklayın.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-800 min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 w-40 bg-slate-100 font-extrabold text-slate-600 uppercase border border-slate-200">
                    Özellik
                  </th>
                  {items.map((p) => (
                    <th key={p.id} className="p-3 bg-slate-50 min-w-[200px] border border-slate-200">
                      <div className="relative">
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="absolute -top-1 -right-1 p-1 bg-white text-rose-600 rounded-md hover:bg-rose-600 hover:text-white shadow-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-24 object-cover rounded-xl mb-2 border border-slate-200"
                        />
                        <span className="font-mono text-[10px] text-rose-600 font-bold block">{p.id}</span>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{p.title}</h4>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className="p-3 font-bold text-slate-600 bg-slate-50">{row.label}</td>
                    {items.map((p) => (
                      <td key={p.id} className={`p-3 ${row.cls ?? ""}`}>
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-3 font-bold text-slate-600 bg-slate-50">İşlem</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-3">
                      <button
                        onClick={() => {
                          setSelectedProperty(p);
                          onClose();
                        }}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        İlanı İncele
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
