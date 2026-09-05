import { useState } from "react";
import { X, Lock, KeyRound, LogIn } from "lucide-react";
import { useProperties } from "../../context/PropertyContext";
import { LOGO_SRC } from "../../lib/constants";

export default function AdminModal() {
  const { showAdminModal, setShowAdminModal, adminLogin, adminAuthLoading } = useProperties();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  if (!showAdminModal) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await adminLogin(pw);
    if (ok) {
      setShowAdminModal(false);
      setPw("");
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl my-auto text-center text-slate-900 animate-in fade-in zoom-in duration-200 overflow-hidden">
        <button
          onClick={() => setShowAdminModal(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/80 backdrop-blur text-slate-500 hover:text-slate-900 border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Giriş bölümü arka plan görseli (kullanıcı isteği) */}
        <div className="relative h-40 border-b border-slate-200 flex items-center justify-center overflow-hidden">
          <img
            src={LOGO_SRC}
            alt="Fenomen Emlak"
            className="absolute inset-0 w-full h-full object-contain p-6 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        <div className="p-6 pt-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 -mt-12 relative z-10 shadow-lg shadow-rose-600/10 bg-white">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-900 mb-1">Yönetici Girişi</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 font-medium">
            Fenomen Emlak yetkili admin şifrenizi girerek ilan yönetimi ve yeni ilan ekleme alanına
            erişebilirsiniz.
          </p>
          <form onSubmit={onSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Yönetici Şifresi</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Şifrenizi giriniz"
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value);
                    setError(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-600 font-medium"
                />
              </div>
              {error && (
                <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <span>⚠️ Hatalı şifre! Lütfen yönetici şifrenizi kontrol ediniz.</span>
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={adminAuthLoading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{adminAuthLoading ? "Giriş yapılıyor..." : "Giriş Yap"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
