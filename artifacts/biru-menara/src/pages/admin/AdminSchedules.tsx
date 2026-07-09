import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  useListSchedules, 
  useCreateSchedule, 
  useUpdateSchedule, 
  useDeleteSchedule,
  getListSchedulesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const GENDERS = ["ชาย", "หญิง", "รวม"];
const STATUSES = ["รอแข่งขัน", "กำลังแข่งขัน", "แข่งขันเสร็จสิ้น"];

export default function AdminSchedules() {
  const queryClient = useQueryClient();
  const { data: schedules, isLoading } = useListSchedules({ query: { queryKey: getListSchedulesQueryKey() } });
  
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    sport: "",
    gender: GENDERS[0],
    level: "",
    venue: "",
    date: format(new Date(), "dd MMM yyyy"),
    time: "",
    status: STATUSES[0],
    result: "",
    sortOrder: 0
  });

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const resetForm = () => {
    setFormData({
      sport: "",
      gender: GENDERS[0],
      level: "",
      venue: "",
      date: format(new Date(), "dd MMM yyyy"),
      time: "",
      status: STATUSES[0],
      result: "",
      sortOrder: (schedules?.length || 0) * 10
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (schedule: any) => {
    setFormData({
      sport: schedule.sport,
      gender: schedule.gender,
      level: schedule.level,
      venue: schedule.venue,
      date: schedule.date,
      time: schedule.time,
      status: schedule.status,
      result: schedule.result || "",
      sortOrder: schedule.sortOrder
    });
    setEditingId(schedule.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.sport || !formData.level || !formData.venue || !formData.time) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    const payload = {
      ...formData,
      result: formData.result || null,
      sortOrder: Number(formData.sortOrder)
    };

    if (editingId) {
      updateSchedule.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSchedulesQueryKey() });
          toast.success("อัปเดตตารางแข่งขันสำเร็จ");
          setIsModalOpen(false);
        }
      });
    } else {
      createSchedule.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSchedulesQueryKey() });
          toast.success("เพิ่มตารางแข่งขันสำเร็จ");
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
      deleteSchedule.mutate({ id: deletingId }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSchedulesQueryKey() });
          toast.success("ลบตารางแข่งขันสำเร็จ");
          setIsConfirmDeleteOpen(false);
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "รอแข่งขัน": return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
      case "กำลังแข่งขัน": return "bg-primary/20 text-primary border-primary/30 animate-pulse";
      case "แข่งขันเสร็จสิ้น": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-zinc-500/20 text-zinc-400";
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการตารางแข่งขัน</h1>
          <p className="text-muted-foreground">ตารางการแข่งขันและผลการแข่งขันกีฬาสีฟ้า</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> เพิ่มตารางแข่ง
        </Button>
      </div>

      <div className="glass border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white w-48">เวลา / สถานที่</TableHead>
              <TableHead className="text-white">กีฬา / รุ่น</TableHead>
              <TableHead className="text-white w-32 text-center">สถานะ</TableHead>
              <TableHead className="text-white w-32 text-center">ผลการแข่งขัน</TableHead>
              <TableHead className="text-white w-24 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell>
              </TableRow>
            ) : schedules?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">ยังไม่มีตารางแข่งขัน</TableCell>
              </TableRow>
            ) : schedules?.map((item) => (
              <TableRow key={item.id} className="border-b border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="font-bold text-white mb-1">{item.date} • {item.time} น.</div>
                  <div className="text-sm text-gray-400">{item.venue}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white mb-1">{item.sport}</div>
                  <div className="text-sm text-gray-400">รุ่น {item.level} ({item.gender})</div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-bold text-white text-lg">
                  {item.result || "-"}
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
        <DialogContent className="glass border-white/10 sm:max-w-[600px] text-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "แก้ไขตารางแข่งขัน" : "เพิ่มตารางแข่งขัน"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>กีฬา <span className="text-red-500">*</span></Label>
                <Input value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น ฟุตบอล" />
              </div>
              <div className="grid gap-2">
                <Label>ประเภท <span className="text-red-500">*</span></Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>รุ่น <span className="text-red-500">*</span></Label>
                <Input value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น ม.ปลาย" />
              </div>
              <div className="grid gap-2">
                <Label>สถานที่ <span className="text-red-500">*</span></Label>
                <Input value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น สนามกีฬา 1" />
              </div>
              <div className="grid gap-2">
                <Label>วันที่ <span className="text-red-500">*</span></Label>
                <Input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="bg-black/30 border-white/10" />
              </div>
              <div className="grid gap-2">
                <Label>เวลา <span className="text-red-500">*</span></Label>
                <Input value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น 09:00" />
              </div>
              <div className="grid gap-2">
                <Label>สถานะ</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>ผลการแข่งขัน</Label>
                <Input value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น 3-1" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>ลำดับการแสดงผล (น้อยไปมาก)</Label>
              <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} className="bg-black/30 border-white/10 w-1/3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createSchedule.isPending || updateSchedule.isPending}>
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
          <p className="py-4 text-gray-300">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmDeleteOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteSchedule.isPending}>
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
