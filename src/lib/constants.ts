// Marka görseli — kullanıcı isteği doğrultusunda başlık/giriş bölgesinde
// kullanılan görsel bu PNG ile değiştirildi.
export const LOGO_SRC = "/images/fenomen-logo.png";
export const LOGO_FALLBACK = "/logo.svg";

export const PHONE_DISPLAY = "0553 722 14 30";
export const PHONE_TEL = "05537221430";
export const WHATSAPP_NUMBER = "905537221430";
export const EMAIL = "fenomenemlakk03@gmail.com";
export const ADDRESS =
  "Dumlupınar, Ordu Blv. Bozcalar İşhanı İçerisinde 2.Katta, 03200 Afyonkarahisar Merkez/Afyonkarahisar";

export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
