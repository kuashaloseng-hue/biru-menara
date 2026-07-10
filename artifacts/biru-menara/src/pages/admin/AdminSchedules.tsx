import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useListSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  getListSchedulesQueryKey,
  useListScheduleAthletes,
  useCreateAthlete,
  useDeleteAthlete,
  getListScheduleAthletesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, UserPlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ScheduleMatch } from "@workspace/api-client-react";

const GENDERS = ["ชาย", "หญิง"];
const STATUSES = ["รอแข่งขัน", "กำลังแข่งขัน", "แข่งขันเสร็จสิ้น"];
const LEVELS = ["รุ่น ม.1-2", "รุ่น ม.3-4", "รุ่น ม.5-6"];

// ── Athlete management inline ────────────────────────────────────────────────

function AthletesSection({ scheduleId }: { scheduleId: number }) {
  const { data: athletes, isLoading } = useListScheduleAthletes(scheduleId, {
    query: { queryKey: getListScheduleAthletesQueryKey(scheduleId) },
  });
  const addAthlete = useCreateAthlete(scheduleId);
  const removeAthlete = useDeleteAthlete(scheduleId);

  const [form, setForm] = useState({ name: "", studentId: "", grade: "" });

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error("กรุณากรอกชื่อนักกีฬา"); return; }
    addAthlete.mutate(
      { name: form.name.trim(), studentId: form.studentId.trim(), grade: form.grade.trim() },
      {
        onSuccess: () => { setForm({ name: "", studentId: "", grade: "" }); toast.success("เพิ่มนักกีฬาสำเร็จ"); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      }
    );
  };

  return (
    <div className="bg-black/20 border-t border-white/5 px-4 py-4">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
        รายชื่อนักกีฬา ({athletes?.length ?? 0} คน)
      </p>

      {isLoading ? (
        <div className="py-3 flex justify-center"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
      ) : athletes?.length ? (
        <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium w-8">#</th>
                <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">ชื่อ-สกุล</th>
                <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium w-36">เลขประจำตัว</th>
                <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium w-24">ชั้น</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {athletes.map((a, i) => (
                <tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{i + 1}</td>
                  <td className="px-3 py-2 text-white font-medium">{a.name}</td>
                  <td className="px-3 py-2 text-gray-400">{a.studentId || "—"}</td>
                  <td className="px-3 py-2 text-gray-400">{a.grade || "—"}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => {
                        if (removeAthlete.isPending && removeAthlete.variables === a.id) return;
                        removeAthlete.mutate(a.id, { onError: () => toast.error("ลบไม่สำเร็จ") });
                      }}
                      disabled={removeAthlete.isPending && removeAthlete.variables === a.id}
                      className="text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-3 text-center py-2">ยังไม่มีรายชื่อนักกีฬา</p>
      )}

      {/* Add form */}
      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="ชื่อ-สกุล *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-black/30 border-white/10 h-8 text-sm flex-1 min-w-[160px]"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Input
          placeholder="เลขประจำตัว"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          className="bg-black/30 border-white/10 h-8 text-sm w-36"
        />
        <Input
          placeholder="ชั้น เช่น ม.3/1"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
          className="bg-black/30 border-white/10 h-8 text-sm w-36"
        />
        <Button
          size="sm"
          className="h-8 gap-1 shrink-0"
          onClick={handleAdd}
          disabled={addAthlete.isPending}
        >
          <UserPlus className="h-3.5 w-3.5" />
          เพิ่ม
        </Button>
      </div>
    </div>
  );
}

// ── Schedule row (expandable) ─────────────────────────────────────────────────

