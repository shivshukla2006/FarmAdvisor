import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CommunityHighlights } from "@/components/dashboard/CommunityHighlights";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeatherWidget />
            <QuickActions />
          </div>
          
          <div className="space-y-6">
            <RecentActivity />
            <CommunityHighlights />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
