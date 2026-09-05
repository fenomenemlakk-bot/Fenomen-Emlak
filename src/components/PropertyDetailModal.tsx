import { useState } from "react";
import {
  Heart,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Building,
  ShieldCheck,
  CheckCircle2,
  Check,
  MapPin,
  Send,
  Phone,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { PHONE_TEL, waLink } from "../lib/constants";
import type { Property } from "../types";

interface Props {
  property: Property;
  onClose: () => void;
}

type Tab = "details" | "features" | "map" | "inquiry";

export default function PropertyDetailModal({ property: p, onClose }: Props) {
  const { favorites, toggleFavorite, comparedIds, toggleCompare, addInquiry, showToast } = useProperties();
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [tab, setTab] = useState<Tab>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const isFav = favorites.includes(p.id);
  const isCompared = comparedIds.includes(p.id);
  const priceText = new Intl.NumberFormat("tr-TR").format(p.price) + " " + p.currency;
  const wa = waLink(
    `Merhaba, Fenomen Emlak sitenizdeki "${p.title}" (İlan No: ${p.id}, Fiyat: ${priceText}) ilanınız hakkında bilgi ve gösterim randevusu almak istiyorum.`
  );

  const submitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast("Lütfen adınızı ve telefon numaranızı giriniz.");
      return;
    }
    addInquiry({
      propertyId: p.id,
      propertyTitle: p.title,
      customerName: name,
      customerPhone: phone,
      message: note || "İlan hakkında geri arama talebi.",
    });
    setSent(true);
  };

  const kunye: [string, React.ReactNode, string?][] = [
    ["İlan No", p.id, "text-rose-600 font-mono font-bold"],
    ["İlan Tarihi", p.createdAt],
    ["Emlak Tipi", p.category],
    ["m² (Brüt / Net)", `${p.specs.grossM2} m² / ${p.specs.netM2} m²`],
    ["Oda Sayısı", p.specs.roomCount],
    ["Bina Yaşı", p.specs.buildingAge],
    ["Bulunduğu Kat", p.specs.floor],
    ["Isıtma", p.specs.heating],
    ["Banyo Sayısı", p.specs.bathroomCount],
    ["Eşyalı mı", p.specs.furnished ? "Evet (Eşyalı)" : "Hayır"],
    ["Krediye Uygun", p.specs.creditEligible ? "Evet (Uygun)" : "Hayır", "text-emerald-600 font-bold"],
    ["Tapu Durumu", p.specs.deedType],
  ];

  const tabBtn = (id: Tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`pb-3 transition-colors relative whitespace-nowrap ${
        tab === id ? "text-rose-600 border-b-2 border-rose-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto text-slate-900">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  p.status === "Satılık" ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {p.status}
              </span>
              <span className="text-xs font-mono text-rose-600 font-bold">İlan No: {p.id}</span>
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                • {p.location.city} / {p.location.district}
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 line-clamp-1">{p.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleFavorite(p.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFav ? "bg-rose-600 border-rose-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:text-rose-600"
              }`}
              title="Favorilerim"
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
            </button>
            <button
              onClick={() => toggleCompare(p.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isCompared ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:text-indigo-600"
              }`}
              title="Karşılaştır"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-white">
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-white border border-slate-200 rounded-2xl overflow-hidden group">
              <img
                src={p.images[idx]}
                alt={p.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightbox(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              {p.images.length > 1 && (
                <>
                  <button
                    onClick={() => setIdx((i) => (i === 0 ? p.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIdx((i) => (i === p.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-xl">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Fiyat</span>
                <span className="font-heading font-extrabold text-2xl text-rose-600">{priceText}</span>
              </div>
              <button
                onClick={() => setLightbox(true)}
                className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-white/20 flex items-center gap-1.5"
              >
                <span>Büyüt ({idx + 1}/{p.images.length})</span>
              </button>
            </div>
            {p.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {p.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === i ? "border-rose-600 ring-2 ring-rose-600/30" : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-sm font-bold bg-white">
            {tabBtn("details", "Genel Özellikler & Detay")}
            {tabBtn("features", "Donanım & Konum Özellikleri")}
            {tabBtn("map", "Harita & Konum")}
            {tabBtn("inquiry", "Sizi Arayalım Formu")}
          </div>

          {tab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4 text-rose-600" />
                    <span>Gayrimenkul Künyesi</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs shadow-xs">
                    {kunye.map(([label, value, cls]) => (
                      <div key={label}>
                        <span className="text-slate-500 block font-bold">{label}</span>
                        <span className={cls ?? "text-slate-900 font-semibold"}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Açıklama</h3>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 whitespace-pre-line leading-relaxed font-medium shadow-xs">
                    {p.description}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-md">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                    <Building className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-lg text-slate-900">Fenomen Emlak İletişim</h4>
                    <p className="text-xs text-rose-600 font-bold">Afyon Danışman Hattı</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kurumsal Lisanslı Gayrimenkul Portalı</span>
                    </p>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    <a
                      href={wa}
                                            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                      </svg>
                      <span>WhatsApp'tan Ulaşın</span>
                    </a>
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Phone className="w-4 h-4 text-rose-400" />
                      <span>Hemen Ara: 0553 722 14 30</span>
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1">Müşteri Hizmetleri 7/24 Aktif</p>
                  <p className="text-[10px] text-slate-400">* Tıkladığınızda doğrudan temsilcimize bağlanırsınız.</p>
                </div>
              </div>
            </div>
          )}

          {tab === "features" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  ["İç Özellikler", p.features.interior],
                  ["Dış & Bina Özellikleri", p.features.exterior],
                  ["Konum & Çevre", p.features.location],
                ].map(([title, list]) => (
                  <div key={title as string} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <h4 className="font-bold text-sm text-rose-600 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{title as string}</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-800 font-medium">
                      {(list as string[]).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "map" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Adres / Lokasyon</h4>
                  <p className="text-xs text-slate-600">
                    {p.location.fullAddress || `${p.location.neighborhood}, ${p.location.district} / ${p.location.city}`}
                  </p>
                </div>
              </div>
              <div className="relative h-72 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 text-center space-y-3 p-6 bg-white rounded-3xl border border-slate-200 max-w-md shadow-xl">
                  <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30 animate-bounce">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900">
                      {p.location.district}, {p.location.city}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Gizlilik gereği net sokak adresi yalnızca randevu sonrası paylaşılmaktadır.
                    </p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${p.location.district} ${p.location.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-rose-600 font-bold text-xs rounded-xl border border-slate-300"
                  >
                    Google Haritalarda Aç ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {tab === "inquiry" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 max-w-xl mx-auto shadow-xs">
              <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-1 text-center">Sizi Arayalım</h3>
              <p className="text-xs text-slate-500 text-center mb-6 font-medium">
                İletişim bilgilerinizi bırakın, Fenomen Emlak yetkilisi en kısa sürede sizi geri arasın.
              </p>
              {sent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-center rounded-2xl space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-base">Talebiniz Alındı!</h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    En kısa sürede tarafınıza telefon açılacaktır. İlgilendiğiniz için teşekkür ederiz.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numaranız *</label>
                    <input
                      type="tel"
                      required
                      placeholder="05XX XXX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notunuz (İsteğe Bağlı)</label>
                    <textarea
                      rows={3}
                      placeholder="Örn: Hafta sonu saati 14:00'te evi görmek istiyorum."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-600 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Arama Talebi Gönder</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs text-slate-500 font-bold block">Fiyat</span>
            <span className="font-heading font-extrabold text-xl text-rose-600">{priceText}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={wa}
                            className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>WhatsApp'tan Ulaşın</span>
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Hemen Ara</span>
            </a>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-sm font-semibold">
              {idx + 1} / {p.images.length}
            </span>
            <button onClick={() => setLightbox(false)} className="p-2 rounded-full bg-slate-800 text-white hover:bg-rose-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative my-auto flex items-center justify-center max-h-[80vh]">
            <img src={p.images[idx]} alt="Fullscreen" className="max-h-[80vh] max-w-full object-contain rounded-xl" />
            {p.images.length > 1 && (
              <>
                <button
                  onClick={() => setIdx((i) => (i === 0 ? p.images.length - 1 : i - 1))}
                  className="absolute left-2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIdx((i) => (i === p.images.length - 1 ? 0 : i + 1))}
                  className="absolute right-2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          <div className="text-center text-slate-300 text-xs py-2">{p.title}</div>
        </div>
      )}
    </div>
  );
}