function ScheduleRow({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: ScheduleMatch;
  index: number;
  onEdit: (item: ScheduleMatch) => void;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow className="border-b border-white/5 hover:bg-white/5">
        <TableCell className="text-muted-foreground font-mono text-xs w-10">{index + 1}</TableCell>
        <TableCell>
          <div className="font-medium text-white text-sm">{item.sport}</div>
          <div className="text-xs text-gray-500 mt-0.5">{item.gender} • {item.level}</div>
        </TableCell>
        <TableCell className="text-sm text-gray-400">
          {item.date && <div>{item.date}</div>}
          {item.time && <div className="text-xs">{item.time}</div>}
          {!item.date && !item.time && <span className="text-gray-600 text-xs">—</span>}
        </TableCell>
        <TableCell className="text-sm text-gray-400 max-w-[140px] truncate">
          {item.venue || <span className="text-gray-600 text-xs">—</span>}
        </TableCell>
        <TableCell>
          <Badge
            className={
              item.status === "กำลังแข่งขัน"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : item.status === "แข่งขันเสร็จสิ้น"
                ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }
          >
            {item.status}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-green-400/60 hover:text-green-400 hover:bg-green-400/10"
              onClick={() => setExpanded((v) => !v)}
              title="จัดการนักกีฬา"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
              onClick={() => onEdit(item)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="border-b border-white/5">
          <TableCell colSpan={6} className="p-0">
            <AthletesSection scheduleId={item.id} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

const emptyForm = {
  sport: "",
  gender: "ชาย",
  level: LEVELS[0],
  date: "",
  time: "",
  venue: "",
  notes: "",
  status: STATUSES[0],
  result: "",
  published: true,
  sortOrder: 0,
};

export default function AdminSchedules() {
  const qc = useQueryClient();
  const { data: schedules, isLoading } = useListSchedules({
    query: { queryKey: getListSchedulesQueryKey() },
  });

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const [genderTab, setGenderTab] = useState<"ชาย" | "หญิง">("ชาย");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListSchedulesQueryKey() });

  const filtered = (schedules ?? []).filter((s) => s.gender === genderTab);

  const openCreate = () => {
    setForm({ ...emptyForm, gender: genderTab, sortOrder: (schedules?.length ?? 0) * 10 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ScheduleMatch) => {
    setForm({
      sport: item.sport,
      gender: item.gender,
      level: item.level,
      date: item.date ?? "",
      time: item.time ?? "",
      venue: item.venue ?? "",
      notes: item.notes ?? "",
      status: item.status,
      result: item.result ?? "",
      published: item.published,
      sortOrder: item.sortOrder,
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.sport.trim()) { toast.error("กรุณากรอกชื่อรายการกีฬา"); return; }
    const payload = {
      sport: form.sport,
      gender: form.gender,
      level: form.level,
      date: form.date || null,
      time: form.time || null,
      venue: form.venue || null,
      notes: form.notes || null,
      status: form.status,
      result: form.result || null,
      published: form.published,
      sortOrder: Number(form.sortOrder),
    };
    if (editingId) {
      updateSchedule.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { invalidate(); toast.success("อัปเดตสำเร็จ"); setIsModalOpen(false); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    } else {
      createSchedule.mutate({ data: payload }, {
        onSuccess: () => { invalidate(); toast.success("เพิ่มรายการสำเร็จ"); setIsModalOpen(false); },
        onError: () => toast.error("เกิดข้อผิดพลาด"),
      });
    }
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    deleteSchedule.mutate({ id: confirmDeleteId }, {
      onSuccess: () => { invalidate(); toast.success("ลบสำเร็จ"); setConfirmDeleteId(null); },
      onError: () => toast.error("เกิดข้อผิดพลาด"),
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการตารางแข่งขัน</h1>
          <p className="text-muted-foreground">กดลูกศรลง ▼ ที่แต่ละรายการเพื่อจัดการรายชื่อนักกีฬา</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> เพิ่มรายการ
        </Button>
      </div>

      {/* Gender tabs */}
      <div className="flex gap-2 mb-6">
        {GENDERS.map((g) => (
          <button
            key={g}
            onClick={() => setGenderTab(g as "ชาย" | "หญิง")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              genderTab === g
                ? "bg-primary text-white border-primary shadow-[0_0_12px_rgba(0,150,255,0.3)]"
                : "text-gray-400 border-white/10 hover:border-primary/40"
            }`}
          >
            {g === "ชาย" ? "🧑 นักเรียนชาย" : "👩 นักเรียนหญิง"} ({(schedules ?? []).filter(s => s.gender === g).length})
          </button>
        ))}
      </div>

      <div className="glass border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white w-10">#</TableHead>
              <TableHead className="text-white">รายการกีฬา</TableHead>
              <TableHead className="text-white w-32">วันที่/เวลา</TableHead>
              <TableHead className="text-white w-40">สถานที่</TableHead>
              <TableHead className="text-white w-36">สถานะ</TableHead>
              <TableHead className="text-white text-right w-28">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </TableCell></TableRow>
            ) : !filtered.length ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                ยังไม่มีรายการแข่งขัน — กด "เพิ่มรายการ" เพื่อเริ่มต้น
              </TableCell></TableRow>
            ) : (
              filtered.map((item, i) => (
                <ScheduleRow
                  key={item.id}
                  item={item}
                  index={i}
                  onEdit={openEdit}
                  onDelete={setConfirmDeleteId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[680px] max-h-[90vh] overflow-y-auto text-white">
          <DialogHeader>
            <DialogTitle>{editingId ? "แก้ไขรายการแข่งขัน" : "เพิ่มรายการแข่งขันใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-2">
            <div className="grid gap-2">
              <Label>ชื่อรายการกีฬา <span className="text-red-500">*</span></Label>
              <Input value={form.sport} onChange={(e) => setForm({...form, sport: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น เทเบิลเทนนิส ประเภทเดี่ยว" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>เพศ</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({...form, gender: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>รุ่น</Label>
                <Select value={form.level} onValueChange={(v) => setForm({...form, level: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>วันที่ <span className="text-gray-500 text-xs">(ไม่บังคับ)</span></Label>
                <Input value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น 15 ส.ค. 2568" />
              </div>
              <div className="grid gap-2">
                <Label>เวลา <span className="text-gray-500 text-xs">(ไม่บังคับ)</span></Label>
                <Input value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น 09:00 น." />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>สถานที่แข่งขัน <span className="text-gray-500 text-xs">(ไม่บังคับ)</span></Label>
              <Input value={form.venue} onChange={(e) => setForm({...form, venue: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น โรงยิมโรงเรียน" />
            </div>
            <div className="grid gap-2">
              <Label>หมายเหตุ <span className="text-gray-500 text-xs">(ไม่บังคับ)</span></Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="bg-black/30 border-white/10 resize-none" placeholder="ข้อมูลเพิ่มเติม..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>สถานะ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}>
                  <SelectTrigger className="bg-black/30 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>ผลการแข่งขัน <span className="text-gray-500 text-xs">(ไม่บังคับ)</span></Label>
                <Input value={form.result} onChange={(e) => setForm({...form, result: e.target.value})} className="bg-black/30 border-white/10" placeholder="เช่น ชนะเลิศ" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch checked={form.published} onCheckedChange={(c) => setForm({...form, published: c})} />
              <Label className="cursor-pointer">เผยแพร่ทันที</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={createSchedule.isPending || updateSchedule.isPending}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
        <DialogContent className="glass border-white/10 sm:max-w-[400px] text-white">
          <DialogHeader><DialogTitle>ยืนยันการลบ</DialogTitle></DialogHeader>
          <p className="py-3 text-gray-300">ลบรายการนี้และรายชื่อนักกีฬาทั้งหมดในรายการ? ไม่สามารถเรียกคืนได้</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteSchedule.isPending}>ลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
