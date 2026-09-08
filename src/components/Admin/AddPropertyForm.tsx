import { useState } from "react";
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useProperties } from "../../context/PropertyContext";
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import type { Property } from "../../types";

interface Props {
  editProperty?: Property | null;
  onSuccess?: () => void;
}

export default function AddPropertyForm({ editProperty, onSuccess }: Props) {
  const { addProperty, updateProperty, showToast, adminPassword } = useProperties();
  const p = editProperty;

  const [title, setTitle] = useState(p?.title || "");
  const [description, setDescription] = useState(p?.description || "");
  const [price, setPrice] = useState<number | "">(p?.price || "");
  const [status, setStatus] = useState<string>(p?.status || "Satılık");
  const [category, setCategory] = useState(p?.category || "Daire");
  const [city] = useState(p?.location.city || "Afyonkarahisar");
  const [district, setDistrict] = useState(p?.location.district || "Merkez");
  const [neighborhood, setNeighborhood] = useState(p?.location.neighborhood || "Uydukent Mah.");
  const [fullAddress, setFullAddress] = useState(p?.location.fullAddress || "");
  const [grossM2, setGrossM2] = useState<number | "">(p?.specs.grossM2 || 140);
  const [netM2, setNetM2] = useState<number | "">(p?.specs.netM2 || 120);
  const [roomCount, setRoomCount] = useState(p?.specs.roomCount || "3+1");
  const [buildingAge, setBuildingAge] = useState(p?.specs.buildingAge || "0 (Sıfır)");
  const [floor, setFloor] = useState(p?.specs.floor || "3. Kat");
  const [totalFloors] = useState<number>(p?.specs.totalFloors || 5);
  const [heating, setHeating] = useState(p?.specs.heating || "Afjet (Jeotermal Isıtma)");
  const [bathroomCount, setBathroomCount] = useState<number | "">(p?.specs.bathroomCount || 2);
  const [balcony, setBalcony] = useState(p?.specs.balcony ?? true);
  const [furnished, setFurnished] = useState(p?.specs.furnished ?? false);
  const [creditEligible, setCreditEligible] = useState(p?.specs.creditEligible ?? true);
  const [deedType, setDeedType] = useState(p?.specs.deedType || "Kat Mülkiyeti");
  const [contactPhone, setContactPhone] = useState(p?.contactPhone || "0553 722 14 30");
  const [whatsappNumber, setWhatsappNumber] = useState(p?.whatsappNumber || "905537221430");
  const [agentName, setAgentName] = useState(p?.agentName || "Fenomen Emlak Afyon");
  const [badges, setBadges] = useState<string[]>(p?.badges || ["Öne Çıkan"]);
  const [images, setImages] = useState<string[]>(p?.images || []);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadOneFile = async (file: File): Promise<string> => {
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(adminPassword ? { "x-admin-password": adminPassword } : {}),
      },
      body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || `Yükleme adresi alınamadı (${res.status})`);
    }
    const { path, token, publicUrl } = await res.json();
    if (!supabaseBrowser) {
      throw new Error("Depolama bağlantısı yapılandırılmamış (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY eksik).");
    }
    const { error } = await supabaseBrowser.storage
      .from("property-images")
      .uploadToSignedUrl(path, token, file);
    if (error) throw error;
    return publicUrl as string;
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const fileList = Array.from(files);
    const uploaded: string[] = [];
    let failed = 0;
    for (const file of fileList) {
      try {
        const url = await uploadOneFile(file);
        uploaded.push(url);
      } catch (err) {
        console.error("Resim yüklenemedi:", err);
        failed++;
      }
    }
    if (uploaded.length > 0) {
      setImages((prev) => [...prev, ...uploaded]);
    }
    if (failed > 0) {
      showToast(`${uploaded.length} resim yüklendi, ${failed} resim yüklenemedi.`);
    } else {
      showToast(`${uploaded.length} adet resim başarıyla yüklendi!`);
    }
    setUploading(false);
    e.target.value = "";
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      setImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
      showToast("Resim bağlantısı eklendi.");
    }
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const toggleBadge = (b: string) =>
    setBadges((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const addSampleImages = () => {
    const sample = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    ];
    setImages((prev) => [...prev, ...sample]);
    showToast("Örnek mimari fotoğraflar eklendi.");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      showToast("Lütfen ilan için en az 1 adet resim ekleyin (Bilgisayarınızdan veya internetten).");
      return;
    }
    if (!title || !price || !description) {
      showToast("Lütfen başlık, fiyat ve açıklama alanlarını doldurunuz.");
      return;
    }
    const payload = {
      title,
      description,
      price: Number(price),
      currency: "₺",
      status: status as Property["status"],
      category,
      location: {
        city,
        district,
        neighborhood,
        fullAddress: fullAddress || `${neighborhood}, ${district} / ${city}`,
      },
      specs: {
        grossM2: Number(grossM2) || 100,
        netM2: Number(netM2) || 85,
        roomCount,
        buildingAge,
        floor,
        totalFloors: Number(totalFloors) || 5,
        heating,
        bathroomCount: Number(bathroomCount) || 1,
        balcony,
        furnished,
        creditEligible,
        deedType,
        swap: false,
      },
      images,
      features: {
        interior: ["Afjet Isıtma Altyapısı", "Ankastre Mutfak", "Ebeveyn Banyosu", "Çelik Kapı", "Fiber İnternet"],
        exterior: ["Otopark", "Asansör", "24 Saat Güvenlik", "Isı Yalıtımı Mantolama"],
        location: ["Ulaşıma Yakın", "Merkezi Konum", "Okul & Market Yanı"],
      },
      badges,
      featured: badges.includes("Öne Çıkan"),
      contactPhone,
      whatsappNumber: whatsappNumber.replace(/[^0-9]/g, ""),
      agentName,
      agentTitle: "Fenomen Emlak Afyon Yetkili Ofisi",
      agentPhone: contactPhone,
    };
    if (p) updateProperty(p.id, payload);
    else addProperty(payload);
    onSuccess?.();
  };

  const inputCls =
    "w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-600 font-medium";
  const smallInputCls =
    "w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-rose-600";
  const labelCls = "block text-xs font-bold text-slate-700 mb-1";
  const checkCls = "w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-white border-slate-300";

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-8 max-w-4xl mx-auto shadow-xl text-slate-900">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            {p ? "İlanı Düzenle" : "Afyon İlanı Ekle (Admin Panel)"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Sadece yetkili admin kullanıcı yayına yeni Afyon ilanı ekleyebilir.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
          Afyon Yetkili Modu
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-rose-600" />
            <span>İlan Fotoğrafları * (Bilgisayarınızdan Yükleyin)</span>
          </label>
          <button type="button" onClick={addSampleImages} className="text-xs text-rose-600 hover:text-rose-700 font-bold">
            + Örnek Fotoğraf Ekle
          </button>
        </div>
        <div className="relative border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-2xl p-6 text-center bg-white transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFile}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
          <div className="space-y-2 pointer-events-none">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-rose-600 mx-auto animate-spin" />
                <div className="text-sm font-bold text-slate-900">Fotoğraflar yükleniyor, lütfen bekleyin...</div>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-rose-600 mx-auto animate-bounce" />
                <div className="text-sm font-bold text-slate-900">Bilgisayarınızdan Fotoğraf Seçmek İçin Tıklayın veya Sürükleyin</div>
                <p className="text-xs text-slate-500 font-medium">JPG, PNG, WEBP formatları desteklenir. Birden fazla resim seçebilirsiniz.</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Veya Görsel URL'si yapıştırın (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600 font-medium"
          />
          <button type="button" onClick={addUrl} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300">
            Ekle
          </button>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                <img src={img} alt={`Uploaded ${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeImage(i)} className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700" title="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Kapak Görseli</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-extrabold text-rose-600 uppercase tracking-wider">Temel İlan Bilgileri</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>İlan Başlığı *</label>
            <input type="text" required placeholder="Örn: Afyon Erkmen'de Lüks 4+1 Bahçeli Müstakil Villa" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>İlan Durumu *</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              <option value="Satılık">Satılık</option>
              <option value="Kiralık">Kiralık</option>
              <option value="Günlük Kiralık">Günlük Kiralık</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Gayrimenkul Tipi *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {["Daire", "Villa", "Müstakil Ev", "Arsa", "İşyeri", "Yazlık", "Plaza"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fiyat (₺) *</label>
            <input type="number" required placeholder="Örn: 4650000" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")} className={`${inputCls} font-extrabold`} />
          </div>
          <div>
            <label className={labelCls}>Şehir / İl *</label>
            <input type="text" readOnly value={city} className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-bold cursor-not-allowed" />
          </div>
          <div>
            <label className={labelCls}>İlçe / Bölge *</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>
              {["Merkez", "Erkmen", "İhsaniye (Gazlıgöl)", "Sandıklı", "Bolvadin", "Dinar"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Mahalle *</label>
            <input type="text" required placeholder="Örn: Uydukent Mah." value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Açık Adres (İsteğe Bağlı)</label>
            <input type="text" placeholder="Tam adres" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Açıklama *</label>
          <textarea rows={5} required placeholder="Afyon'daki mülkün tüm detaylarını, ısıtma altyapısını (Afjet), konumunu ve avantajlarını detaylandırın..." value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-extrabold text-rose-600 uppercase tracking-wider">Teknik Özellikler</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Brüt m²</label>
            <input type="number" value={grossM2} onChange={(e) => setGrossM2(e.target.value ? Number(e.target.value) : "")} className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>Net m²</label>
            <input type="number" value={netM2} onChange={(e) => setNetM2(e.target.value ? Number(e.target.value) : "")} className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>Oda Sayısı</label>
            <select value={roomCount} onChange={(e) => setRoomCount(e.target.value)} className={`${smallInputCls} font-semibold`}>
              {["1+1", "2+1", "3+1", "4+1", "5+1", "Müstakil", "Arsa"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Bina Yaşı</label>
            <select value={buildingAge} onChange={(e) => setBuildingAge(e.target.value)} className={`${smallInputCls} font-semibold`}>
              {["0 (Sıfır)", "1-5 Yaş", "6-10 Yaş", "11-15 Yaş", "20+ Yaş"].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Bulunduğu Kat</label>
            <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>Isıtma</label>
            <input type="text" value={heating} onChange={(e) => setHeating(e.target.value)} className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>Banyo Sayısı</label>
            <input type="number" value={bathroomCount} onChange={(e) => setBathroomCount(e.target.value ? Number(e.target.value) : "")} className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>Tapu Durumu</label>
            <input type="text" value={deedType} onChange={(e) => setDeedType(e.target.value)} className={smallInputCls} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800 font-bold">
            <input type="checkbox" checked={furnished} onChange={(e) => setFurnished(e.target.checked)} className={checkCls} />
            <span>Eşyalı Daire</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800 font-bold">
            <input type="checkbox" checked={creditEligible} onChange={(e) => setCreditEligible(e.target.checked)} className={checkCls} />
            <span>Krediye Uygun</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800 font-bold">
            <input type="checkbox" checked={balcony} onChange={(e) => setBalcony(e.target.checked)} className={checkCls} />
            <span>Balkon Var</span>
          </label>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-extrabold text-rose-600 uppercase tracking-wider">İletişim & Etiketler</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>İletişim Telefonu *</label>
            <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={`${inputCls} font-semibold`} />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Numarası *</label>
            <input type="text" required placeholder="905327008899" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className={`${inputCls} font-semibold`} />
          </div>
          <div>
            <label className={labelCls}>Temsilci / Ofis Unvanı</label>
            <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} className={`${inputCls} font-semibold`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Özel Etiketler</label>
          <div className="flex flex-wrap gap-2">
            {["Öne Çıkan", "Acil Satılık", "Fırsat İlan", "Deniz Manzaralı", "Yeni", "Fiyatı Düştü"].map((b) => {
              const active = badges.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    active ? "bg-rose-600 border-rose-600 text-white shadow-md" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {active ? `✓ ${b}` : b}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto py-3 px-8 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{p ? "İlanı Güncelle" : "Afyon İlanını Yayınla"}</span>
        </button>
      </div>
    </form>
  );
}
