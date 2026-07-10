import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Target, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListTeamMembers, getListTeamMembersQueryKey, useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";

export default function Team() {
  const { data: allMembers, isLoading } = useListTeamMembers({ query: { queryKey: getListTeamMembersQueryKey() } });
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const members = allMembers?.filter((m) => m.published !== false) ?? [];

  const leaders = members.filter((m) => m.memberType === "main");
  const staff = members.filter((m) => m.memberType !== "main");

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
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {leaders.length > 0 && (
              <div className="mb-20 text-center">
                <h2 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-primary" /> คณะครูที่ปรึกษาสี
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {leaders.map((leader, i) => (
                    <motion.div
                      key={leader.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="relative rounded-3xl p-1 bg-gradient-to-br from-blue-600 to-indigo-600">
                        <div className="bg-card rounded-[22px] p-8 h-full flex flex-col items-center text-center">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl mb-6 relative">
                            {leader.imageUrl ? (
                              <img src={leader.imageUrl} alt={leader.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center">
                                <Users className="h-10 w-10 text-blue-200" />
                              </div>
                            )}
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20 mb-3">{leader.role}</Badge>
                          <h3 className="text-2xl font-bold text-white">{leader.name}</h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {staff.length > 0 && (
              <div className="mb-24">
                <h2 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-3 text-center">
                  <Target className="h-8 w-8 text-accent" /> คณะกรรมการนักเรียนสีฟ้า
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Card className="glass border-white/10 hover:border-primary/50 transition-all">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                            {member.imageUrl ? (
                              <img
                                src={member.imageUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-primary font-bold mb-1">{member.role}</p>
                            <h4 className="text-lg font-medium text-white">{member.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className="text-center py-24 glass rounded-2xl">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">ยังไม่มีข้อมูลคณะทำงาน</h3>
                <p className="text-muted-foreground">ผู้ดูแลระบบกำลังอัปเดตข้อมูล</p>
              </div>
            )}

            {settings?.teamRosterImageUrl && (
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
                  <h3 className="text-2xl font-bold text-white">รายชื่อนักกีฬาและคณะทำงาน</h3>
                </div>
                <img
                  src={settings.teamRosterImageUrl}
                  alt="รายชื่อนักกีฬาและคณะทำงาน"
                  className="w-full h-auto object-contain max-h-[800px] opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
