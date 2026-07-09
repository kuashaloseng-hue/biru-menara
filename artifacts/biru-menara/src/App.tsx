import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from '@/pages/Home';
import News from '@/pages/News';
import Schedule from '@/pages/Schedule';
import Downloads from '@/pages/Downloads';
import Team from '@/pages/Team';
import Contact from '@/pages/Contact';

// Admin Pages
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminNews from '@/pages/admin/AdminNews';
import AdminSchedules from '@/pages/admin/AdminSchedules';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminDownloads from '@/pages/admin/AdminDownloads';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminGallery from '@/pages/admin/AdminGallery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,           // always consider data stale → refetch on mount
      refetchOnWindowFocus: true, // refetch when user switches back to tab
      retry: 1,
    },
  },
});

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-white">
      <div className="text-center">
        <h1 className="text-6xl font-black text-primary mb-4 glow-text">404</h1>
        <h2 className="text-2xl font-bold mb-2">ไม่พบหน้าที่ต้องการ</h2>
        <p className="text-muted-foreground mb-6">หน้าเว็บไซต์นี้อาจถูกย้ายหรือไม่มีอยู่จริง</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors inline-block">
          กลับสู่หน้าแรก
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/team" component={Team} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      <Route path="/admin/news" component={AdminNews} />
      <Route path="/admin/schedules" component={AdminSchedules} />
      <Route path="/admin/team" component={AdminTeam} />
      <Route path="/admin/downloads" component={AdminDownloads} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin" component={AdminDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
