import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Newspaper, Loader2, AlertTriangle } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { useGetNewsPost, getGetNewsPostQueryKey } from "@workspace/api-client-react";
import { ImageIcon } from "lucide-react";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const numericId = Number(id);

  const { data: news, isLoading, error } = useGetNewsPost(numericId, {
    query: { queryKey: getGetNewsPostQueryKey(numericId), enabled: !isNaN(numericId) },
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-white"
            onClick={() => setLocation("/news")}
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าข่าวสาร
          </Button>
        </motion.div>

        {isLoading && (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <AlertTriangle className="h-14 w-14 text-red-400" />
            <p className="text-gray-400 text-lg">ไม่พบข่าวสารที่ต้องการ</p>
            <Button onClick={() => setLocation("/news")}>กลับหน้าข่าวสาร</Button>
          </div>
        )}

        {news && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header image */}
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-primary/20 to-accent/10 relative">
              {news.imageUrl ? (
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Newspaper className="w-24 h-24 text-primary/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
                {news.category}
              </Badge>
              <span className="text-muted-foreground text-sm">{news.date}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Excerpt */}
            {news.excerpt && (
              <p className="text-lg text-gray-300 mb-8 border-l-4 border-primary/60 pl-4 italic leading-relaxed">
                {news.excerpt}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-white/10 mb-8" />

            {/* Full content */}
            <div className="prose prose-invert max-w-none">
              {news.content.split("\n").map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i} className="text-gray-300 leading-relaxed mb-4 text-base">
                    {paragraph}
                  </p>
                ) : (
                  <br key={i} />
                )
              )}
            </div>

            {/* Footer back button */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setLocation("/news")}
              >
                <ArrowLeft className="h-4 w-4" />
                กลับไปหน้าข่าวสาร
              </Button>
            </div>
          </motion.article>
        )}
      </div>
    </Layout>
  );
}
