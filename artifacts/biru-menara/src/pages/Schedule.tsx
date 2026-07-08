import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const SCHEDULE_DATA = [
  {
    id: 1,
    sport: "วอลเลย์บอล",
    gender: "หญิง",
    level: "ม.1-ม.3",
    venue: "สนามกีฬาโรงเรียน",
    date: "15 ม.ค. 2026",
    time: "09:00",
    status: "รอแข่งขัน",
  },
  {
    id: 2,
    sport: "ฟุตบอล",
    gender: "ชาย",
    level: "ม.4-ม.6",
    venue: "สนามหญ้าโรงเรียน",
    date: "15 ม.ค. 2026",
    time: "14:00",
    status: "กำลังแข่งขัน",
  },
  {
    id: 3,
    sport: "บาสเกตบอล",
    gender: "ชาย",
    level: "ม.1-ม.3",
    venue: "อาคารอเนกประสงค์",
    date: "16 ม.ค. 2026",
    time: "09:00",
    status: "แข่งขันเสร็จสิ้น",
    result: "ชนะ 45-38",
  },
  {
    id: 4,
    sport: "แบดมินตัน",
    gender: "รวม",
    level: "ม.4-ม.6",
    venue: "โรงยิมเนเซียม",
    date: "16 ม.ค. 2026",
    time: "13:00",
    status: "รอแข่งขัน",
  },
  {
    id: 5,
    sport: "เทเบิลเทนนิส",
    gender: "รวม",
    level: "ม.1-ม.6",
    venue: "โรงยิมเนเซียม",
    date: "17 ม.ค. 2026",
    time: "09:00",
    status: "รอแข่งขัน",
  },
  {
    id: 6,
    sport: "เซปักตะกร้อ",
    gender: "ชาย",
    level: "ม.4-ม.6",
    venue: "สนามกลางแจ้ง",
    date: "17 ม.ค. 2026",
    time: "14:00",
    status: "รอแข่งขัน",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "รอแข่งขัน": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
    case "กำลังแข่งขัน": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]";
    case "แข่งขันเสร็จสิ้น": return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    default: return "bg-white/10 text-white";
  }
};

export default function Schedule() {
  const [filterDate, setFilterDate] = useState("ทั้งหมด");
  const dates = ["ทั้งหมด", ...Array.from(new Set(SCHEDULE_DATA.map(item => item.date)))];

  const filteredData = filterDate === "ทั้งหมด" 
    ? SCHEDULE_DATA 
    : SCHEDULE_DATA.filter(item => item.date === filterDate);

  return (
    <Layout>
      <div className="bg-muted py-16 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CalendarDays className="h-16 w-16 mx-auto text-accent mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">ตารางการแข่งขัน</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              รวมตารางการแข่งขันกีฬาทุกประเภทของสีฟ้า ตรวจสอบเวลา สถานที่ และมาร่วมเชียร์นักกีฬาของเรา
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setFilterDate(date)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                filterDate === date
                  ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(0,150,255,0.4)]"
                  : "bg-transparent text-gray-400 border-white/10 hover:border-primary/50 hover:text-white"
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {filteredData.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 md:p-6 border border-white/10 hover:border-primary/40 transition-colors group relative overflow-hidden"
            >
              {match.status === "กำลังแข่งขัน" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              )}
              {match.status === "รอแข่งขัน" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
              )}
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2 md:pl-4">
                
                {/* Time & Date */}
                <div className="flex items-center md:flex-col md:items-start md:w-32 shrink-0">
                  <div className="flex items-center text-primary font-black text-2xl md:text-3xl tracking-tight">
                    <Clock className="h-6 w-6 mr-2 md:hidden" />
                    {match.time}
                  </div>
                  <div className="text-gray-400 text-sm ml-4 md:ml-0 md:mt-1">{match.date}</div>
                </div>

                {/* Match Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">
                      {match.sport}
                    </h3>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                      {match.gender} • {match.level}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    {match.venue}
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between shrink-0 gap-3">
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(match.status)}`}>
                    {match.status}
                  </div>
                  {match.result && (
                    <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                      <Trophy className="h-4 w-4 mr-2" />
                      {match.result}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
