import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CommunityHighlights } from "@/components/dashboard/CommunityHighlights";
import { StatsOverview } from "@/components/dashboard/StatsOverview";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="opacity-0 animate-fade-in">
          <WelcomeSection />
        </div>
        
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="opacity-0 animate-fade-in-up animation-delay-200">
              <WeatherWidget />
            </div>
            <div className="opacity-0 animate-fade-in-up animation-delay-300">
              <QuickActions />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="opacity-0 animate-slide-in-right animation-delay-300">
              <RecentActivity />
            </div>
            <div className="opacity-0 animate-slide-in-right animation-delay-400">
              <CommunityHighlights />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
