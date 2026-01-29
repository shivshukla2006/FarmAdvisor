import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Shield, 
  FileText, 
  MessageSquare, 
  CloudRain, 
  BarChart3,
  Settings,
  Activity
} from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats";
import { UserManagement } from "@/components/admin/UserManagement";
import { CommunityModeration } from "@/components/admin/CommunityModeration";
import { SchemesManagement } from "@/components/admin/SchemesManagement";
import { WeatherAlertsManagement } from "@/components/admin/WeatherAlertsManagement";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { LeafLoader } from "@/components/ui/LeafLoader";

const Admin = () => {
  const { isAdmin, isLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LeafLoader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "schemes", label: "Schemes", icon: FileText },
    { id: "weather", label: "Weather Alerts", icon: CloudRain },
    { id: "activity", label: "Activity Log", icon: Activity },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground text-sm">
                  Manage users, content, and system settings
                </p>
              </div>
            </div>
          </div>
          <Badge variant="default" className="w-fit bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Shield className="h-3 w-3 mr-1" />
            Administrator Access
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-1 bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-3"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityModeration />
          </TabsContent>

          <TabsContent value="schemes" className="space-y-6">
            <SchemesManagement />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <WeatherAlertsManagement />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <AdminActivityLog />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Admin;
