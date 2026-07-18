import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  useListDownloads, 
  useCreateDownload, 
  useUpdateDownload, 
  useDeleteDownload,
  getListDownloadsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["เพลงเชียร์", "ตารางแข่งขัน", "โลโก้", "โปสเตอร์", "รูปภาพ", "เอกสาร"];

export default function AdminDownloads() {
  const queryClient = useQueryClient();
  const { data: downloads, isLoading } = useListDownloads({ query: { queryKey: getListDownloadsQueryKey() } });
  
  const createDownload = useCreateDownload();
  const updateDownload = useUpdateDownload();
  const deleteDownload = useDeleteDownload();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    size: "ไม่ระบุ",
    fileUrl: "",
    sortOrder: 0
  });

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      category: CATEGORIES[0],
      size: "ไม่ระบุ",
      fileUrl: "",
      sortOrder: (downloads?.length || 0) * 10
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (file: any) => {
    setFormData({
      name: file.name,
      category: file.category,
      size: file.size,
      fileUrl: file.fileUrl,
      sortOrder: file.sortOrder
    });
    setEditingId(file.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.fileUrl) {
      toast.error("กรุณากรอกชื่อไฟล์และลิงก์ให้ครบถ้วน");
      return;
    }

    const payload = {
      ...formData,
      sortOrder: Number(formData.sortOrder)
    };

    if (editingId) {
      updateDownload.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDownloadsQueryKey() });
          toast.success("อัปเดตไฟล์ดาวน์โหลดสำเร็จ");
          setIsModalOpen(false);
        }
      });
    } else {
      createDownload.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDownloadsQueryKey() });
          toast.success("เพิ่มไฟล์ดาวน์โหลดสำเร็จ");
          setIsModalOpen(false);
        }
      });
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteDownload.mutate({ id: deletingId }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDownloadsQueryKey() });
          toast.success("ลบไฟล์ดาวน์โหลดสำเร็จ");
          setIsConfirmDeleteOpen(false);
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
  จัดการไฟล์ดาวน์โหลด
</h1>
          <p className="text-muted-foreground">เอกสาร เพลงเชียร์ และไฟล์สื่อต่างๆ</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> เพิ่มไฟล์
        </Button>
      </div>

      <div className="glass border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white">ชื่อไฟล์</TableHead>
              <TableHead className="text-white w-32">หมวดหมู่</TableHead>
              <TableHead className="text-white w-24 text-right">ขนาด</TableHead>
              <TableHead className="text-white w-20 text-center">ลิงก์</TableHead>
              <TableHead className="text-white w-24 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell>
              </TableRow>
            ) : downloads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">ยังไม่มีไฟล์ดาวน์โหลด</TableCell>
              </TableRow>
            ) : downloads?.map((item) => (
              <TableRow key={item.id} className="border-b border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="font-bold text-white">{item.name}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400 text-right font-mono text-sm">
                  {item.size}
                </TableCell>
                <TableCell className="text-center">
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center p-2 rounded-lg hover:bg-blue-400/10 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => handleOpenEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => confirmDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[500px] text-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "แก้ไขไฟล์" : "เพิ่มไฟล์ดาวน์โหลด"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>ชื่อไฟล์ <span className="text-red-500">*</span></Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-black/30 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>หมวดหมู่</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>ขนาดไฟล์ (เช่น 2.5 MB)</Label>
                <Input value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="bg-black/30 border-white/10" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>ลิงก์ดาวน์โหลด (URL) <span className="text-red-500">*</span></Label>
              <Input value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} className="bg-black/30 border-white/10" placeholder="https://..." />
            </div>
            <div className="grid gap-2 w-1/2">
              <Label>ลำดับการแสดงผล</Label>
              <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} className="bg-black/30 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createDownload.isPending || updateDownload.isPending}>
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[400px] text-white">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-300">คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์นี้?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmDeleteOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteDownload.isPending}>
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
