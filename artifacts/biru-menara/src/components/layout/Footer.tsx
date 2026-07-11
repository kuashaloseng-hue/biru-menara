import { Zap } from "lucide-react";
import { Link } from "wouter";
import { useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";

export function Footer() {
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });

  return (
    <footer className="w-full bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(0,150,255,0.8)]" />
            <span className="font-bold text-lg tracking-wider text-white">
              BIRU MENARA (สีฟ้า)
            </span>
          </div>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            โรงเรียนอัตตัรกียะห์อิสลามียะห์
            <br />
            {settings?.heroSlogan || "กีฬาสร้างคน สายน้ำสร้างวิถีชีวิต บรรพบุรุษสร้างแนวคิด สีฟ้าพิชิต เชิดชูเมืองนรา"}
          </p>
          <div className="pt-4 border-t border-border/50 w-full flex flex-col items-center gap-2">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} BIRU MENARA. All Rights Reserved.
            </p>
            <Link href="/admin/login">
              <p className="text-gray-600 text-[10px] cursor-default hover:text-gray-600 select-none">
                Developed by (Kuasha)
              </p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
