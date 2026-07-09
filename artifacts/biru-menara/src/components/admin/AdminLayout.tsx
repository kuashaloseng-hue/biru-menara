import { Link, useLocation } from "wouter";
import { useAdminLogout } from "@workspace/api-client-react";
import { AdminGuard } from "./AdminGuard";
import { 
  LayoutDashboard, 
  BellRing, 
  Newspaper, 
  CalendarDays, 
  Users, 
  Download, 
  Settings, 
  LogOut,
  Menu,
  X,
  Images
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const navItems = [
  { href: "/admin", label: "แผงควบคุม", icon: LayoutDashboard },
  { href: "/admin/announcements", label: "ประกาศ", icon: BellRing },
  { href: "/admin/news", label: "ข่าวสาร", icon: Newspaper },
  { href: "/admin/schedules", label: "ตารางแข่งขัน", icon: CalendarDays },
  { href: "/admin/team", label: "คณะทำงาน", icon: Users },
  { href: "/admin/gallery", label: "แกลเลอรี่", icon: Images },
  { href: "/admin/downloads", label: "ไฟล์ดาวน์โหลด", icon: Download },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logout = useAdminLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/admin/login");
        toast.success("ออกจากระบบสำเร็จ");
      },
      onError: () => {
        toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
      }
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-white/10 p-4">
      <div className="mb-8 px-4">
        <h2 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
          BIRU <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">MENARA</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1 font-medium">แผงควบคุม</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <span className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,150,255,0.15)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}>
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,150,255,0.8)]" : "")} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
        {/* Mobile menu toggle */}
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-card/80 backdrop-blur-md border-white/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block w-72 h-screen sticky top-0 shrink-0">
          <SidebarContent />
        </div>

        {/* Sidebar (Mobile) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute top-0 left-0 w-72 h-full shadow-2xl">
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
