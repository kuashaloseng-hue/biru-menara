import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import { useState } from "react";

// Images
import heroImg from "@assets/1783520581768_1783520763412.jpg";
import cheerleadersImg from "@assets/generated_images/cheerleaders.jpg";
import athletesImg from "@assets/generated_images/athletes.jpg";
import celebrationImg from "@assets/generated_images/celebration.jpg";
import teamSloganImg from "@assets/1783520586106_1783520776744.jpg";

const CATEGORIES = ["ทั้งหมด", "ข่าวประชาสัมพันธ์", "ข่าวการแข่งขัน", "ข่าวกิจกรรม", "ข่าวด่วน"];

const NEWS_DATA = [
  {
    id: 1,
    title: "พิธีเปิดกีฬาสีประจำปี 2026",
    excerpt: "บรรยากาศพิธีเปิดอย่างยิ่งใหญ่ สีฟ้ามาพร้อมกับขบวนพาเหรดตระการตาที่บอกเล่าเรื่องราวของสายน้ำ",
    date: "14 ม.ค. 2026",
    category: "ข่าวกิจกรรม",
    image: celebrationImg,
  },
  {
    id: 2,
    title: "สีฟ้าคว้าแชมป์วอลเลย์บอลหญิง",
    excerpt: "ทีมวอลเลย์บอลหญิงรุ่น ม.ปลาย โชว์ฟอร์มโหด เอาชนะคู่แข่ง 3-0 เซ็ต คว้าเหรียญทองแรกให้สีฟ้า",
    date: "15 ม.ค. 2026",
    category: "ข่าวการแข่งขัน",
    image: athletesImg,
  },
  {
    id: 3,
    title: "รวมภาพความประทับใจกองเชียร์",
    excerpt: "พลังเสียงและสปิริตของกองเชียร์สีฟ้าที่ไม่เคยแผ่วตลอดทั้งวัน ร่วมชมภาพบรรยากาศสุดมันส์",
    date: "16 ม.ค. 2026",
    category: "ข่าวประชาสัมพันธ์",
    image: cheerleadersImg,
  },
  {
    id: 4,
    title: "เปลี่ยนแปลงกำหนดการแข่งฟุตบอลนัดชิง",
    excerpt: "เนื่องจากสภาพอากาศ จึงขอเลื่อนการแข่งขันฟุตบอลชายรอบชิงชนะเลิศเป็นเวลา 15:00 น.",
    date: "17 ม.ค. 2026",
    category: "ข่าวด่วน",
    image: heroImg,
  },
  {
    id: 5,
    title: "กิจกรรมมอบรางวัลนักกีฬาดีเด่น",
    excerpt: "ขอเชิญชาวสีฟ้าร่วมแสดงความยินดีกับนักกีฬาที่ทำผลงานยอดเยี่ยม ในวันที่ 18 ม.ค. นี้ ณ หอประชุม",
    date: "17 ม.ค. 2026",
    category: "ข่าวประชาสัมพันธ์",
    image: teamSloganImg,
  },
  {
    id: 6,
    title: "สรุปเหรียญรางวัลประจำวัน",
    excerpt: "สีฟ้ายังคงนำเป็นอันดับ 1 ในตารางรวมเหรียญรางวัล ด้วยผลงาน 15 ทอง 10 เงิน 5 ทองแดง",
    date: "17 ม.ค. 2026",
    category: "ข่าวการแข่งขัน",
    image: athletesImg,
  },
];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

  const filteredNews = activeCategory === "ทั้งหมด" 
    ? NEWS_DATA 
    : NEWS_DATA.filter(news => news.category === activeCategory);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-muted py-16 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pattern-grid-lg opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Newspaper className="h-16 w-16 mx-auto text-primary mb-6 drop-shadow-[0_0_15px_rgba(0,150,255,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">ข่าวสารและประกาศ</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ติดตามทุกความเคลื่อนไหว การแข่งขัน และกิจกรรมต่างๆ ของชาวสีฟ้า BIRU MENARA
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(0,150,255,0.4)]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((news, i) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="overflow-hidden bg-card border-white/10 hover:border-primary/50 transition-colors group cursor-pointer h-full flex flex-col">
                  <div className="h-56 overflow-hidden relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4">
                      <Badge variant={news.category === "ข่าวด่วน" ? "destructive" : "default"} className="border-none shadow-lg px-3 py-1 text-sm font-bold">
                        {news.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">{news.date}</p>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                      {news.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                        อ่านเพิ่มเติม <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-2xl">
            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">ไม่พบข่าวสารในหมวดหมู่นี้</h3>
            <p className="text-muted-foreground">ลองเลือกหมวดหมู่ใหม่ หรือกลับมาตรวจสอบอีกครั้งในภายหลัง</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
