import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useListGallery,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  getListGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm, sortOrder: (gallery?.length ?? 0) + 1 });
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setForm({
      imageUrl: item.imageUrl,
      caption: item.caption,
      sortOrder: item.sortOrder,
      published: item.published,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.imageUrl.trim()) {
      toast.error("กรุณาใส่ URL รูปภาพ");
      return;
    }
    if (editItem) {
      updateImage.mutate(
        { id: editItem.id, data: form },
        {
          onSuccess: () => { invalidate(); setModalOpen(false); toast.success("แก้ไขภาพสำเร็จ"); },
          onError: () => toast.error("เกิดข้อผิดพลาด"),
        }
      );
    } else {
      createImage.mutate(
        { data: form },
        {
          onSuccess: () => { invalidate(); setModalOpen(false); toast.success("เพิ่มภาพสำเร็จ"); },
          onError: () => toast.error("เกิดข้อผิดพลาด"),
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteImage.mutate(
      { id: deleteId },
      {
        onSuccess: () => { invalidate(); setDeleteId(null); toast.success("ลบภาพสำเร็จ"); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการแกลเลอรี่</h1>
          <p className="text-muted-foreground">เพิ่ม แก้ไข ลบ และเรียงลำดับภาพในส่วนสไลด์โชว์</p>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-colors group"
            >
              {/* Image */}
              <div className="relative h-48 bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {/* Sort order badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-1">
                  <GripVertical className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">#{item.sortOrder}</span>
                </div>
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
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">{item.caption}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground truncate flex-1">
                  {item.caption || <span className="italic">ไม่มีคำบรรยาย</span>}
                </p>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:border-primary/50 h-8 px-3"
                    onClick={() => openEdit(item as GalleryItem)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:border-destructive/50 hover:text-destructive h-8 px-3"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editItem ? "แก้ไขภาพ" : "เพิ่มภาพใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>URL รูปภาพ *</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://... วางลิงก์รูปภาพ"
                className="bg-black/30 border-white/10"
              />
              {form.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/10 h-36 bg-black/40">
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>ข้อความใต้ภาพ (คำบรรยาย)</Label>
              <Input
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="เช่น เปิดตัว BIRU MENARA"
                className="bg-black/30 border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ลำดับการแสดง</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="bg-black/30 border-white/10"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>สถานะ</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) => setForm({ ...form, published: v })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.published ? "แสดงบนเว็บ" : "ซ่อน"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10">
              ยกเลิก
            </Button>
            <Button
              onClick={handleSave}
              disabled={createImage.isPending || updateImage.isPending}
            >
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
            <AlertDialogDescription>
              ภาพนี้จะถูกลบออกจากแกลเลอรี่ถาวร ไม่สามารถกู้คืนได้
            </AlertDialogDescription>
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
