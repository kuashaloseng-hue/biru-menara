import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState } from "react";

type Event = { sport: string; level: string };

const MALE_EVENTS: Event[] = [
  // เทเบิลเทนนิส
  { sport: "เทเบิลเทนนิส ประเภทเดี่ยว", level: "รุ่น ม.1-2" },
  { sport: "เทเบิลเทนนิส ประเภทเดี่ยว", level: "รุ่น ม.3-4" },
  { sport: "เทเบิลเทนนิส ประเภทเดี่ยว", level: "รุ่น ม.5-6" },
  { sport: "เทเบิลเทนนิส ประเภทคู่", level: "รุ่น ม.1-2" },
  { sport: "เทเบิลเทนนิส ประเภทคู่", level: "รุ่น ม.3-4" },
  { sport: "เทเบิลเทนนิส ประเภทคู่", level: "รุ่น ม.5-6" },
  // แบดมินตัน
  { sport: "แบดมินตัน ประเภทเดี่ยว", level: "รุ่น ม.1-2" },
  { sport: "แบดมินตัน ประเภทเดี่ยว", level: "รุ่น ม.3-4" },
  { sport: "แบดมินตัน ประเภทเดี่ยว", level: "รุ่น ม.5-6" },
  { sport: "แบดมินตัน ประเภทคู่", level: "รุ่น ม.1-2" },
  { sport: "แบดมินตัน ประเภทคู่", level: "รุ่น ม.3-4" },
  { sport: "แบดมินตัน ประเภทคู่", level: "รุ่น ม.5-6" },
  // เปตอง
  { sport: "เปตอง ประเภทเดี่ยว", level: "รุ่น ม.1-2" },
  { sport: "เปตอง ประเภทเดี่ยว", level: "รุ่น ม.3-4" },
  { sport: "เปตอง ประเภทเดี่ยว", level: "รุ่น ม.5-6" },
  { sport: "เปตอง ประเภทคู่", level: "รุ่น ม.1-2" },
  { sport: "เปตอง ประเภทคู่", level: "รุ่น ม.3-4" },
  { sport: "เปตอง ประเภทคู่", level: "รุ่น ม.5-6" },
  { sport: "เปตอง ประเภททีม", level: "รุ่น ม.1-2" },
  { sport: "เปตอง ประเภททีม", level: "รุ่น ม.3-4" },
  { sport: "เปตอง ประเภททีม", level: "รุ่น ม.5-6" },
  // ทีม
  { sport: "ฟุตซอล", level: "รุ่น ม.1-2" },
  { sport: "ฟุตซอล", level: "รุ่น ม.3-4" },
  { sport: "ฟุตซอล", level: "รุ่น ม.5-6" },
  { sport: "วอลเลย์บอล", level: "รุ่น ม.1-2" },
  { sport: "วอลเลย์บอล", level: "รุ่น ม.3-4" },
  { sport: "วอลเลย์บอล", level: "รุ่น ม.5-6" },
  { sport: "บาสเกตบอล", level: "รุ่น ม.3-4" },
  { sport: "บาสเกตบอล", level: "รุ่น ม.5-6" },
  { sport: "แชร์บอล", level: "รุ่น ม.1-2" },
  { sport: "ตะกร้อ", level: "รุ่น ม.5-6" },
  // E-sport
  { sport: "E-sport", level: "รุ่น ม.1-2" },
  { sport: "E-sport", level: "รุ่น ม.3-4" },
  { sport: "E-sport", level: "รุ่น ม.5-6" },
];

const FEMALE_EVENTS: Event[] = [
  // เทเบิลเทนนิส
  { sport: "เทเบิลเทนนิส ประเภทเดี่ยว", level: "รุ่น ม.1-2" },
  { sport: "เทเบิลเทนนิส ประเภทเดี่ยว", level: "รุ่น ม.3-4" },
  { sport: "เทเบิลเทนนิส ประเภทเดี่ยว", level: "รุ่น ม.5-6" },
  { sport: "เทเบิลเทนนิส ประเภทคู่", level: "รุ่น ม.1-2" },
  { sport: "เทเบิลเทนนิส ประเภทคู่", level: "รุ่น ม.3-4" },
  { sport: "เทเบิลเทนนิส ประเภทคู่", level: "รุ่น ม.5-6" },
  // แบดมินตัน
  { sport: "แบดมินตัน ประเภทเดี่ยว", level: "รุ่น ม.1-2" },
  { sport: "แบดมินตัน ประเภทเดี่ยว", level: "รุ่น ม.3-4" },
  { sport: "แบดมินตัน ประเภทเดี่ยว", level: "รุ่น ม.5-6" },
  { sport: "แบดมินตัน ประเภทคู่", level: "รุ่น ม.1-2" },
  { sport: "แบดมินตัน ประเภทคู่", level: "รุ่น ม.3-4" },
  { sport: "แบดมินตัน ประเภทคู่", level: "รุ่น ม.5-6" },
  // เปตอง
  { sport: "เปตอง ประเภทเดี่ยว", level: "รุ่น ม.1-2" },
  { sport: "เปตอง ประเภทเดี่ยว", level: "รุ่น ม.3-4" },
  { sport: "เปตอง ประเภทเดี่ยว", level: "รุ่น ม.5-6" },
  { sport: "เปตอง ประเภทคู่", level: "รุ่น ม.1-2" },
  { sport: "เปตอง ประเภทคู่", level: "รุ่น ม.3-4" },
  { sport: "เปตอง ประเภทคู่", level: "รุ่น ม.5-6" },
  { sport: "เปตอง ประเภททีม", level: "รุ่น ม.1-2" },
  { sport: "เปตอง ประเภททีม", level: "รุ่น ม.3-4" },
  { sport: "เปตอง ประเภททีม", level: "รุ่น ม.5-6" },
  // ทีม
  { sport: "วอลเลย์บอล", level: "รุ่น ม.1-2" },
  { sport: "วอลเลย์บอล", level: "รุ่น ม.3-4" },
  { sport: "วอลเลย์บอล", level: "รุ่น ม.5-6" },
  { sport: "บาสเกตบอล", level: "รุ่น ม.3-4" },
  { sport: "บาสเกตบอล", level: "รุ่น ม.5-6" },
  { sport: "แชร์บอล", level: "รุ่น ม.1-2" },
  { sport: "แชร์บอล", level: "รุ่น ม.3-4" },
  { sport: "แชร์บอล", level: "รุ่น ม.5-6" },
  // E-sport
  { sport: "E-sport", level: "รุ่น ม.1-2" },
  { sport: "E-sport", level: "รุ่น ม.3-4" },
  { sport: "E-sport", level: "รุ่น ม.5-6" },
];

