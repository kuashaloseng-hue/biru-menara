import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("กรุณากรอกรหัสผ่าน");
      return;
    }

    login.mutate({ data: { password } }, {
      onSuccess: () => {
        toast.success("เข้าสู่ระบบสำเร็จ");
        setLocation("/admin");
      },
      onError: (error) => {
  console.error("LOGIN ERROR:", error);
  toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
}
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="glass border-white/10 shadow-[0_0_50px_rgba(0,150,255,0.15)] backdrop-blur-2xl">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_20px_rgba(0,150,255,0.3)]">
              <Lock className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(0,150,255,0.8)]" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-white drop-shadow-md mb-2">
                BIRU <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">MENARA</span>
              </CardTitle>
              <CardDescription className="text-gray-400 font-medium">
                เข้าสู่ระบบแผงควบคุมสำหรับผู้ดูแล
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="รหัสผ่านผู้ดูแลระบบ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 border-white/10 focus:border-primary text-white h-12 rounded-xl text-center text-lg tracking-widest placeholder:tracking-normal"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-lg font-bold shadow-[0_0_15px_rgba(0,150,255,0.4)] hover:shadow-[0_0_25px_rgba(0,150,255,0.6)] transition-all"
                disabled={login.isPending}
              >
                {login.isPending ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
