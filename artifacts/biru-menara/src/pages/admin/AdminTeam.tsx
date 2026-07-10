import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  useListTeamMembers, 
  useCreateTeamMember, 
  useUpdateTeamMember, 
  useDeleteTeamMember,
  getListTeamMembersQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, UserCircle } from "lucide-react";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { toast } from "sonner";

const MEMBER_TYPES = [
  { value: "main", label: "ทีมงานหลัก" },
  { value: "sub", label: "ทีมงานสนับสนุน" }
];

export default function AdminTeam() {
  const queryClient = useQueryClient();
  const { data: teamMembers, isLoading } = useListTeamMembers({ query: { queryKey: getListTeamMembersQueryKey() } });
  
  const createTeam = useCreateTeamMember();
  const updateTeam = useUpdateTeamMember();
  const deleteTeam = useDeleteTeamMember();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    memberType: "main",
    imageUrl: "",
    sortOrder: 0
  });

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const resetForm = () => {
    setFormData({
      role: "",
      name: "",
      memberType: "main",
      imageUrl: "",
      sortOrder: (teamMembers?.length || 0) * 10
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: any) => {
    setFormData({
      role: member.role,
      name: member.name,
      memberType: member.memberType,
      imageUrl: member.imageUrl || "",
      sortOrder: member.sortOrder
    });
    setEditingId(member.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.role || !formData.name) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    const payload = {
      ...formData,
      imageUrl: formData.imageUrl || null,
      sortOrder: Number(formData.sortOrder)
    };

    if (editingId) {
      updateTeam.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
          toast.success("อัปเดตข้อมูลคณะทำงานสำเร็จ");
          setIsModalOpen(false);
        }
      });
    } else {
      createTeam.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
          toast.success("เพิ่มคณะทำงานสำเร็จ");
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
      deleteTeam.mutate({ id: deletingId }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
          toast.success("ลบคณะทำงานสำเร็จ");
          setIsConfirmDeleteOpen(false);
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการคณะทำงาน</h1>
          <p className="text-muted-foreground">จัดการรายชื่อ บทบาท และรูปภาพของคณะทำงานสีฟ้า</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> เพิ่มคณะทำงาน
        </Button>
      </div>

      <div className="glass border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white w-20">รูปภาพ</TableHead>
              <TableHead className="text-white">ชื่อ-นามสกุล</TableHead>
              <TableHead className="text-white w-48">บทบาท</TableHead>
              <TableHead className="text-white w-32 text-center">ประเภท</TableHead>
              <TableHead className="text-white w-20 text-center">ลำดับ</TableHead>
              <TableHead className="text-white w-24 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell>
              </TableRow>
            ) : teamMembers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">ยังไม่มีคณะทำงาน</TableCell>
              </TableRow>
            ) : teamMembers?.map((item) => (
              <TableRow key={item.id} className="border-b border-white/5 hover:bg-white/5">
                <TableCell>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-full border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-white">{item.name}</div>
                </TableCell>
                <TableCell className="text-primary font-medium">
                  {item.role}
                </TableCell>
                <TableCell className="text-center">
                  {item.memberType === "main" ? (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">ทีมงานหลัก</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20">ทีมงานสนับสนุน</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center font-mono text-gray-400">
                  {item.sortOrder}
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
            <DialogTitle>{editingId ? "แก้ไขคณะทำงาน" : "เพิ่มคณะทำงาน"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>ชื่อ-นามสกุล <span className="text-red-500">*</span></Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-black/30 border-white/10" />
            </div>
            <div className="grid gap-2">
              <Label>บทบาท / ตำแหน่ง <span className="text-red-500">*</span></Label>
              <Input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น ประธานสี" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>ประเภท</Label>
                <Select value={formData.memberType} onValueChange={(v) => setFormData({...formData, memberType: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MEMBER_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>ลำดับการแสดงผล</Label>
                <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} className="bg-black/30 border-white/10" />
              </div>
            </div>
            <AdminImageUploader
              label="รูปโปรไฟล์ (ไม่บังคับ)"
              value={formData.imageUrl}
              onChange={(url) => setFormData({...formData, imageUrl: url})}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createTeam.isPending || updateTeam.isPending}>
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
          <p className="py-4 text-gray-300">คุณแน่ใจหรือไม่ว่าต้องการลบบุคคลนี้?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmDeleteOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteTeam.isPending}>
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
