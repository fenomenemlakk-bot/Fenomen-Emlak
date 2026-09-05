import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VercelRequest } from "@vercel/node";

let cachedClient: SupabaseClient | null = null;

/**
 * Sunucu tarafında (bu API fonksiyonları içinde) kullanılan Supabase istemcisi.
 * SERVICE ROLE anahtarını kullanır — bu anahtar asla tarayıcıya gönderilmez,
 * sadece Vercel'in ortam değişkenlerinde (Environment Variables) saklanır.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri Vercel'de tanımlı değil."
    );
  }

  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}

/**
 * İlan ekleme/silme/güncelleme ve talepleri görüntüleme gibi yazma/yönetim
 * işlemleri için basit parola doğrulaması. Parola tarayıcıya değil, her
 * istekle birlikte bir header (x-admin-password) üzerinden sunucuya
 * gönderilir ve burada ADMIN_PASSWORD ortam değişkeniyle karşılaştırılır.
 */
export function checkAdminAuth(req: VercelRequest): boolean {
  const provided = req.headers["x-admin-password"];
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  if (Array.isArray(provided)) return provided[0] === real;
  return provided === real;
}
