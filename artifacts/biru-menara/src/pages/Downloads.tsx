import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Download as DownloadIcon, FileText, Image as ImageIcon, Music, FileArchive, ArrowDownToLine, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListDownloads, getListDownloadsQueryKey } from "@workspace/api-client-react";

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["mp3", "wav", "ogg"].includes(ext)) return Music;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return ImageIcon;
  if (["zip", "rar", "7z", "tar"].includes(ext)) return FileArchive;
  return FileText;
}

export default function Downloads() {
  const { data: allFiles, isLoading } = useListDownloads({ query: { queryKey: getListDownloadsQueryKey() } });
  const published = allFiles?.filter((f) => f.published) ?? [];

  const categories = Array.from(new Set(published.map((f) => f.category).filter(Boolean)));
  const [activeCategory, setActiveCategory] = useState<string>("");

  const currentCat = activeCategory || categories[0] || "";
  const filtered = published.filter((f) => f.category === currentCat);

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
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : published.length === 0 ? (
          <div className="flex-1 text-center py-24 glass rounded-2xl">
            <FileArchive className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">ยังไม่มีไฟล์ดาวน์โหลด</h3>
            <p className="text-muted-foreground">ผู้ดูแลระบบกำลังเพิ่มไฟล์</p>
          </div>
        ) : (
          <>
            <div className="w-full md:w-64 shrink-0">
              <div className="glass rounded-xl p-4 sticky top-24">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">หมวดหมู่ไฟล์</h3>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        currentCat === cat
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

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">{currentCat}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.length > 0 ? (
                  filtered.map((file, i) => {
                    const Icon = fileIcon(file.name);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <a href={file.fileUrl} target="_blank" rel="noreferrer" className="block h-full">
                          <div className="glass rounded-xl p-5 border border-white/10 hover:border-primary hover:bg-primary/5 transition-all group h-full flex items-center">
                            <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all shrink-0 mr-4">
                              <Icon className="h-6 w-6" />
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
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground glass rounded-xl border-dashed">
                    <FileArchive className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>ยังไม่มีไฟล์ในหมวดหมู่นี้</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
