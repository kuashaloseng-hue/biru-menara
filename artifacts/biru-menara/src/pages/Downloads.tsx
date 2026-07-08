import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Download as DownloadIcon, FileText, Image as ImageIcon, Music, FileArchive, ArrowDownToLine } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import athletePdf from "@assets/นักกีฬา_ประจำสีฟ้า_1783520770825.pdf";
import heroImg from "@assets/1783520581768_1783520763412.jpg";
import teamSloganImg from "@assets/1783520586106_1783520776744.jpg";

const CATEGORIES = ["เพลงเชียร์", "ตารางแข่งขัน", "โลโก้", "โปสเตอร์", "รูปภาพ", "เอกสาร"];

const DOWNLOADS_DATA = [
  { id: 1, name: "เพลงมาร์ชสีฟ้า.mp3", category: "เพลงเชียร์", size: "4.2 MB", icon: Music, link: "#" },
  { id: 2, name: "เนื้อเพลงเชียร์.pdf", category: "เพลงเชียร์", size: "1.1 MB", icon: FileText, link: "#" },
  
  { id: 3, name: "รายชื่อนักกีฬา_ประจำสีฟ้า.pdf", category: "ตารางแข่งขัน", size: "2.5 MB", icon: FileText, link: athletePdf },
  { id: 4, name: "ตารางแข่งขันรวม.pdf", category: "ตารางแข่งขัน", size: "1.8 MB", icon: FileText, link: "#" },
  
  { id: 5, name: "โลโก้_BIRU_MENARA_PNG.png", category: "โลโก้", size: "5.0 MB", icon: ImageIcon, link: "#" },
  { id: 6, name: "โลโก้_BIRU_MENARA_Vector.ai", category: "โลโก้", size: "12.4 MB", icon: FileArchive, link: "#" },
  
  { id: 7, name: "โปสเตอร์หลัก.jpg", category: "โปสเตอร์", size: "8.2 MB", icon: ImageIcon, link: heroImg },
  { id: 8, name: "อินโฟกราฟิก_อุดมการณ์สีฟ้า.jpg", category: "โปสเตอร์", size: "6.5 MB", icon: ImageIcon, link: teamSloganImg },
  
  { id: 9, name: "รวมรูปภาพนักกีฬา.zip", category: "รูปภาพ", size: "145.0 MB", icon: FileArchive, link: "#" },
  { id: 10, name: "รวมรูปภาพกองเชียร์.zip", category: "รูปภาพ", size: "210.0 MB", icon: FileArchive, link: "#" },
  
  { id: 11, name: "กำหนดการกีฬาสี.pdf", category: "เอกสาร", size: "1.5 MB", icon: FileText, link: "#" },
  { id: 12, name: "กฎกติกาการแข่งขัน.pdf", category: "เอกสาร", size: "3.2 MB", icon: FileText, link: "#" },
];

export default function Downloads() {
  const [activeCategory, setActiveCategory] = useState("ตารางแข่งขัน");

  const filteredFiles = DOWNLOADS_DATA.filter(file => file.category === activeCategory);

  return (
    <Layout>
      <div className="bg-muted py-16 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <DownloadIcon className="h-16 w-16 mx-auto text-primary mb-6 drop-shadow-[0_0_15px_rgba(0,150,255,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">ศูนย์ดาวน์โหลด</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              รวบรวมไฟล์เอกสาร รูปภาพ โลโก้ และสื่อต่างๆ ของสีฟ้า สำหรับนักกีฬาและกองเชียร์
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Categories */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass rounded-xl p-4 sticky top-24">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">หมวดหมู่ไฟล์</h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">{activeCategory}</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, i) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a href={file.link} target={file.link !== "#" ? "_blank" : "_self"} rel="noreferrer" className="block h-full">
                    <div className="glass rounded-xl p-5 border border-white/10 hover:border-primary hover:bg-primary/5 transition-all group h-full flex items-center">
                      <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all shrink-0 mr-4">
                        <file.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </h4>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                      <div className="shrink-0 ml-4">
                        <Button size="icon" variant="ghost" className="rounded-full bg-white/5 group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground glass rounded-xl border-dashed">
                <FileArchive className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>ยังไม่มีไฟล์ในหมวดหมู่นี้</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
