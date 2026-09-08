import { getSupabaseAdmin, checkAdminAuth } from "./_lib/supabaseAdmin.js";

const BUCKET = "property-images";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!checkAdminAuth(req)) {
    res.status(401).json({ error: "Yetkisiz erişim." });
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const fileName = (body?.fileName || "resim").replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    res.status(200).json({
      path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
