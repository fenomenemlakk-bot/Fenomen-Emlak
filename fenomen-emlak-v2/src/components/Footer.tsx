import { useState } from "react";
import { ShieldCheck, MapPin, Phone, Mail, Clock, Lock } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { LOGO_SRC, LOGO_FALLBACK, EMAIL, ADDRESS, PHONE_TEL, waLink } from "../lib/constants";

export default function Footer() {
  const { setShowAdminModal, isAdminLoggedIn, setFilters } = useProperties();
  const [logo, setLogo] = useState(LOGO_SRC);
  const wa = waLink("Merhaba, Afyon Fenomen Emlak sitenizden ulaşıyorum.");

  const gotoFeed = () => document.getElementById("listings-feed")?.scrollIntoView({ behavior: "smooth" });

  const categoryLinks: { label: string; apply: () => void }[] = [
    {
      label: "Uydukent & Merkez Satılık Daireler",
      apply: () => setFilters((p) => ({ ...p, status: "Satılık", category: "Daire", district: "Merkez" })),
    },
    {
      label: "Erkmen Lüks Müstakil Villaları",
      apply: () => setFilters((p) => ({ ...p, status: "Satılık", category: "Villa", district: "Erkmen" })),
    },
    {
      label: "Gazlıgöl Termal Daire & Devremülkler",
      apply: () => setFilters((p) => ({ ...p, category: "Daire", district: "İhsaniye (Gazlıgöl)" })),
    },
    {
      label: "Erenler AKÜ Kampüs Yanı Yatırımlık Daireler",
      apply: () => setFilters((p) => ({ ...p, status: "Satılık", category: "Daire", district: "Merkez" })),
    },
    {
      label: "Afyon Geneli İmarlı Yatırımlık Arsalar",
      apply: () => setFilters((p) => ({ ...p, status: "Satılık", category: "Arsa", district: "Tümü" })),
    },
  ];

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <a href="#" className="inline-block">
              <img
                src={logo}
                alt="Fenomen Emlak Afyon"
                onError={() => setLogo(LOGO_FALLBACK)}
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Afyonkarahisar genelinde satılık ve kiralık konut, villa, dükkan, imarlı arsa ve
              Gazlıgöl termal mülklerinde T.C. Ticaret Bakanlığı yetkili danışmanlık hizmeti sunar.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-700 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Taşınmaz Ticareti Yetki Belgesi: 0300142</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>%100 Şeffaf & Güvenilir Portföy</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-4">
              Afyon İlan Kategorileri
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {categoryLinks.map((c) => (
                <li key={c.label}>
                  <button
                    onClick={() => {
                      c.apply();
                      gotoFeed();
                    }}
                    className="hover:text-rose-600 transition-colors text-left"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-4">
              Afyon Merkez Ofisimiz
            </h4>
            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                <a href={`tel:${PHONE_TEL}`} className="hover:text-rose-600 font-extrabold text-slate-900">
                  0553 722 14 30
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-600 shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-rose-600 font-bold text-slate-800">
                  {EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Hafta İçi & Cumartesi: 09:00 - 19:00</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-4">
              İletişim & Danışmanlık
            </h4>
            <div className="space-y-3">
              <a
                href={wa}
                                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Afyon WhatsApp Bilgi Hattı</span>
              </a>
              <button
                onClick={() => setShowAdminModal(true)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAdminLoggedIn ? "Admin Paneli (Aktif)" : "Yönetici Girişi (Afyon İlan Ekle)"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2025 Fenomen Emlak Afyonkarahisar Gayrimenkul Hizmetleri. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1 font-bold text-slate-700">
            <span>T.C. Ticaret Bakanlığı Yetkili Afyon Emlak Portalı</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
