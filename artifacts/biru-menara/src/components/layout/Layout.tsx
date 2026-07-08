import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useEffect } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>
      
      <Navbar />
      <main className="flex-1 pt-20 flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
