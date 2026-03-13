import { ReactNode, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { ChatbotButton } from "./ChatbotButton";
import { WeatherAlertBanner } from "./WeatherAlertBanner";
import { DashboardFooter } from "./DashboardFooter";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import cropsBg from "@/assets/crops-bg.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const isMobile = useIsMobile();

  const effectiveOpen = sidebarOpen || hoverOpen;

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && !sidebarOpen) setHoverOpen(true);
  }, [isMobile, sidebarOpen]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile && !sidebarOpen) setHoverOpen(false);
  }, [isMobile, sidebarOpen]);

  return (
    <ChatbotProvider>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed flex flex-col"
        style={{ backgroundImage: `url(${cropsBg})` }}
      >
        <div className="min-h-screen bg-gradient-to-br from-background/98 via-background/95 to-background/90 backdrop-blur-sm flex flex-col">
        <WeatherAlertBanner />
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex flex-1 pt-16">
          {/* Hover trigger zone on left edge */}
          {!effectiveOpen && !isMobile && (
            <div
              className="fixed top-16 left-0 bottom-0 w-4 z-30"
              onMouseEnter={handleMouseEnter}
            />
          )}
          <DashboardSidebar
            isOpen={effectiveOpen}
            onClose={() => { setSidebarOpen(false); setHoverOpen(false); }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          
          <main className={cn(
            "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300",
            effectiveOpen && "lg:ml-64"
          )}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        <div className="mt-auto bg-background/95 backdrop-blur-md">
          <DashboardFooter />
        </div>
        <ChatbotButton />
        </div>
      </div>
    </ChatbotProvider>
  );
};
