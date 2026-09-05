export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const password = body?.password;
    const real = process.env.ADMIN_PASSWORD;

    if (real && password === real) {
      res.status(200).json({ ok: true });
      return;
    }
    res.status(401).json({ ok: false });
  } catch {
    res.status(500).json({ ok: false, error: "Sunucu hatası" });
  }
}
