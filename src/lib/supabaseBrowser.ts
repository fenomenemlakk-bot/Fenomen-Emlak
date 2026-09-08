import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Bu istemci sadece imzalı (signed) yükleme URL'leriyle dosya yüklemek için
// kullanılır — anon anahtar tarayıcıda görünmesi güvenli olan, kısıtlı
// yetkili bir anahtardır (veritabanı okuma/yazma yetkisi vermez, sadece
// Storage'da imzalı URL üzerinden yükleme yapılmasına izin verir).
export const supabaseBrowser = url && anonKey ? createClient(url, anonKey) : null;
