import { useState } from "react";
import { Lock, BadgeCheck, Home, KeyRound, Eye, Users, Search, PlusCircle, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useProperties } from "../../context/PropertyContext";
import type { Property } from "../../types";
import AddPropertyForm from "./AddPropertyForm";

export default function AdminDashboard() {
  const {
    properties,
    deleteProperty,
    isAdminLoggedIn,
    setShowAdminModal,
    adminLogout,
    activeAdminTab,
    setActiveAdminTab,
    inquiries,
  } = useProperties();
  const [editItem, setEditItem] = useState<Property | null>(null);
  const [search, setSearch] = useState("");

  if (!isAdminLoggedIn) {
    return (
      <div id="admin-dashboard" className="bg-white border border-slate-200 rounded-3xl p-8 max-w-4xl mx-auto my-12 text-center shadow-lg text-slate-900">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-900 mb-2">Fenomen Emlak Yönetici Paneli</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 font-medium">
          Sadece admin girişi yapılarak yeni ilan eklenebilir, bilgisayarınızdan resim yüklenebilir veya mevcut ilanlar düzenlenebilir.
        </p>
        <button
          onClick={() => setShowAdminModal(true)}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-rose-600/30 transition-all inline-flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Yönetici Girişi Yap</span>
        </button>
      </div>
    );
  }

  const filtered = properties.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.location.city.toLowerCase().includes(search.toLowerCase())
  );
  const forSale = properties.filter((q) => q.status === "Satılık").length;
  const forRent = properties.filter((q) => q.status === "Kiralık").length;
  const totalViews = properties.reduce((acc, q) => acc + (q.viewsCount || 0), 0);

  const stats = [
    { label: "Toplam İlan", value: properties.length, icon: Home, color: "bg-rose-50 text-rose-600" },
    { label: "Satılık / Kiralık", value: `${forSale} / ${forRent}`, icon: KeyRound, color: "bg-amber-50 text-amber-600" },
    { label: "Toplam Görüntülenme", value: totalViews, icon: Eye, color: "bg-indigo-50 text-indigo-600" },
    { label: "Müşteri Talepleri", value: inquiries.length, icon: Users, color: "bg-emerald-50 text-emerald-600" },
  ];

  const tab = (id: "listings" | "add" | "inquiries", label: string, Icon: typeof Home, active: boolean) => (
    <button
      onClick={() => {
        setActiveAdminTab(id);
        setEditItem(null);
      }}
      className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-all relative whitespace-nowrap ${
        active ? "text-rose-600 border-b-2 border-rose-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div id="admin-dashboard" className="max-w-6xl mx-auto my-12 px-4 space-y-8 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Yönetici Oturumu Açık</span>
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">Fenomen Emlak Admin Yönetim Merkezi</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Bilgisayarınızdan ilan görselleri yükleyebilir, yeni ilan verebilir ve geri arama taleplerini inceleyebilirsiniz.
          </p>
        </div>
        <button
          onClick={adminLogout}
          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl border border-slate-300 text-xs font-bold transition-colors"
        >
          Yönetici Oturumunu Kapat
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-bold">{s.label}</span>
              <span className="font-heading font-extrabold text-xl text-slate-900">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
        {tab("listings", `İlan Listesi & Yönetimi (${properties.length})`, Home, activeAdminTab === "listings" && !editItem)}
        {tab("add", editItem ? "İlanı Düzenle" : "+ Yeni İlan Ekle", PlusCircle, activeAdminTab === "add" || !!editItem)}
        {tab("inquiries", `Müşteri Talepleri (${inquiries.length})`, MessageSquare, activeAdminTab === "inquiries")}
      </div>

      {activeAdminTab === "listings" && !editItem && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İlan başlığı veya ID ile ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600 font-medium"
              />
            </div>
            <button
              onClick={() => setActiveAdminTab("add")}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni İlan Oluştur</span>
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Görsel & İlan</th>
                    <th className="p-4">Kategori / Şehir</th>
                    <th className="p-4">Fiyat</th>
                    <th className="p-4">Görüntülenme</th>
                    <th className="p-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filtered.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={q.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80"}
                            alt={q.title}
                            className="w-14 h-10 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <span className="font-mono text-rose-600 font-bold block">{q.id}</span>
                            <span className="font-bold text-slate-900 line-clamp-1 max-w-xs">{q.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">
                          {q.status} • {q.category}
                        </span>
                        <span className="text-slate-500">
                          {q.location.district} / {q.location.city}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-rose-600 text-sm">{new Intl.NumberFormat("tr-TR").format(q.price)} ₺</td>
                      <td className="p-4 font-mono font-bold text-slate-700">{q.viewsCount} kez</td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setEditItem(q)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 transition-colors"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`"${q.title}" ilanını silmek istediğinize emin misiniz?`)) deleteProperty(q.id);
                          }}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(activeAdminTab === "add" || editItem) && (
        <AddPropertyForm
          editProperty={editItem}
          onSuccess={() => {
            setEditItem(null);
            setActiveAdminTab("listings");
          }}
        />
      )}

      {activeAdminTab === "inquiries" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900">Müşteri Geri Arama & Bilgi Talepleri</h3>
          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">Henüz gelen müşteri talebi yok.</div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((q) => (
                <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{q.customerName}</span>
                      <a href={`tel:${q.customerPhone}`} className="text-xs text-rose-600 font-bold hover:underline">
                        📞 {q.customerPhone}
                      </a>
                      <span className="text-[10px] text-slate-400">• {q.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-bold">{q.propertyTitle}</p>
                    <p className="text-xs text-slate-500 italic">"{q.message}"</p>
                  </div>
                  <a
                    href={`https://wa.me/${q.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 shadow-xs"
                  >
                    WhatsApp Dönüş Yap
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
