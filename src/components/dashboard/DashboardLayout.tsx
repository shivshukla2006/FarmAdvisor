import { ReactNode, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { ChatbotButton } from "./ChatbotButton";
import { WeatherAlertBanner } from "./WeatherAlertBanner";
import { DashboardFooter } from "./DashboardFooter";
import { ChatbotProvider } from "@/contexts/ChatbotContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ChatbotProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <WeatherAlertBanner />
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex flex-1 pt-16">
          <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        <DashboardFooter />
        <ChatbotButton />
      </div>
    </ChatbotProvider>
  );
};
