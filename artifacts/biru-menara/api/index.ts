import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาตให้เรียก API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url, method } = req;

  // LOGIN
  if (method === "POST" && url?.includes("/admin/login")) {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: "กรุณากรอกรหัสผ่าน"
      });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        error: "รหัสผ่านไม่ถูกต้อง"
      });
    }

    return res.status(200).json({
      isAdmin: true
    });
  }

  // ตรวจสอบสถานะ
  if (method === "GET" && url?.includes("/admin/me")) {
    return res.status(200).json({
      isAdmin: false
    });
  }

  return res.status(404).json({
    error: "API not found"
  });
}