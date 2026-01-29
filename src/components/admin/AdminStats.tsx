import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, FileText, Bug, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  trend?: string;
  index: number;
}

const StatCard = ({ title, value, description, icon: Icon, trend, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
          {trend && (
            <span className="text-primary ml-1">{trend}</span>
          )}
        </p>
      </CardContent>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/5 blur-2xl" />
    </Card>
  </motion.div>
);

export const AdminStats = () => {
  const { data: userCount } = useQuery({
    queryKey: ["admin-user-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: postCount } = useQuery({
    queryKey: ["admin-post-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: schemeCount } = useQuery({
    queryKey: ["admin-scheme-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("government_schemes")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: diagnosisCount } = useQuery({
    queryKey: ["admin-diagnosis-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("pest_diagnoses")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: recommendationCount } = useQuery({
    queryKey: ["admin-recommendation-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("crop_recommendations")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: activityData } = useQuery({
    queryKey: ["admin-activity-chart"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_activities")
        .select("created_at, activity_type")
        .order("created_at", { ascending: true })
        .limit(100);
      
      // Group by date
      const grouped: Record<string, Record<string, number>> = {};
      data?.forEach((activity) => {
        const date = new Date(activity.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!grouped[date]) {
          grouped[date] = { recommendation: 0, diagnosis: 0, forum_post: 0, scheme_bookmark: 0 };
        }
        grouped[date][activity.activity_type] = (grouped[date][activity.activity_type] || 0) + 1;
      });

      return Object.entries(grouped).map(([date, counts]) => ({
        date,
        ...counts,
        total: Object.values(counts).reduce((a, b) => a + b, 0),
      }));
    },
  });

  const stats = [
    { title: "Total Users", value: userCount || 0, description: "Registered farmers", icon: Users, index: 0 },
    { title: "Community Posts", value: postCount || 0, description: "Active discussions", icon: MessageSquare, index: 1 },
    { title: "Government Schemes", value: schemeCount || 0, description: "Available schemes", icon: FileText, index: 2 },
    { title: "Pest Diagnoses", value: diagnosisCount || 0, description: "Total diagnoses", icon: Bug, index: 3 },
    { title: "Recommendations", value: recommendationCount || 0, description: "Crop recommendations", icon: TrendingUp, index: 4 },
    { title: "Total Activities", value: activityData?.reduce((a, b) => a + b.total, 0) || 0, description: "User interactions", icon: Activity, index: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData || []}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="recommendation" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="diagnosis" stackId="a" fill="hsl(var(--secondary))" />
                  <Bar dataKey="forum_post" stackId="a" fill="hsl(var(--accent))" />
                  <Bar dataKey="scheme_bookmark" stackId="a" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