// Assign a color stripe per sport category
const SPORT_COLORS: Record<string, string> = {
  "เทเบิลเทนนิส": "border-l-cyan-400 bg-cyan-500/5",
  "แบดมินตัน":    "border-l-emerald-400 bg-emerald-500/5",
  "เปตอง":        "border-l-amber-400 bg-amber-500/5",
  "ฟุตซอล":       "border-l-orange-400 bg-orange-500/5",
  "วอลเลย์บอล":   "border-l-purple-400 bg-purple-500/5",
  "บาสเกตบอล":    "border-l-pink-400 bg-pink-500/5",
  "แชร์บอล":      "border-l-rose-400 bg-rose-500/5",
  "ตะกร้อ":       "border-l-lime-400 bg-lime-500/5",
  "E-sport":      "border-l-blue-400 bg-blue-500/5",
};

function getCategory(sport: string): string {
  for (const key of Object.keys(SPORT_COLORS)) {
    if (sport.startsWith(key)) return key;
  }
  return sport;
}

function getLevelBadge(level: string) {
  const colors: Record<string, string> = {
    "รุ่น ม.1-2": "bg-sky-500/20 text-sky-300 border-sky-500/30",
    "รุ่น ม.3-4": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "รุ่น ม.5-6": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return colors[level] ?? "bg-white/10 text-white border-white/20";
}

export default function Schedule() {
  const [tab, setTab] = useState<"male" | "female">("male");
  const events = tab === "male" ? MALE_EVENTS : FEMALE_EVENTS;

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
        <div className="flex justify-center mb-10">
          <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-1 gap-1">
            <button
              onClick={() => setTab("male")}
              className={`px-10 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                tab === "male"
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(0,150,255,0.4)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🧑 นักเรียนชาย
            </button>
            <button
              onClick={() => setTab("female")}
              className={`px-10 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                tab === "female"
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(0,150,255,0.4)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              👩 นักเรียนหญิง
            </button>
          </div>
        </div>

        {/* Count badge */}
        <div className="flex justify-end mb-4">
          <span className="text-sm text-muted-foreground">
            ทั้งหมด <span className="text-primary font-bold">{events.length}</span> รายการ
          </span>
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-2xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="grid grid-cols-[3rem_1fr_9rem] bg-white/10 border-b border-white/10 px-4 py-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ที่</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">รายการกีฬา</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">รุ่น</span>
            </div>

            {/* Rows */}
            {events.map((ev, i) => {
              const cat = getCategory(ev.sport);
              const colorClass = SPORT_COLORS[cat] ?? "border-l-white/20 bg-white/2";
              return (
                <div
                  key={i}
                  className={`grid grid-cols-[3rem_1fr_9rem] items-center px-4 py-3.5 border-b border-white/5 last:border-0 border-l-4 ${colorClass} hover:bg-white/5 transition-colors`}
                >
                  <span className="text-muted-foreground text-sm font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-white font-medium text-sm sm:text-base">{ev.sport}</span>
                  <div className="flex justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelBadge(ev.level)}`}>
                      {ev.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="mt-10 glass rounded-xl p-5 border border-white/10">
          <p className="text-sm font-bold text-white mb-3">หมายเหตุ</p>
          <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>การแข่งขันประเภทเดี่ยว สามารถเปลี่ยนตัวนักกีฬาจากการแข่งขันรอบที่ 1 เท่านั้น</li>
            <li>หากนักกีฬาแข่งขันรอบที่ 1 หรือรอบอื่นๆ มีอาการบาดเจ็บในภายหลัง สมควรให้ไม่สามารถแข่งขันได้โดยรวม กรณีนี้จะไม่สามารถเปลี่ยนตัวนักกีฬาได้</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
