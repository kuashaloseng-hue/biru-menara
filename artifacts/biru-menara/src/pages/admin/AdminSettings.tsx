import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useGetSettings,
  useUpdateSettings,
  useAdminChangePassword,
  getGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Instagram, Facebook, MapPin, Phone, Save, Image, Type, Lock, Eye, EyeOff, Menu } from "lucide-react";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";

// ─── Default nav visibility ───────────────────────────────────────────────────
const NAV_KEYS = [
  { key: "news",      label: "ข่าวสาร" },
  { key: "schedule",  label: "ตารางแข่งขัน" },
  { key: "downloads", label: "ดาวน์โหลด" },
  { key: "team",      label: "คณะทำงาน" },
  { key: "contact",   label: "ติดต่อ" },
];

function parseNavItems(raw: string | null | undefined): Record<string, boolean> {
  try { if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  return Object.fromEntries(NAV_KEYS.map((n) => [n.key, true]));
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

  // ── Site settings form ──
  const [formData, setFormData] = useState({
    instagram: "",
    facebook: "",
    address: "",
    phone: "",
    heroTitle: "",
    heroSlogan: "",
    heroSubSlogan: "",
    heroImageUrl: "",
    logoUrl: "",
    teamRosterImageUrl: "",
  });
  const [navItems, setNavItems] = useState<Record<string, boolean>>(parseNavItems(null));

  useEffect(() => {
    if (settings) {
      setFormData({
        instagram:    settings.instagram || "",
        facebook:     settings.facebook || "",
        address:      settings.address || "",
        phone:        settings.phone || "",
        heroTitle:    settings.heroTitle || "",
        heroSlogan:   settings.heroSlogan || "",
        heroSubSlogan: settings.heroSubSlogan || "",
        heroImageUrl: settings.heroImageUrl || "",
        logoUrl:      settings.logoUrl || "",
        teamRosterImageUrl: settings.teamRosterImageUrl || "",
      });
      setNavItems(parseNavItems(settings.navItems));
    }
  }, [settings]);

  const handleSave = () => {
    const payload = {
      ...formData,
      heroImageUrl: formData.heroImageUrl || null,
      logoUrl:      formData.logoUrl || null,
      teamRosterImageUrl: formData.teamRosterImageUrl || null,
      phone:        formData.phone || null,
      navItems:     JSON.stringify(navItems),
    };
    updateSettings.mutate({ data: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast.success("บันทึกการตั้งค่าสำเร็จ");
      },
      onError: () => toast.error("เกิดข้อผิดพลาดในการบันทึก"),
    });
  };

  // ── Password change ──
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const changePw = useAdminChangePassword();

  const handleChangePw = () => {
    if (!pwForm.current || !pwForm.next) { toast.error("กรอกรหัสผ่านให้ครบ"); return; }
    if (pwForm.next.length < 6) { toast.error("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร"); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error("รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน"); return; }
    changePw.mutate(
      { data: { currentPassword: pwForm.current, newPassword: pwForm.next } },
      {
        onSuccess: () => { toast.success("เปลี่ยนรหัสผ่านสำเร็จ"); setPwForm({ current: "", next: "", confirm: "" }); },
        onError: (e: unknown) => {
          const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
          toast.error(msg || "รหัสผ่านปัจจุบันไม่ถูกต้อง");
        },
      }
    );
  };

  if (isLoading) {
    return <AdminLayout><div className="text-center py-20 text-muted-foreground">กำลังโหลด...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ตั้งค่าเว็บไซต์</h1>
          <p className="text-muted-foreground">แก้ไขรูปภาพ ข้อความหลัก เมนูนำทาง และช่องทางการติดต่อ</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="gap-2 px-6">
          <Save className="w-4 h-4" /> บันทึกทั้งหมด
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Settings */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Image className="w-5 h-5" /> รูปภาพเว็บไซต์
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AdminImageUploader
              label="ภาพพื้นหลัง Hero"
              value={formData.heroImageUrl}
              onChange={(url) => setFormData({...formData, heroImageUrl: url})}
            />
            <AdminImageUploader
              label="โลโก้เว็บไซต์ (ไม่บังคับ)"
              value={formData.logoUrl}
              onChange={(url) => setFormData({...formData, logoUrl: url})}
            />
            <AdminImageUploader
              label="รูปรายชื่อนักกีฬาและคณะทำงาน (หน้าทีม)"
              value={formData.teamRosterImageUrl}
              onChange={(url) => setFormData({...formData, teamRosterImageUrl: url})}
            />
          </CardContent>
        </Card>

        {/* Hero Text */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary">ข้อความหน้าแรก (Hero)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>พาดหัวหลัก</Label>
              <Input value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                className="bg-black/30 border-white/10 text-lg font-bold" />
            </div>
            <div className="space-y-2">
              <Label>สโลแกนหลัก</Label>
              <Textarea rows={2} value={formData.heroSlogan} onChange={(e) => setFormData({...formData, heroSlogan: e.target.value})}
                className="bg-black/30 border-white/10 resize-none" />
            </div>
            <div className="space-y-2">
              <Label>ข้อความรอง</Label>
              <Textarea rows={2} value={formData.heroSubSlogan} onChange={(e) => setFormData({...formData, heroSubSlogan: e.target.value})}
                className="bg-black/30 border-white/10 resize-none" />
            </div>
          </CardContent>
        </Card>

        {/* Nav Items */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Menu className="w-5 h-5" /> เมนูนำทาง (แสดง/ซ่อน)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">เลือกหน้าที่จะแสดงในเมนูบนเว็บ — "หน้าแรก" แสดงเสมอ</p>
            {NAV_KEYS.map((nav) => (
              <div key={nav.key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <Label className="cursor-pointer text-white font-medium">{nav.label}</Label>
                <Switch
                  checked={navItems[nav.key] !== false}
                  onCheckedChange={(v) => setNavItems({ ...navItems, [nav.key]: v })}
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
              💡 อย่าลืมกด <strong className="text-white">บันทึกทั้งหมด</strong> หลังจากปรับเมนู
            </p>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Lock className="w-5 h-5" /> เปลี่ยนรหัสผ่าน Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>รหัสผ่านปัจจุบัน</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  className="bg-black/30 border-white/10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)</Label>
              <Input
                type={showPw ? "text" : "password"}
                value={pwForm.next}
                onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                className="bg-black/30 border-white/10"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label>ยืนยันรหัสผ่านใหม่</Label>
              <Input
                type={showPw ? "text" : "password"}
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="bg-black/30 border-white/10"
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={handleChangePw}
              disabled={changePw.isPending}
              variant="outline"
              className="w-full border-white/10 hover:border-primary/50 gap-2"
            >
              <Lock className="w-4 h-4" />
              {changePw.isPending ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
            </Button>
            <p className="text-xs text-muted-foreground">
              หลังเปลี่ยนรหัสผ่านแล้ว ใช้รหัสใหม่ในการล็อกอินครั้งต่อไป
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="glass border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-primary">ช่องทางการติดต่อ</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> ลิงก์ Instagram</Label>
              <Input value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="bg-black/30 border-white/10" placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-500" /> ลิงก์ Facebook</Label>
              <Input value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                className="bg-black/30 border-white/10" placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-500" /> เบอร์โทรศัพท์</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-black/30 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> ที่อยู่</Label>
              <Textarea rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="bg-black/30 border-white/10 resize-none" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
