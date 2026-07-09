import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  useGetSettings, 
  useUpdateSettings,
  getGetSettingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Instagram, Facebook, MapPin, Phone, Save, Image, Type } from "lucide-react";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

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
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        instagram: settings.instagram || "",
        facebook: settings.facebook || "",
        address: settings.address || "",
        phone: settings.phone || "",
        heroTitle: settings.heroTitle || "",
        heroSlogan: settings.heroSlogan || "",
        heroSubSlogan: settings.heroSubSlogan || "",
        heroImageUrl: settings.heroImageUrl || "",
        logoUrl: settings.logoUrl || "",
      });
    }
  }, [settings]);

  const handleSave = () => {
    const payload = {
      ...formData,
      heroImageUrl: formData.heroImageUrl || null,
      logoUrl: formData.logoUrl || null,
      phone: formData.phone || null,
    };
    updateSettings.mutate({ data: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast.success("บันทึกการตั้งค่าสำเร็จ");
      },
      onError: () => {
        toast.error("เกิดข้อผิดพลาดในการบันทึก");
      }
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground">กำลังโหลด...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ตั้งค่าเว็บไซต์</h1>
          <p className="text-muted-foreground">แก้ไขรูปภาพ ข้อความหลัก และช่องทางการติดต่อ</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="gap-2 px-6">
          <Save className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
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
            <div className="space-y-2">
              <Label htmlFor="heroImageUrl" className="flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-400" /> URL ภาพพื้นหลัง (Hero)
              </Label>
              <Input
                id="heroImageUrl"
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({...formData, heroImageUrl: e.target.value})}
                className="bg-black/30 border-white/10"
                placeholder="https://... (วางลิงก์รูปภาพ)"
              />
              {formData.heroImageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/10 h-32">
                  <img
                    src={formData.heroImageUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover opacity-70"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">ใส่ URL รูปภาพ หรือวางลิงก์จาก Google Drive / Imgur ฯลฯ</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" /> URL โลโก้ (ไม่บังคับ)
              </Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                className="bg-black/30 border-white/10"
                placeholder="https://... (วางลิงก์รูปโลโก้)"
              />
              {formData.logoUrl && (
                <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/10 flex items-center gap-3">
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="h-10 w-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-xs text-muted-foreground">ตัวอย่างโลโก้</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">ถ้าว่างเปล่าจะใช้ไอคอน ⚡ BIRU MENARA ตามเดิม</p>
            </div>
          </CardContent>
        </Card>

        {/* Hero Text */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary">ข้อความหน้าแรก (Hero Section)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">พาดหัวหลัก</Label>
              <Input 
                id="heroTitle" 
                value={formData.heroTitle} 
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} 
                className="bg-black/30 border-white/10 text-lg font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSlogan">สโลแกนหลัก</Label>
              <Textarea 
                id="heroSlogan" 
                rows={2}
                value={formData.heroSlogan} 
                onChange={(e) => setFormData({...formData, heroSlogan: e.target.value})} 
                className="bg-black/30 border-white/10 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubSlogan">ข้อความรอง</Label>
              <Textarea 
                id="heroSubSlogan" 
                rows={2}
                value={formData.heroSubSlogan} 
                onChange={(e) => setFormData({...formData, heroSubSlogan: e.target.value})} 
                className="bg-black/30 border-white/10 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="glass border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-primary">ช่องทางการติดต่อ</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" /> ลิงก์ Instagram
              </Label>
              <Input 
                id="instagram" 
                value={formData.instagram} 
                onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                className="bg-black/30 border-white/10"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-500" /> ลิงก์ Facebook
              </Label>
              <Input 
                id="facebook" 
                value={formData.facebook} 
                onChange={(e) => setFormData({...formData, facebook: e.target.value})} 
                className="bg-black/30 border-white/10"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" /> เบอร์โทรศัพท์
              </Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                className="bg-black/30 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" /> ที่อยู่
              </Label>
              <Textarea 
                id="address" 
                rows={2}
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                className="bg-black/30 border-white/10 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
