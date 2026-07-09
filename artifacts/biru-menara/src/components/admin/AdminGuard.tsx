import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminMe, getAdminMeQueryKey } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: adminUser, isLoading, error } = useAdminMe({
    query: {
      queryKey: getAdminMeQueryKey(),
      retry: false
    }
  });

  useEffect(() => {
    if (!isLoading && (error || !adminUser)) {
      setLocation("/admin/login");
    }
  }, [adminUser, isLoading, error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !adminUser) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
