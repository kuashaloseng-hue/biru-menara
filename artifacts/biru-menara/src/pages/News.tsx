import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper, Loader2 } from "lucide-react";
import { useState } from "react";
import { useListNews, getListNewsQueryKey } from "@workspace/api-client-react";
import cheerleadersImg from "@assets/generated_images/cheerleaders.jpg";

export default function News() {
  const { data: allNews, isLoading } = useListNews({ query: { queryKey: getListNewsQueryKey() } });
  const published = allNews?.filter((n) => n.published) ?? [];

  const categories = ["ทั้งหมด", ...Array.from(new Set(published.map((n) => n.category).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

  const filtered = activeCategory === "ทั้งหมด"
    ? published
    : published.filter((n) => n.category === activeCategory);

  return (
    <Layout>
      <div className="bg-muted py-16 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Newspaper className="h-16 w-16 mx-auto text-primary mb-6 drop-shadow-[0_0_15px_rgba(0,150,255,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">ข่าวสารและประกาศ</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ติดตามทุกความเคลื่อนไหว การแข่งขัน และกิจกรรมต่างๆ ของชาวสีฟ้า BIRU MENARA
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {categories.map((cat) => (
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

            {filtered.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((news, i) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Card className="overflow-hidden bg-card border-white/10 hover:border-primary/50 transition-colors group cursor-pointer h-full flex flex-col">
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={news.imageUrl || cheerleadersImg}
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant={news.category === "ข่าวด่วน" ? "destructive" : "default"}
                            className="border-none shadow-lg px-3 py-1 text-sm font-bold"
                          >
                            {news.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <p className="text-xs text-muted-foreground mb-3 font-medium">{news.date}</p>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors leading-tight">
                          {news.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">{news.excerpt}</p>
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
                <p className="text-muted-foreground">ลองเลือกหมวดหมู่ใหม่ หรือกลับมาตรวจสอบอีกครั้ง</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
