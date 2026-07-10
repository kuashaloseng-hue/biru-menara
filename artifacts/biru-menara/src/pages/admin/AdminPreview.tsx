import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGES = [
  { label: "หน้าแรก", path: "/" },
  { label: "ข่าวสาร", path: "/news" },
  { label: "ตารางแข่งขัน", path: "/schedule" },
  { label: "ดาวน์โหลด", path: "/downloads" },
  { label: "คณะทำงาน", path: "/team" },
  { label: "ติดต่อ", path: "/contact" },
];

const VIEWPORTS = [
  { label: "จอใหญ่", icon: Monitor, width: "100%", device: "desktop" },
  { label: "แท็บเล็ต", icon: Tablet, width: "768px", device: "tablet" },
  { label: "มือถือ", icon: Smartphone, width: "390px", device: "mobile" },
] as const;

export default function AdminPreview() {
  const [activePage, setActivePage] = useState("/");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [key, setKey] = useState(0); // force iframe reload

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const src = `${base}${activePage}`;
  const vpWidth = VIEWPORTS.find((v) => v.device === viewport)?.width ?? "100%";

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">ดูตัวอย่างเว็บ</h1>
          <p className="text-muted-foreground text-sm">ดูหน้าเว็บจริงโดยไม่ต้องออกจากระบบ</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 gap-2"
            onClick={() => setKey((k) => k + 1)}
          >
            <RefreshCw className="w-4 h-4" /> รีโหลด
          </Button>
          <a href={src} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="border-white/10 gap-2">
              <ExternalLink className="w-4 h-4" /> เปิดแท็บใหม่
            </Button>
          </a>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Page tabs */}
        <div className="flex gap-1 glass rounded-xl p-1">
          {PAGES.map((page) => (
            <button
              key={page.path}
              onClick={() => setActivePage(page.path)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                activePage === page.path
                  ? "bg-primary text-white shadow"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Viewport */}
        <div className="flex gap-1 glass rounded-xl p-1 ml-auto">
          {VIEWPORTS.map((v) => (
            <button
              key={v.device}
              onClick={() => setViewport(v.device)}
              title={v.label}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewport === v.device
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <v.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* iframe */}
      <div className="flex justify-center w-full">
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl transition-all duration-300"
          style={{ width: vpWidth, height: "calc(100vh - 280px)", minHeight: "500px" }}
        >
          <iframe
            key={key}
            src={src}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
