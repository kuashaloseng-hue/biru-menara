import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, CalendarDays, Download, Users, ChevronRight, Bell, ArrowRight, ImageIcon } from "lucide-react";
import { useEffect } from "react";
import {
  useListAnnouncements, getListAnnouncementsQueryKey,
  useGetSettings, getGetSettingsQueryKey,
  useListGallery, getListGalleryQueryKey,
  useListNews, getListNewsQueryKey,
} from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

// Only non-AI brand images kept as fallback for the hero background
import heroImg from "@assets/1783520581768_1783520763412.jpg";

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const { data: announcements } = useListAnnouncements({ query: { queryKey: getListAnnouncementsQueryKey() } });
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const { data: galleryData } = useListGallery({ query: { queryKey: getListGalleryQueryKey() } });
  const { data: newsData } = useListNews({ query: { queryKey: getListNewsQueryKey() } });

  const displayedAnnouncements = announcements?.filter((a) => a.published).slice(0, 4) ?? [];
  const heroBg = settings?.heroImageUrl || heroImg;
  const galleryImages = galleryData?.filter((g) => g.published) ?? [];
  const latestNews = newsData?.filter((n) => n.published).slice(0, 3) ?? [];

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="BIRU MENARA Banner"
            className="w-full h-full object-cover opacity-40 scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full glass border-primary/30 text-primary font-medium text-sm mb-4">
              ✨ อัตตัรกียะห์อิสลามียะห์ สปอร์ตเดย์ 2026
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">
              {settings?.heroTitle ? (
                <span>{settings.heroTitle}</span>
              ) : (
                <>BIRU <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">MENARA</span></>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-2xl leading-relaxed">
              {settings?.heroSlogan || (
                <>กีฬาสร้างคน สายน้ำสร้างวิถีชีวิต บรรพบุรุษสร้างแนวคิด <span className="text-white font-bold">สีฟ้าพิชิต เชิดชูเมืองนรา</span></>
              )}
            </p>
            <p className="text-lg text-primary/80 max-w-xl">
              "{settings?.heroSubSlogan || "หนึ่งใจ หนึ่งพลัง สายน้ำเดียวกัน เพื่อศักดิ์ศรีฟ้าแห่งนรา"}"
            </p>
            <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/schedule">
                <Button size="xl" className="group">
                  ตารางแข่งขัน <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/team">
                <Button size="xl" variant="glass">ทำความรู้จักทีมเรา</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Menu */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "ข่าวสาร", icon: Newspaper, href: "/news", color: "from-blue-500/20 to-blue-600/20", borderColor: "border-blue-500/30" },
            { title: "ตารางแข่งขัน", icon: CalendarDays, href: "/schedule", color: "from-cyan-500/20 to-cyan-600/20", borderColor: "border-cyan-500/30" },
            { title: "ดาวน์โหลด", icon: Download, href: "/downloads", color: "from-sky-500/20 to-sky-600/20", borderColor: "border-sky-500/30" },
            { title: "คณะทำงาน", icon: Users, href: "/team", color: "from-indigo-500/20 to-indigo-600/20", borderColor: "border-indigo-500/30" },
          ].map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link href={item.href}>
                <div className={cn(
                  "group h-32 rounded-2xl border backdrop-blur-xl bg-gradient-to-br flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer",
                  item.color, item.borderColor, "hover:shadow-[0_0_30px_rgba(0,150,255,0.2)]"
                )}>
                  <item.icon className="h-8 w-8 text-white group-hover:text-accent transition-colors drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(0,150,255,0.8)]" />
                  <span className="font-semibold text-lg text-white group-hover:text-white/90">{item.title}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Announcements — live from API */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-white">ประกาศสำคัญ</h2>
        </div>
        {displayedAnnouncements.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            ยังไม่มีประกาศ — เพิ่มได้ใน Admin &gt; ประกาศ
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayedAnnouncements.map((ann, i) => (
              <motion.div key={ann.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className={cn("glass transition-all hover:bg-white/5 overflow-hidden", ann.urgent ? "border-destructive/40 shadow-[0_0_15px_rgba(255,0,0,0.1)]" : "")}>
                  {ann.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={cn("font-bold text-lg", ann.urgent ? "text-destructive-foreground" : "text-white")}>{ann.title}</h3>
                      {ann.urgent && <Badge variant="destructive" className="animate-pulse">ด่วน</Badge>}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{ann.content}</p>
                    <p className="text-xs text-primary/60">{ann.date}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery Slider — only shown when DB has images */}
      {galleryImages.length > 0 && (
        <section className="py-12 bg-black/40 border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">ภาพบรรยากาศ</h2>
            <p className="text-muted-foreground">ภาพแห่งความประทับใจของชาวสีฟ้า</p>
          </div>
          <div className="max-w-6xl mx-auto px-4">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {galleryImages.map((img, i) => (
                  <div className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[600px] mx-2 rounded-2xl overflow-hidden" key={img.id ?? i}>
                    <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                      {img.caption && <h3 className="text-2xl font-bold text-white drop-shadow-lg">{img.caption}</h3>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest News — live from API */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">ข่าวล่าสุด</h2>
            <p className="text-muted-foreground">อัปเดตความเคลื่อนไหวล่าสุดของทีม</p>
          </div>
          <Link href="/news">
            <Button variant="ghost" className="hidden sm:flex group">
              ดูข่าวทั้งหมด <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {latestNews.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            ยังไม่มีข่าวสาร — เพิ่มได้ใน Admin &gt; ข่าวสาร
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((news, i) => (
              <motion.div key={news.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden bg-card border-white/10 hover:border-primary/50 transition-colors group cursor-pointer h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative bg-gradient-to-br from-primary/20 to-accent/10">
                    {news.imageUrl ? (
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-primary text-white border-none shadow-lg">{news.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground mb-2">{news.date}</p>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{news.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1">{news.excerpt}</p>
                    <Link href="/news">
                      <span className="text-accent text-sm font-medium hover:underline inline-flex items-center">
                        อ่านเพิ่มเติม <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/news"><Button variant="outline" className="w-full">ดูข่าวทั้งหมด</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
