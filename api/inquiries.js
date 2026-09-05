import { getSupabaseAdmin, checkAdminAuth } from "./_lib/supabaseAdmin.js";

export default async function handler(req, res) {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }

  // --- Herkese açık: müşteri geri arama talebi gönderebilir ---
  if (req.method === "POST") {
    const inquiry = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!inquiry || !inquiry.id) {
      res.status(400).json({ error: "Geçersiz talep verisi." });
      return;
    }
    const { error } = await supabase.from("inquiries").insert({ id: inquiry.id, data: inquiry });
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  // --- Talepleri görüntülemek/okundu işaretlemek sadece admin ---
  if (!checkAdminAuth(req)) {
    res.status(401).json({ error: "Yetkisiz erişim." });
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("inquiries")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json((data || []).map((row) => row.data));
    return;
  }

  if (req.method === "PATCH") {
    const id = req.query.id || "";
    const patch = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!id || !patch) {
      res.status(400).json({ error: "Geçersiz istek." });
      return;
    }
    const { data: existing, error: fetchErr } = await supabase
      .from("inquiries")
      .select("data")
      .eq("id", id)
      .single();
    if (fetchErr || !existing) {
      res.status(404).json({ error: "Talep bulunamadı." });
      return;
    }
    const merged = { ...existing.data, ...patch };
    const { error } = await supabase.from("inquiries").update({ data: merged }).eq("id", id);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
