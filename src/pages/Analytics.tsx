import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Droplets, Sprout, DollarSign, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [activities, setActivities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      const { data: activitiesData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      const { data: recsData } = await supabase
        .from('crop_recommendations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      const { data: diagData } = await supabase
        .from('pest_diagnoses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setActivities(activitiesData || []);
      setRecommendations(recsData || []);
      setDiagnoses(diagData || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Process data for charts
  const activityByType = activities.reduce((acc: any, activity) => {
    acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
    return acc;
  }, {});

  const activityChartData = Object.entries(activityByType).map(([name, value]) => ({
    name,
    value
  }));

  const monthlyActivity = activities.reduce((acc: any, activity) => {
    const month = new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyActivity).map(([month, count]) => ({
    month,
    activities: count
  }));

  const severityData = diagnoses.reduce((acc: any, diag) => {
    acc[diag.severity || 'unknown'] = (acc[diag.severity || 'unknown'] || 0) + 1;
    return acc;
  }, {});

  const severityChartData = Object.entries(severityData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#228B22', '#8B4513', '#FFD700', '#FF8C00', '#DC143C'];

  const stats = [
    {
      title: "Total Activities",
      value: activities.length,
      icon: Activity,
      change: "+12%",
      color: "text-primary"
    },
    {
      title: "Recommendations",
      value: recommendations.length,
      icon: Sprout,
      change: "+8%",
      color: "text-green-600"
    },
    {
      title: "Pest Diagnoses",
      value: diagnoses.length,
      icon: Droplets,
      change: "+5%",
      color: "text-blue-600"
    },
    {
      title: "Success Rate",
      value: "94%",
      icon: TrendingUp,
      change: "+2%",
      color: "text-orange-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Farm Analytics</h1>
            <p className="text-muted-foreground">
              Track your farming activities, insights, and performance metrics
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="pests">Pest Management</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-heading font-bold mb-4">Activity Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="activities" stroke="#228B22" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-heading font-bold mb-4">Activity Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-heading font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-bold mb-4">Crop Recommendations Summary</h3>
              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No crop recommendations yet. Get started by requesting a recommendation!
                  </p>
                ) : (
                  recommendations.slice(0, 5).map((rec) => (
                    <Card key={rec.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-1">{rec.location}</h4>
                          <p className="text-sm text-muted-foreground">
                            {rec.season} • {rec.soil_type}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(rec.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rec.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-heading font-bold mb-4">Pest Severity Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={severityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8B4513" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-heading font-bold mb-4">Recent Diagnoses</h3>
                <div className="space-y-4">
                  {diagnoses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No pest diagnoses yet. Upload an image to get started!
                    </p>
                  ) : (
                    diagnoses.slice(0, 5).map((diag) => (
                      <div key={diag.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className={`rounded-full p-2 ${
                          diag.severity === 'high' ? 'bg-red-100' :
                          diag.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <Droplets className={`h-4 w-4 ${
                            diag.severity === 'high' ? 'text-red-600' :
                            diag.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{diag.pest_identified || 'Analysis pending'}</h4>
                          <p className="text-sm text-muted-foreground">{diag.crop_type}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(diag.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-bold mb-6">Activity Timeline</h3>
              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary p-2">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      {index !== activities.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
