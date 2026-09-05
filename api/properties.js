import { getSupabaseAdmin, checkAdminAuth } from "./_lib/supabaseAdmin.js";

export default async function handler(req, res) {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }

  // --- Herkese açık: ilanları listele ---
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("properties")
      .select("data")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json((data || []).map((row) => row.data));
    return;
  }

  // --- Aşağıdaki işlemler için admin şifresi zorunlu ---
  if (!checkAdminAuth(req)) {
    res.status(401).json({ error: "Yetkisiz erişim." });
    return;
  }

  if (req.method === "POST") {
    const property = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!property || !property.id) {
      res.status(400).json({ error: "Geçersiz ilan verisi." });
      return;
    }
    const { error } = await supabase.from("properties").insert({ id: property.id, data: property });
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "PUT") {
    const id = req.query.id || "";
    const property = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!id || !property) {
      res.status(400).json({ error: "Geçersiz istek." });
      return;
    }
    const { error } = await supabase.from("properties").update({ data: property }).eq("id", id);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    const id = req.query.id || "";
    if (!id) {
      res.status(400).json({ error: "id gerekli." });
      return;
    }
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
