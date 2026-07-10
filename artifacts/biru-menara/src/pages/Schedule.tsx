import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronDown, ChevronUp, User, Loader2, Clock, MapPin, StickyNote } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useListSchedules, getListSchedulesQueryKey } from "@workspace/api-client-react";
import {
  useListScheduleAthletes,
  getListScheduleAthletesQueryKey,
} from "@workspace/api-client-react";
import type { ScheduleMatch } from "@workspace/api-client-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const SPORT_COLORS: Record<string, string> = {
  "เทเบิลเทนนิส": "border-l-cyan-400",
  "แบดมินตัน":    "border-l-emerald-400",
  "เปตอง":        "border-l-amber-400",
  "ฟุตซอล":       "border-l-orange-400",
  "วอลเลย์บอล":   "border-l-purple-400",
  "บาสเกตบอล":    "border-l-pink-400",
  "แชร์บอล":      "border-l-rose-400",
  "ตะกร้อ":       "border-l-lime-400",
  "E-sport":      "border-l-blue-400",
};

function borderColor(sport: string) {
  for (const [k, v] of Object.entries(SPORT_COLORS)) {
    if (sport.startsWith(k)) return v;
  }
  return "border-l-white/20";
}

function levelBadge(level: string) {
  const map: Record<string, string> = {
    "รุ่น ม.1-2": "bg-sky-500/20 text-sky-300 border-sky-500/30",
    "รุ่น ม.3-4": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "รุ่น ม.5-6": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return map[level] ?? "bg-white/10 text-white border-white/20";
}

// ── Athlete sub-section ───────────────────────────────────────────────────────

function AthleteList({ scheduleId }: { scheduleId: number }) {
  const { data: athletes, isLoading } = useListScheduleAthletes(scheduleId, {
    query: { queryKey: getListScheduleAthletesQueryKey(scheduleId) },
  });

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!athletes?.length) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        ยังไม่มีรายชื่อนักกีฬา
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="pb-2 pr-4 text-xs text-muted-foreground font-medium w-8">ที่</th>
            <th className="pb-2 pr-4 text-xs text-muted-foreground font-medium">ชื่อ-สกุล</th>
            <th className="pb-2 pr-4 text-xs text-muted-foreground font-medium w-32">เลขประจำตัว</th>
            <th className="pb-2 text-xs text-muted-foreground font-medium w-24">ชั้น</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((a, i) => (
            <tr key={a.id} className="border-b border-white/5 last:border-0">
              <td className="py-2 pr-4 text-muted-foreground font-mono">{i + 1}</td>
              <td className="py-2 pr-4 text-white font-medium">{a.name}</td>
              <td className="py-2 pr-4 text-gray-400">{a.studentId || "—"}</td>
              <td className="py-2 text-gray-400">{a.grade || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Event row ─────────────────────────────────────────────────────────────────

function EventRow({ event, index }: { event: ScheduleMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = borderColor(event.sport);

  return (
    <>
      <div
        className={`border-l-4 ${color} px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer`}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm font-mono w-6 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white font-medium text-sm sm:text-base">{event.sport}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${levelBadge(event.level)}`}>
                {event.level}
              </span>
            </div>
            {/* Date/Time/Venue row — show only if at least one exists */}
            {(event.date || event.time || event.venue) && (
              <div className="flex flex-wrap gap-3 mt-1.5">
                {(event.date || event.time) && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {[event.date, event.time].filter(Boolean).join(" · ")}
                  </span>
                )}
                {event.venue && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {event.venue}
                  </span>
                )}
                {event.notes && (
                  <span className="flex items-center gap-1 text-xs text-amber-400/80">
                    <StickyNote className="h-3 w-3" />
                    {event.notes}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="athletes"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`border-l-4 ${color} border-b border-white/5 bg-white/3 px-6 py-4`}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> รายชื่อนักกีฬา
              </p>
              <AthleteList scheduleId={event.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Schedule() {
  const [tab, setTab] = useState<"ชาย" | "หญิง">("ชาย");
  const [levelFilter, setLevelFilter] = useState("ทั้งหมด");

  const { data: allSchedules, isLoading } = useListSchedules({
    query: { queryKey: getListSchedulesQueryKey() },
  });

  const published = (allSchedules ?? []).filter((s) => s.published);
  const byGender = published.filter((s) => s.gender === tab);
  const levels = ["ทั้งหมด", "รุ่น ม.1-2", "รุ่น ม.3-4", "รุ่น ม.5-6"];
  const filtered =
    levelFilter === "ทั้งหมด" ? byGender : byGender.filter((s) => s.level === levelFilter);

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-muted py-16 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Trophy className="h-16 w-16 mx-auto text-accent mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">รายการแข่งขัน</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ประกาศรายการแข่งขันกีฬา โครงการอัดตัวเกมส์ กีฬานักเรียน BIRU MENARA
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gender tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-1 gap-1">
            {(["ชาย", "หญิง"] as const).map((g) => (
              <button
                key={g}
                onClick={() => { setTab(g); setLevelFilter("ทั้งหมด"); }}
                className={`px-10 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                  tab === g
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(0,150,255,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {g === "ชาย" ? "🧑 นักเรียนชาย" : "👩 นักเรียนหญิง"}
              </button>
            ))}
          </div>
        </div>

        {/* Level filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                levelFilter === l
                  ? "bg-white/15 text-white border border-white/30"
                  : "text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="flex justify-end mb-3">
          <span className="text-sm text-muted-foreground">
            ทั้งหมด <span className="text-primary font-bold">{filtered.length}</span> รายการ
            <span className="ml-2 text-xs text-gray-500">(กดแต่ละรายการเพื่อดูรายชื่อนักกีฬา)</span>
          </span>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl border border-white/10 py-20 text-center">
            <Trophy className="h-14 w-14 mx-auto text-muted-foreground mb-4 opacity-40" />
            <p className="text-gray-400">ยังไม่มีรายการแข่งขันในหมวดหมู่นี้</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + levelFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl overflow-hidden border border-white/10"
            >
              {/* Header */}
              <div className="grid grid-cols-[2rem_1fr] px-4 py-3 bg-white/10 border-b border-white/10">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ที่</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">รายการกีฬา</span>
              </div>
              {filtered.map((ev, i) => (
                <EventRow key={ev.id} event={ev} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
}
