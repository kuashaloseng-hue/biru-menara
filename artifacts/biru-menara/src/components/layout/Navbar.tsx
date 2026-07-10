import { Link, useLocation } from "wouter";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";

function parseNavItems(raw: string | null | undefined): Record<string, boolean> {
  try { if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  return {};
}

const ALL_LINKS = [
  { href: "/",          label: "หน้าแรก",       key: "home"      },
  { href: "/news",      label: "ข่าวสาร",        key: "news"      },
  { href: "/schedule",  label: "ตารางแข่งขัน",   key: "schedule"  },
  { href: "/downloads", label: "ดาวน์โหลด",      key: "downloads" },
  { href: "/team",      label: "คณะทำงาน",       key: "team"      },
  { href: "/contact",   label: "ติดต่อ",          key: "contact"   },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });

  const navConfig = parseNavItems(settings?.navItems);
  // Home is always shown; others respect the config (default true if not set)
  const links = ALL_LINKS.filter(({ key }) => key === "home" || navConfig[key] !== false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <Zap className="h-8 w-8 text-primary group-hover:text-accent transition-colors drop-shadow-[0_0_10px_rgba(0,150,255,0.8)]" />
                  <span className="font-bold text-xl tracking-wider text-white group-hover:glow-text transition-all">BIRU MENARA</span>
                </>
              )}
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    location === link.href
                      ? "text-accent glow-text bg-white/5"
                      : "text-gray-300 hover:text-white hover:bg-white/5 hover:glow-text"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10 absolute w-full left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location === link.href ? "text-accent bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
