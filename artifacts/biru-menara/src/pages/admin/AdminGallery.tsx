import { useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useListGallery,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  getListGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ImageIcon, GripVertical } from "lucide-react";
import { toast } from "sonner";

type GalleryItem = {
  id: number;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  published: boolean;
};

const emptyForm = { imageUrl: "", caption: "", sortOrder: 0, published: true };

// ─── Sortable Card ────────────────────────────────────────────────────────────
function SortableCard({
  item,
  onEdit,
  onDelete,
}: {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-colors group"
    >
      {/* Image */}
      <div className="relative h-48 bg-black/40">
        <img
          src={item.imageUrl}
          alt={item.caption || "Gallery"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Drag handle — top-left */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-3 left-3 cursor-grab active:cursor-grabbing bg-black/60 hover:bg-black/80 rounded-lg p-1.5 touch-none transition-colors"
          title="กดค้างแล้วลากเพื่อเรียงลำดับ"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </button>

        {/* Published badge */}
        <div className="absolute top-3 right-3">
          {item.published ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">แสดง</Badge>
          ) : (
            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">ซ่อน</Badge>
          )}
        </div>

        {/* Caption overlay */}
        {item.caption && (
          <p className="absolute bottom-2 left-3 right-3 text-white text-sm font-medium line-clamp-1 pointer-events-none">
            {item.caption}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground truncate flex-1">
          {item.caption || <span className="italic">ไม่มีคำบรรยาย</span>}
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 hover:border-primary/50 h-8 px-3"
            onClick={() => onEdit(item)}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 hover:border-destructive/50 hover:text-destructive h-8 px-3"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: gallery, isLoading } = useListGallery({ query: { queryKey: getListGalleryQueryKey() } });
  const createImage = useCreateGalleryImage();
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Local copy for optimistic drag order
  const [localOrder, setLocalOrder] = useState<number[]>([]);
  const orderedGallery = (() => {
    if (!gallery) return [];
    if (localOrder.length !== gallery.length) return gallery;
    const map = new Map(gallery.map((g) => [g.id, g]));
    return localOrder.map((id) => map.get(id)).filter(Boolean) as typeof gallery;
  })();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
    setLocalOrder([]);
  }, [queryClient]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm, sortOrder: (gallery?.length ?? 0) + 1 });
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setForm({ imageUrl: item.imageUrl, caption: item.caption, sortOrder: item.sortOrder, published: item.published });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.imageUrl.trim()) { toast.error("กรุณาเลือกหรือใส่ URL รูปภาพ"); return; }
    if (editItem) {
      updateImage.mutate({ id: editItem.id, data: form }, {
        onSuccess: () => { invalidate(); setModalOpen(false); toast.success("แก้ไขภาพสำเร็จ"); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    } else {
      createImage.mutate({ data: form }, {
        onSuccess: () => { invalidate(); setModalOpen(false); toast.success("เพิ่มภาพสำเร็จ"); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    }
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteImage.mutate({ id: deleteId }, {
      onSuccess: () => { invalidate(); setDeleteId(null); toast.success("ลบภาพสำเร็จ"); },
      onError: () => toast.error("เกิดข้อผิดพลาด"),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !gallery) return;

    const ids = (localOrder.length === gallery.length ? localOrder : gallery.map((g) => g.id));
    const oldIdx = ids.indexOf(active.id as number);
    const newIdx = ids.indexOf(over.id as number);
    const newOrder = arrayMove(ids, oldIdx, newIdx);
    setLocalOrder(newOrder);

    // Persist new sortOrder — batch all, invalidate once after all complete
    const updates = newOrder
      .map((id, idx) => ({ id, sortOrder: idx + 1 }))
      .filter(({ id, sortOrder }) => {
        const item = gallery.find((g) => g.id === id);
        return item && item.sortOrder !== sortOrder;
      });

    if (updates.length > 0) {
      Promise.all(
        updates.map(({ id, sortOrder }) =>
          new Promise<void>((resolve, reject) =>
            updateImage.mutate(
              { id, data: { sortOrder } },
              { onSuccess: () => resolve(), onError: reject }
            )
          )
        )
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
      }).catch(() => {
        toast.error("บันทึกลำดับไม่สำเร็จ");
        setLocalOrder([]);
        queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">จัดการแกลเลอรี่</h1>
          <p className="text-muted-foreground text-sm">
            🖱 <strong className="text-white">กดค้างที่ไอคอน ⠿ แล้วลาก</strong> เพื่อเรียงลำดับภาพ
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> เพิ่มภาพ
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">กำลังโหลด...</div>
      ) : !gallery?.length ? (
        <div className="text-center py-20 glass rounded-2xl">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">ยังไม่มีภาพในแกลเลอรี่</p>
          <Button onClick={openAdd} className="mt-4 gap-2">
            <Plus className="w-4 h-4" /> เพิ่มภาพแรก
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedGallery.map((g) => g.id)} strategy={rectSortingStrategy}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderedGallery.map((item) => (
                <SortableCard
                  key={item.id}
                  item={item as GalleryItem}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editItem ? "แก้ไขภาพ" : "เพิ่มภาพใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <AdminImageUploader
              label="รูปภาพ *"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />
            <div className="space-y-2">
              <Label>ข้อความใต้ภาพ (คำบรรยาย)</Label>
              <Input
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="เช่น เปิดตัว BIRU MENARA"
                className="bg-black/30 border-white/10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <span className="text-sm text-muted-foreground">
                {form.published ? "แสดงบนเว็บ" : "ซ่อน"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10">ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createImage.isPending || updateImage.isPending}>
              {editItem ? "บันทึกการแก้ไข" : "เพิ่มภาพ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">ยืนยันการลบภาพ</AlertDialogTitle>
            <AlertDialogDescription>ภาพนี้จะถูกลบถาวร ไม่สามารถกู้คืนได้</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/80"
              disabled={deleteImage.isPending}
            >
              ลบภาพ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
