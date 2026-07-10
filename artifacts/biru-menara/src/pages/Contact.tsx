import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";

export default function Contact() {
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });

  const instagramUrl = settings?.instagram || "https://instagram.com/biru_menara";
  const facebookUrl = settings?.facebook || "https://facebook.com";
  const address = settings?.address || "โรงเรียนอัตตัรกียะห์อิสลามียะห์ จ.นราธิวาส 96000";
  const phone = settings?.phone || null;

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full z-0 pointer-events-none"></div>

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-black text-white mb-4">ติดต่อพวกเรา</h1>
              <p className="text-xl text-muted-foreground">ช่องทางการติดต่อและติดตามข่าวสารของสีฟ้า</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-3xl border border-white/10 hover:border-pink-500/50 hover:bg-white/5 transition-all group flex flex-col items-center text-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <FaInstagram className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Instagram</h3>
                <p className="text-pink-400 font-medium text-lg">{instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, "@").replace(/\/$/, "")}</p>
                <p className="text-sm text-gray-400 mt-2">ติดตามรูปภาพและสตอรี่อัปเดตแบบเรียลไทม์</p>
              </div>
            </motion.a>

            <motion.a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all group flex flex-col items-center text-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(24,119,242,0.3)]">
                <FaFacebook className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Facebook</h3>
                <p className="text-blue-400 font-medium text-lg">โรงเรียนอัตตัรกียะห์อิสลามียะห์</p>
                <p className="text-sm text-gray-400 mt-2">เพจหลักของโรงเรียนสำหรับการประกาศอย่างเป็นทางการ</p>
              </div>
            </motion.a>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">สถานที่ตั้ง</h3>
                <p className="text-gray-300 whitespace-pre-line">{address}</p>
              </div>
            </motion.div>

            {phone && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                  <Phone className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">โทรศัพท์</h3>
                  <a href={`tel:${phone}`} className="text-green-400 font-medium text-lg hover:underline">{phone}</a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
