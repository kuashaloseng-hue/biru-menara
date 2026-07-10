import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useListAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  getListAnnouncementsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, AlertCircle, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";

type Ann = {
  id: number; title: string; content: string; date: string;
  urgent: boolean; imageUrl?: string | null; sortOrder: number; published: boolean; createdAt: string;
};

function SortableAnnRow({
  ann, onEdit, onDelete,
}: { ann: Ann; onEdit: (a: Ann) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ann.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <TableRow ref={setNodeRef} style={style} className="border-b border-white/5 hover:bg-white/5">
      <TableCell className="w-8 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-gray-600 hover:text-gray-400" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {ann.imageUrl && (
            <img src={ann.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <div>
            <div className="font-medium text-white flex items-center gap-2">
              {ann.title}
              {ann.urgent && <Badge variant="destructive" className="h-5 text-[10px]">ด่วน</Badge>}
            </div>
            <div className="text-sm text-gray-400 truncate max-w-sm">{ann.content}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-gray-300">{ann.date}</TableCell>
      <TableCell>
        {ann.published
          ? <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20">เผยแพร่แล้ว</Badge>
          : <Badge variant="outline" className="text-gray-400 border-gray-600">ซ่อน</Badge>}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => onEdit(ann)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => onDelete(ann.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

const emptyForm = { title: "", content: "", date: format(new Date(), "dd MMM yyyy"), urgent: false, imageUrl: "", published: true };

export default function AdminAnnouncements() {
  const queryClient = useQueryClient();
  const { data: announcements, isLoading } = useListAnnouncements({ query: { queryKey: getListAnnouncementsQueryKey() } });

  const createAnn = useCreateAnnouncement();
  const updateAnn = useUpdateAnnouncement();
  const deleteAnn = useDeleteAnnouncement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });

  const resetForm = () => { setFormData({ ...emptyForm, date: format(new Date(), "dd MMM yyyy") }); setEditingId(null); };

  const handleOpenCreate = () => { resetForm(); setIsModalOpen(true); };
  const handleOpenEdit = (ann: Ann) => {
    setFormData({ title: ann.title, content: ann.content, date: ann.date, urgent: ann.urgent, imageUrl: ann.imageUrl || "", published: ann.published });
    setEditingId(ann.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) { toast.error("กรุณากรอกข้อมูลให้ครบถ้วน"); return; }
    const payload = { ...formData, imageUrl: formData.imageUrl || null };
    if (editingId) {
      updateAnn.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { invalidate(); toast.success("อัปเดตประกาศสำเร็จ"); setIsModalOpen(false); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    } else {
      createAnn.mutate({ data: payload }, {
        onSuccess: () => { invalidate(); toast.success("สร้างประกาศสำเร็จ"); setIsModalOpen(false); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    }
  };

  const confirmDelete = (id: number) => { setDeletingId(id); setIsConfirmDeleteOpen(true); };
  const handleDelete = () => {
    if (!deletingId) return;
    deleteAnn.mutate({ id: deletingId }, {
      onSuccess: () => { invalidate(); toast.success("ลบประกาศสำเร็จ"); setIsConfirmDeleteOpen(false); },
      onError: () => toast.error("เกิดข้อผิดพลาด"),
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !announcements) return;
    const items = [...announcements] as Ann[];
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    try {
      await Promise.all(
        reordered.map((item, idx) =>
          item.sortOrder !== idx
            ? updateAnn.mutateAsync({ id: item.id, data: { sortOrder: idx } })
            : Promise.resolve()
        )
      );
    } catch {
      toast.error("เรียงลำดับไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      invalidate();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการประกาศ</h1>
          <p className="text-muted-foreground">ลากเพื่อเรียงลำดับ • เพิ่ม แก้ไข ลบ ประกาศสำคัญ</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> สร้างประกาศ
        </Button>
      </div>

      <div className="glass border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead className="text-white">หัวข้อประกาศ</TableHead>
              <TableHead className="text-white w-40">วันที่</TableHead>
              <TableHead className="text-white w-32">สถานะ</TableHead>
              <TableHead className="text-white w-32 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell></TableRow>
            ) : !announcements?.length ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">ยังไม่มีประกาศ</TableCell></TableRow>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={(announcements as Ann[]).map((a) => a.id)} strategy={verticalListSortingStrategy}>
                  {(announcements as Ann[]).map((ann) => (
                    <SortableAnnRow key={ann.id} ann={ann} onEdit={handleOpenEdit} onDelete={confirmDelete} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[620px] text-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label>หัวข้อประกาศ <span className="text-red-500">*</span></Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-black/30 border-white/10" />
            </div>
            <div className="grid gap-2">
              <Label>เนื้อหา <span className="text-red-500">*</span></Label>
              <Textarea rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="bg-black/30 border-white/10 resize-none" />
            </div>
            <AdminImageUploader
              label="รูปภาพประกาศ (ไม่บังคับ)"
              value={formData.imageUrl}
              onChange={(url) => setFormData({...formData, imageUrl: url})}
            />
            <div className="grid gap-2">
              <Label>วันที่ (เช่น 10 ม.ค. 2026)</Label>
              <Input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="bg-black/30 border-white/10" />
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <Switch checked={formData.urgent} onCheckedChange={(c) => setFormData({...formData, urgent: c})} />
                <Label className="cursor-pointer text-red-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> ประกาศด่วน
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.published} onCheckedChange={(c) => setFormData({...formData, published: c})} />
                <Label className="cursor-pointer">เผยแพร่ทันที</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createAnn.isPending || updateAnn.isPending}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[400px] text-white">
          <DialogHeader><DialogTitle>ยืนยันการลบ</DialogTitle></DialogHeader>
          <p className="py-4 text-gray-300">คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้? การกระทำนี้ไม่สามารถเรียกคืนได้</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmDeleteOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteAnn.isPending}>ลบประกาศ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
