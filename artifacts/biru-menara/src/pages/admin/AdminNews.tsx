import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useListNews,
  useCreateNewsPost,
  useUpdateNewsPost,
  useDeleteNewsPost,
  getListNewsQueryKey,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Image as ImageIcon, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";

const CATEGORIES = ["ข่าวกิจกรรม", "ข่าวการแข่งขัน", "ข่าวประชาสัมพันธ์"];

type NewsItem = {
  id: number; title: string; excerpt: string; content: string; date: string;
  category: string; imageUrl?: string | null; sortOrder: number; published: boolean; createdAt: string;
};

function SortableNewsRow({
  item, onEdit, onDelete,
}: { item: NewsItem; onEdit: (item: NewsItem) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <TableRow ref={setNodeRef} style={style} className="border-b border-white/5 hover:bg-white/5">
      <TableCell className="w-8 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-gray-600 hover:text-gray-400" />
      </TableCell>
      <TableCell>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-md border border-white/10" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gray-500" />
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="font-medium text-white mb-1">{item.title}</div>
        <div className="text-sm text-gray-400 truncate max-w-md">{item.date}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{item.category}</Badge>
      </TableCell>
      <TableCell>
        {item.published
          ? <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20">เผยแพร่แล้ว</Badge>
          : <Badge variant="outline" className="text-gray-400 border-gray-600">ซ่อน</Badge>}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => onEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminNews() {
  const queryClient = useQueryClient();
  const { data: news, isLoading } = useListNews({ query: { queryKey: getListNewsQueryKey() } });

  const createNews = useCreateNewsPost();
  const updateNews = useUpdateNewsPost();
  const deleteNews = useDeleteNewsPost();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "", excerpt: "", content: "",
    date: format(new Date(), "dd MMM yyyy"),
    category: CATEGORIES[0], imageUrl: "", published: true,
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });

  const resetForm = () => {
    setFormData({ title: "", excerpt: "", content: "", date: format(new Date(), "dd MMM yyyy"), category: CATEGORIES[0], imageUrl: "", published: true });
    setEditingId(null);
  };

  const handleOpenCreate = () => { resetForm(); setIsModalOpen(true); };
  const handleOpenEdit = (item: NewsItem) => {
    setFormData({ title: item.title, excerpt: item.excerpt, content: item.content, date: item.date, category: item.category, imageUrl: item.imageUrl || "", published: item.published });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.content) { toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน"); return; }
    const payload = { ...formData, imageUrl: formData.imageUrl || null };
    if (editingId) {
      updateNews.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { invalidate(); toast.success("อัปเดตข่าวสารสำเร็จ"); setIsModalOpen(false); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    } else {
      createNews.mutate({ data: payload }, {
        onSuccess: () => { invalidate(); toast.success("สร้างข่าวสารสำเร็จ"); setIsModalOpen(false); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    }
  };

  const confirmDelete = (id: number) => { setDeletingId(id); setIsConfirmDeleteOpen(true); };
  const handleDelete = () => {
    if (!deletingId) return;
    deleteNews.mutate({ id: deletingId }, {
      onSuccess: () => { invalidate(); toast.success("ลบข่าวสารสำเร็จ"); setIsConfirmDeleteOpen(false); },
      onError: () => toast.error("เกิดข้อผิดพลาด"),
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !news) return;
    const items = [...news] as NewsItem[];
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    try {
      await Promise.all(
        reordered.map((item, idx) =>
          item.sortOrder !== idx
            ? updateNews.mutateAsync({ id: item.id, data: { sortOrder: idx } })
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
          <h1 className="text-3xl font-bold text-white mb-2">จัดการข่าวสาร</h1>
          <p className="text-muted-foreground">ลากเพื่อเรียงลำดับ • เพิ่ม แก้ไข ลบ ข่าวสาร</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> เพิ่มข่าวสาร
        </Button>
      </div>

      <div className="glass border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead className="text-white w-20">รูปภาพ</TableHead>
              <TableHead className="text-white">หัวข้อข่าว</TableHead>
              <TableHead className="text-white w-40">หมวดหมู่</TableHead>
              <TableHead className="text-white w-32">สถานะ</TableHead>
              <TableHead className="text-white w-32 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell></TableRow>
            ) : !news?.length ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">ยังไม่มีข่าวสาร</TableCell></TableRow>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={(news as NewsItem[]).map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  {(news as NewsItem[]).map((item) => (
                    <SortableNewsRow key={item.id} item={item} onEdit={handleOpenEdit} onDelete={confirmDelete} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[700px] max-h-[90vh] overflow-y-auto text-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "แก้ไขข่าวสาร" : "เพิ่มข่าวสารใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>หัวข้อข่าว <span className="text-red-500">*</span></Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-black/30 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>หมวดหมู่</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>วันที่</Label>
                <Input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="bg-black/30 border-white/10" />
              </div>
            </div>
            <AdminImageUploader
              label="รูปภาพข่าว (ไม่บังคับ)"
              value={formData.imageUrl}
              onChange={(url) => setFormData({...formData, imageUrl: url})}
            />
            <div className="grid gap-2">
              <Label>เกริ่นนำ (แสดงที่หน้าการ์ด) <span className="text-red-500">*</span></Label>
              <Textarea rows={2} value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="bg-black/30 border-white/10 resize-none" />
            </div>
            <div className="grid gap-2">
              <Label>เนื้อหาข่าว <span className="text-red-500">*</span></Label>
              <Textarea rows={8} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="bg-black/30 border-white/10 resize-none" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Switch checked={formData.published} onCheckedChange={(c) => setFormData({...formData, published: c})} />
              <Label className="cursor-pointer">เผยแพร่ทันที</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createNews.isPending || updateNews.isPending}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[400px] text-white">
          <DialogHeader><DialogTitle>ยืนยันการลบ</DialogTitle></DialogHeader>
          <p className="py-4 text-gray-300">คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้? ไม่สามารถเรียกคืนได้</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmDeleteOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteNews.isPending}>ลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
