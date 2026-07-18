import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  useListAnnouncements, 
  useListNews, 
  useListSchedules, 
  useListDownloads, 
  useListTeamMembers,
  getListAnnouncementsQueryKey,
  getListNewsQueryKey,
  getListSchedulesQueryKey,
  getListDownloadsQueryKey,
  getListTeamMembersQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { BellRing, Newspaper, CalendarDays, Download, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data: announcements } = useListAnnouncements({ query: { queryKey: getListAnnouncementsQueryKey() } });
  const { data: news } = useListNews({ query: { queryKey: getListNewsQueryKey() } });
  const { data: schedules } = useListSchedules({ query: { queryKey: getListSchedulesQueryKey() } });
  const { data: downloads } = useListDownloads({ query: { queryKey: getListDownloadsQueryKey() } });
  const { data: teamMembers } = useListTeamMembers({ query: { queryKey: getListTeamMembersQueryKey() } });

  const stats = [
    { label: "ประกาศ", value: announcements?.length ?? 0, icon: BellRing, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "ข่าวสาร", value: news?.length ?? 0, icon: Newspaper, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "ตารางแข่งขัน", value: schedules?.length ?? 0, icon: CalendarDays, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "ไฟล์ดาวน์โหลด", value: downloads?.length ?? 0, icon: Download, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "คณะทำงาน", value: teamMembers?.length ?? 0, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
  BIRU MENARA
</h1>
        <p className="text-muted-foreground">สรุปข้อมูลทั้งหมดของเว็บไซต์ BIRU MENARA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="glass border-white/5 overflow-hidden">
            <CardContent className="p-6 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
