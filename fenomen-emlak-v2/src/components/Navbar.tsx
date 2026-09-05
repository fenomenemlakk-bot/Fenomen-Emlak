import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Phone,
  BadgeCheck,
  ChevronRight,
  LogOut,
  Lock,
  Layers,
  Heart,
  SlidersHorizontal,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { LOGO_SRC, LOGO_FALLBACK, PHONE_DISPLAY, PHONE_TEL } from "../lib/constants";

interface Props {
  onOpenFilterDrawer: () => void;
  onOpenCompare: () => void;
}

export default function Navbar({ onOpenFilterDrawer, onOpenCompare }: Props) {
  const {
    isAdminLoggedIn,
    adminLogout,
    setShowAdminModal,
    openAdminPanel,
    favorites,
    comparedIds,
    filters,
    setFilters,
  } = useProperties();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logo, setLogo] = useState(LOGO_SRC);

  const addListing = () => openAdminPanel("add");

  const setStatus = (status: string) => {
    setFilters((p) => ({ ...p, status }));
    document.getElementById("listings-feed")?.scrollIntoView({ behavior: "smooth" });
  };

  const navBtn = (label: string, status: string) => (
    <button
      onClick={() => setStatus(status)}
      className={`px-4 py-2 rounded-xl font-bold transition-all ${
        filters.status === status
          ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
          : "text-slate-700 hover:text-rose-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="bg-rose-600 text-white py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-200" />
            <span>Dumlupınar, Ordu Blv. Bozcalar İşhanı 2.Kat, Afyonkarahisar</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-rose-100">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>T.C. Ticaret Bakanlığı Yetki Belgeli Afyon Emlak Portalı</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-1.5 font-bold text-white hover:text-rose-100 transition-colors bg-rose-700/80 px-3 py-0.5 rounded-full border border-rose-500"
          >
            <Phone className="w-3 h-3 text-white" />
            <span>{PHONE_DISPLAY}</span>
          </a>
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2 bg-emerald-700 text-white px-2.5 py-0.5 rounded-full border border-emerald-500">
              <BadgeCheck className="w-3 h-3 text-emerald-200" />
              <button
                onClick={() => openAdminPanel("listings")}
                className="font-bold text-[11px] hover:underline flex items-center gap-1"
              >
                <span>Admin Modu</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={adminLogout}
                title="Çıkış Yap"
                className="hover:text-rose-200 ml-1 transition-colors"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-1.5 text-white hover:bg-rose-700 px-2.5 py-0.5 rounded-full border border-rose-400/60 transition-colors"
            >
              <Lock className="w-3 h-3 text-rose-200" />
              <span>Yönetici Girişi</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group py-1">
          <div className="relative flex items-center">
            <img
              src={logo}
              alt="Fenomen Emlak Logo"
              onError={() => setLogo(LOGO_FALLBACK)}
              className="h-12 sm:h-16 max-w-[240px] object-contain transition-transform group-hover:scale-105 duration-300 rounded-xl"
            />
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 text-sm">
          {navBtn("Satılık", "Satılık")}
          {navBtn("Kiralık", "Kiralık")}
          {navBtn("Tüm Gayrimenkuller", "Tümü")}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenCompare}
            title="Karşılaştır"
            className="relative p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Layers className="w-4 h-4 text-rose-600" />
            <span className="hidden xl:inline">Karşılaştır</span>
            {comparedIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {comparedIds.length}
              </span>
            )}
          </button>
          <button
            onClick={() =>
              document.getElementById("listings-feed")?.scrollIntoView({ behavior: "smooth" })
            }
            title="Favorilerim"
            className="relative p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-all"
          >
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600/20" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {favorites.length}
              </span>
            )}
          </button>
          <button
            onClick={onOpenFilterDrawer}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-600" />
            <span>Filtrele</span>
          </button>
          <button
            onClick={addListing}
            className={`ml-1 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
              isAdminLoggedIn
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 hover:scale-[1.02]"
                : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
            }`}
          >
            {isAdminLoggedIn ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>İlan Ver</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-rose-400" />
                <span>İlan Ver (Admin)</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl bg-white text-slate-700 hover:text-rose-600 border border-slate-200"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setStatus("Satılık");
                setMobileOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-50 text-slate-800 text-center font-bold hover:bg-rose-600 hover:text-white border border-slate-200"
            >
              Satılık İlanlar
            </button>
            <button
              onClick={() => {
                setStatus("Kiralık");
                setMobileOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-50 text-slate-800 text-center font-bold hover:bg-rose-600 hover:text-white border border-slate-200"
            >
              Kiralık İlanlar
            </button>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                onOpenFilterDrawer();
                setMobileOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center gap-2 text-xs font-bold border border-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-600" />
              <span>Detaylı Filtrele</span>
            </button>
          </div>
          <button
            onClick={() => {
              addListing();
              setMobileOpen(false);
            }}
            className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/30"
          >
            {isAdminLoggedIn ? <PlusCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            <span>{isAdminLoggedIn ? "İlan Ekle (Admin)" : "İlan Ver (Yönetici Girişi)"}</span>
          </button>
        </div>
      )}
    </header>
  );
}
