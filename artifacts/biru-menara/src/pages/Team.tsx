import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Target, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import rosterImg from "@assets/1783520713566_1783520781749.jpg";
import placeholderPortrait from "@assets/generated_images/placeholder_portrait.jpg";

const LEADERS = [
  {
    role: "พ่อสี",
    name: "อ.มุสดากีม สะบุดิง",
    icon: Star,
    color: "from-blue-600 to-indigo-600",
  },
  {
    role: "แม่สี",
    name: "อ.โชริยาดี ยะมะกา",
    icon: Star,
    color: "from-cyan-600 to-blue-600",
  },
];

const STAFF = [
  { role: "หัวหน้าฝ่ายชาย", name: "รอการอัปเดต", type: "main" },
  { role: "หัวหน้าฝ่ายหญิง", name: "รอการอัปเดต", type: "main" },
  { role: "รองหัวหน้าฝ่ายชาย", name: "รอการอัปเดต", type: "sub" },
  { role: "รองหัวหน้าฝ่ายหญิง", name: "รอการอัปเดต", type: "sub" },
  { role: "เลขาฝ่ายชาย", name: "รอการอัปเดต", type: "sub" },
  { role: "เลขาฝ่ายหญิง", name: "รอการอัปเดต", type: "sub" },
];

export default function Team() {
  return (
    <Layout>
      <div className="bg-muted py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 text-sm px-4 py-1 border-primary/50">
              STAFF & ATHLETES
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              คณะทำงาน <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">สีฟ้า</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
              "ผู้นำที่เข้มแข็ง สร้างทีมที่แข็งแกร่ง"
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Leaders */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" /> คณะครูที่ปรึกษาสี
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {LEADERS.map((leader, i) => (
              <motion.div
                key={leader.role}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className={`relative rounded-3xl p-1 bg-gradient-to-br ${leader.color}`}>
                  <div className="bg-card rounded-[22px] p-8 h-full flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl mb-6 relative">
                      <img src={placeholderPortrait} alt={leader.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 mb-3">{leader.role}</Badge>
                    <h3 className="text-2xl font-bold text-white">{leader.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Student Leaders */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-3 text-center">
            <Target className="h-8 w-8 text-accent" /> คณะกรรมการนักเรียนสีฟ้า
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STAFF.map((staff, i) => (
              <motion.div
                key={staff.role}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`glass border-white/10 hover:border-primary/50 transition-all ${staff.type === 'main' ? 'bg-primary/5' : ''}`}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-white/10 shrink-0 overflow-hidden">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-primary font-bold mb-1">{staff.role}</p>
                      <h4 className="text-lg font-medium text-white">{staff.name}</h4>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full Roster Image */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
            <h3 className="text-2xl font-bold text-white">รายชื่อนักกีฬาและคณะทำงาน</h3>
          </div>
          <img 
            src={rosterImg} 
            alt="รายชื่อนักกีฬาและคณะทำงาน" 
            className="w-full h-auto object-contain max-h-[800px] opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>

      </div>
    </Layout>
  );
}
