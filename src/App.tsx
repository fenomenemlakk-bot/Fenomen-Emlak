import { useState } from "react";
import { BadgeCheck, ArrowUpDown, LayoutGrid, List, Home, RotateCcw, X } from "lucide-react";
import { PropertyProvider, useProperties } from "./context/PropertyContext";
import Toast from "./components/Toast";
import Navbar from "./components/Navbar";
import HeroSearch from "./components/HeroSearch";
import PropertyCard from "./components/PropertyCard";
import PropertyDetailModal from "./components/PropertyDetailModal";
import FilterSidebar from "./components/FilterSidebar";
import CompareModal from "./components/CompareModal";
import FloatingContactButtons from "./components/FloatingContactButtons";
import Footer from "./components/Footer";
import AdminModal from "./components/Admin/AdminModal";
import AdminDashboard from "./components/Admin/AdminDashboard";

function Shell() {
  const {
    filteredProperties,
    filters,
    setFilters,
    resetFilters,
    selectedProperty,
    setSelectedProperty,
    isAdminLoggedIn,
    adminLogout,
    showAdminDashboardModal,
    setShowAdminDashboardModal,
    openAdminPanel,
  } = useProperties();
  const [filterOpen, setFilterOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      <Toast />
      <Navbar onOpenFilterDrawer={() => setFilterOpen(true)} onOpenCompare={() => setCompareOpen(true)} />

      {isAdminLoggedIn && (
        <div className="bg-emerald-50 border-b border-emerald-200 py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-900">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>Yönetici Oturumu Açık - İlan eklemek veya düzenlemek için yönetim panelini açabilirsiniz.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAdminPanel("add")}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs"
            >
              + İlan Ekle / Admin Paneli ⚙️
            </button>
            <button
              onClick={adminLogout}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      )}

      <HeroSearch onOpenFilterDrawer={() => setFilterOpen(true)} />

      <main id="listings-feed" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-xl text-slate-900">Gayrimenkul İlanları</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
                {filteredProperties.length} İlan Bulundu
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Filtrelerinize uygun güncel portföy listesi</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-rose-600" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest">Yeniden Eskiye</option>
                <option value="price-asc">Fiyata Göre (Önce En Düşük)</option>
                <option value="price-desc">Fiyata Göre (Önce En Yüksek)</option>
                <option value="m2-desc">Metrekareye Göre (Büyükten Küçüğe)</option>
                <option value="popular">En Çok İncelenenler</option>
              </select>
            </div>
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-rose-600 text-white" : "text-slate-500 hover:text-slate-900"}`}
                title="Izgara Görünümü"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-rose-600 text-white" : "text-slate-500 hover:text-slate-900"}`}
                title="Liste Görünümü"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Home className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900">Aramanıza Uygun İlan Bulunamadı</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto font-medium">
              Seçtiğiniz filtreler çok dar olabilir. Filtrelerinizi temizleyerek veya farklı bir il/kategori seçerek tekrar arama yapabilirsiniz.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tüm Filtreleri Sıfırla</span>
            </button>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-6"}>
            {filteredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </main>

      {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}

      {showAdminDashboardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl my-auto text-slate-900 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAdminDashboardModal(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <AdminDashboard />
          </div>
        </div>
      )}

      <FilterSidebar isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      <AdminModal />
      <CompareModal isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      <FloatingContactButtons />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PropertyProvider>
      <Shell />
    </PropertyProvider>
  );
}
