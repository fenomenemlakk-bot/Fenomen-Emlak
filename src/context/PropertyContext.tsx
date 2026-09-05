import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Filters, Inquiry, NewInquiry, NewProperty, Property } from "../types";
import { initialProperties } from "../data/properties";

// localStorage bazı sandbox/gizli sekme/embed ortamlarında (ör. önizleme
// pencereleri) erişime kapalı olabilir ve erişim SecurityError fırlatabilir.
// Bu durumlarda sitenin çökmemesi, sadece kalıcı kaydın devre dışı kalması için
// tüm okuma/yazma işlemlerini güvenli sarmalayıcılardan geçiriyoruz.
const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // sessizce yok say — sadece kalıcılık devre dışı kalır
    }
  },
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // sessizce yok say
    }
  },
};

// İlanlar ve müşteri talepleri artık gerçek bir veritabanında (Supabase)
// /api/properties ve /api/inquiries üzerinden saklanıyor — böylece bir admin
// ilan eklediğinde/sildiğinde bu değişiklik SİTEYİ ZİYARET EDEN HERKESE
// yansıyor (sadece kendi tarayıcısına değil). Yazma işlemleri (ekleme,
// silme, güncelleme) admin şifresini bir header olarak sunucuya gönderir;
// sunucu bu şifreyi Vercel'deki gizli ADMIN_PASSWORD değişkeniyle doğrular.
async function apiFetch(path: string, options: RequestInit = {}, adminPassword?: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (adminPassword) headers["x-admin-password"] = adminPassword;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    let message = `İstek başarısız oldu (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // yanıt JSON değilse varsayılan mesajı kullan
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

const defaultFilters: Filters = {
  searchQuery: "",
  status: "Tümü",
  category: "Tümü",
  city: "Afyonkarahisar",
  district: "Tümü",
  minPrice: null,
  maxPrice: null,
  minM2: null,
  maxM2: null,
  roomCounts: [],
  buildingAge: "Tümü",
  heating: "Tümü",
  furnishedOnly: false,
  creditEligibleOnly: false,
  badgeFilter: "Tümü",
  sortBy: "newest",
};

type AdminTab = "listings" | "add" | "inquiries";

interface PropertyContextValue {
  properties: Property[];
  filteredProperties: Property[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilters: () => void;
  addProperty: (p: NewProperty) => Property;
  updateProperty: (id: string, p: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
  incrementViews: (id: string) => void;
  isAdminLoggedIn: boolean;
  adminLogin: (pw: string) => Promise<boolean>;
  adminLogout: () => void;
  adminAuthLoading: boolean;
  showAdminModal: boolean;
  setShowAdminModal: (v: boolean) => void;
  showAdminDashboardModal: boolean;
  setShowAdminDashboardModal: (v: boolean) => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (t: AdminTab) => void;
  openAdminPanel: (tab?: AdminTab) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  comparedIds: string[];
  toggleCompare: (id: string) => void;
  clearCompared: () => void;
  inquiries: Inquiry[];
  addInquiry: (i: NewInquiry) => void;
  markInquiryRead: (id: string) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (p: Property | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PropertyContext = createContext<PropertyContextValue | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  // İlk render'da (veritabanından henüz cevap gelmeden) site boş görünmesin
  // diye örnek ilanlarla başlıyoruz; veritabanı yanıtı gelince üzerine yazılır.
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/properties")
      .then((data: Property[]) => {
        if (!cancelled && Array.isArray(data)) setProperties(data);
      })
      .catch((e) => {
        console.error("İlanlar veritabanından yüklenemedi, örnek ilanlar gösteriliyor:", e);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    () => safeLocalStorage.getItem("fenomen_admin_session") === "true"
  );
  const [adminPassword, setAdminPassword] = useState<string | null>(() =>
    safeLocalStorage.getItem("fenomen_admin_password")
  );
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("listings");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = safeLocalStorage.getItem("fenomen_favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Müşteri talepleri gizli bilgi içerdiği için sadece admin giriş yapmışken
  // sunucudan çekilir — ziyaretçiler başkalarının taleplerini göremez.
  useEffect(() => {
    if (!isAdminLoggedIn || !adminPassword) {
      setInquiries([]);
      return;
    }
    let cancelled = false;
    apiFetch("/api/inquiries", {}, adminPassword)
      .then((data: Inquiry[]) => {
        if (!cancelled && Array.isArray(data)) setInquiries(data);
      })
      .catch((e) => {
        console.error("Talepler yüklenemedi:", e);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdminLoggedIn, adminPassword]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAdminPanel = (tab: AdminTab = "add") => {
    if (isAdminLoggedIn) {
      setActiveAdminTab(tab);
      setShowAdminDashboardModal(true);
    } else {
      setShowAdminModal(true);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      safeLocalStorage.setItem("fenomen_favorites", JSON.stringify(next));
      showToast(exists ? "İlan favorilerden çıkarıldı." : "İlan favorilere eklendi!");
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        showToast("En fazla 3 ilan karşılaştırabilirsiniz.");
        return prev;
      }
      showToast("İlan karşılaştırma listesine eklendi.");
      return [...prev, id];
    });
  };

  const clearCompared = () => setComparedIds([]);

  const adminLogin = async (pw: string): Promise<boolean> => {
    setAdminAuthLoading(true);
    try {
      const result = await apiFetch("/api/admin-login", {
        method: "POST",
        body: JSON.stringify({ password: pw }),
      });
      if (result?.ok) {
        setIsAdminLoggedIn(true);
        setAdminPassword(pw);
        safeLocalStorage.setItem("fenomen_admin_session", "true");
        safeLocalStorage.setItem("fenomen_admin_password", pw);
        showToast("Yönetici girişi başarılı! İlan ekleme paneli açılıyor.");
        setActiveAdminTab("add");
        setShowAdminDashboardModal(true);
        return true;
      }
      showToast("Hatalı şifre! Lütfen şifrenizi kontrol ediniz.");
      return false;
    } catch (e) {
      console.error("Admin login error:", e);
      showToast("Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
      return false;
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminPassword(null);
    setShowAdminDashboardModal(false);
    safeLocalStorage.removeItem("fenomen_admin_session");
    safeLocalStorage.removeItem("fenomen_admin_password");
    showToast("Yönetici çıkışı yapıldı.");
  };

  const addProperty = (p: NewProperty) => {
    const id = `FNM-${Math.floor(2000 + Math.random() * 8000)}`;
    const created: Property = {
      ...p,
      id,
      createdAt: new Date().toISOString().split("T")[0],
      viewsCount: 1,
    };
    // İyimser (optimistic) güncelleme: ekranda hemen görünür,
    // arka planda veritabanına kaydedilir.
    setProperties((prev) => [created, ...prev]);
    showToast(`"${created.title.slice(0, 30)}..." başlıklı Afyon ilanı başarıyla yayınlandı!`);
    apiFetch("/api/properties", { method: "POST", body: JSON.stringify(created) }, adminPassword).catch(
      (e) => {
        console.error("İlan kaydedilemedi:", e);
        setProperties((prev) => prev.filter((x) => x.id !== id));
        showToast("İlan kaydedilemedi, lütfen tekrar deneyin.");
      }
    );
    return created;
  };

  const updateProperty = (id: string, patch: Partial<Property>) => {
    let previous: Property[] = [];
    setProperties((prev) => {
      previous = prev;
      return prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
    });
    showToast("İlan bilgileri güncellendi.");
    const updated = properties.find((p) => p.id === id);
    const full = updated ? { ...updated, ...patch } : patch;
    apiFetch(`/api/properties?id=${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(full) }, adminPassword).catch(
      (e) => {
        console.error("İlan güncellenemedi:", e);
        setProperties(previous);
        showToast("İlan güncellenemedi, lütfen tekrar deneyin.");
      }
    );
  };

  const deleteProperty = (id: string) => {
    let removed: Property | undefined;
    setProperties((prev) => {
      removed = prev.find((p) => p.id === id);
      return prev.filter((p) => p.id !== id);
    });
    showToast("İlan sistemden silindi.");
    apiFetch(`/api/properties?id=${encodeURIComponent(id)}`, { method: "DELETE" }, adminPassword).catch((e) => {
      console.error("İlan silinemedi:", e);
      if (removed) {
        const toRestore = removed;
        setProperties((prev) => [toRestore, ...prev]);
      }
      showToast("İlan silinemedi, lütfen tekrar deneyin.");
    });
  };

  const getPropertyById = (id: string) => properties.find((p) => p.id === id);

  const incrementViews = (id: string) => {
    let newCount = 0;
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        newCount = p.viewsCount + 1;
        return { ...p, viewsCount: newCount };
      })
    );
    // Görüntülenme sayacı kritik olmadığı için sessizce (hata gösterilmeden) senkronize edilir.
    const target = properties.find((p) => p.id === id);
    if (target) {
      apiFetch(
        `/api/properties?id=${encodeURIComponent(id)}`,
        { method: "PUT", body: JSON.stringify({ ...target, viewsCount: newCount || target.viewsCount + 1 }) },
        adminPassword
      ).catch(() => {
        // sessiz geç — görüntülenme sayısı kritik değil
      });
    }
  };

  const resetFilters = () => setFilters(defaultFilters);

  const addInquiry = (i: NewInquiry) => {
    const inq: Inquiry = {
      ...i,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toLocaleString("tr-TR"),
      read: false,
    };
    showToast("Geri arama talebiniz Afyon Fenomen Emlak yetkililerine iletildi!");
    apiFetch("/api/inquiries", { method: "POST", body: JSON.stringify(inq) }).catch((e) => {
      console.error("Talep gönderilemedi:", e);
      showToast("Talebiniz gönderilemedi, lütfen tekrar deneyin veya bizi arayın.");
    });
    // Admin şu an panelde açıksa listesine de yansıtalım.
    if (isAdminLoggedIn) setInquiries((prev) => [inq, ...prev]);
  };

  const markInquiryRead = (id: string) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    apiFetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ read: true }) }, adminPassword).catch(
      (e) => console.error("Talep güncellenemedi:", e)
    );
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const hay = (
            p.title +
            " " +
            p.description +
            " " +
            p.location.city +
            " " +
            p.location.district +
            " " +
            p.location.neighborhood +
            " " +
            p.id
          ).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filters.status !== "Tümü" && p.status !== filters.status) return false;
        if (filters.category !== "Tümü" && p.category !== filters.category) return false;
        if (filters.city !== "Tümü" && p.location.city !== filters.city) return false;
        if (filters.district !== "Tümü" && p.location.district !== filters.district) return false;
        if (filters.minPrice !== null && p.price < filters.minPrice) return false;
        if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;
        if (filters.minM2 !== null && p.specs.grossM2 < filters.minM2) return false;
        if (filters.maxM2 !== null && p.specs.grossM2 > filters.maxM2) return false;
        if (filters.roomCounts.length > 0 && !filters.roomCounts.includes(p.specs.roomCount))
          return false;
        if (filters.buildingAge !== "Tümü" && p.specs.buildingAge !== filters.buildingAge)
          return false;
        if (filters.furnishedOnly && !p.specs.furnished) return false;
        if (filters.creditEligibleOnly && !p.specs.creditEligible) return false;
        if (filters.badgeFilter !== "Tümü" && !p.badges.includes(filters.badgeFilter))
          return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "m2-desc":
            return b.specs.grossM2 - a.specs.grossM2;
          case "popular":
            return b.viewsCount - a.viewsCount;
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [properties, filters]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        filters,
        setFilters,
        resetFilters,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        incrementViews,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        adminAuthLoading,
        showAdminModal,
        setShowAdminModal,
        showAdminDashboardModal,
        setShowAdminDashboardModal,
        activeAdminTab,
        setActiveAdminTab,
        openAdminPanel,
        favorites,
        toggleFavorite,
        comparedIds,
        toggleCompare,
        clearCompared,
        inquiries,
        addInquiry,
        markInquiryRead,
        selectedProperty,
        setSelectedProperty,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProperties = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperties must be used within a PropertyProvider");
  return ctx;
};
