import { TrendingUp, CloudSun, Bug, FileText, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color: string;
  delay: string;
}

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color, delay }: StatCardProps) => (
  <Card className={`p-4 hover-lift opacity-0 animate-fade-in-up ${delay} bg-card/80 backdrop-blur-sm border-border/50`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-heading font-bold text-foreground">{value}</span>
          {trend && (
            <span className={`text-xs font-medium ${trendUp ? 'text-primary' : 'text-destructive'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  </Card>
);

export const StatsOverview = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: recommendations } = useQuery({
    queryKey: ['recommendation-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from('crop_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const { data: diagnoses } = useQuery({
    queryKey: ['diagnosis-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from('pest_diagnoses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const { data: bookmarks } = useQuery({
    queryKey: ['bookmark-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from('scheme_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const { data: posts } = useQuery({
    queryKey: ['post-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const stats = [
    {
      icon: TrendingUp,
      label: t("recommendations"),
      value: recommendations || 0,
      trend: "this month",
      trendUp: true,
      color: "gradient-primary",
      delay: "animation-delay-100",
    },
    {
      icon: Bug,
      label: t("pestDiagnosis"),
      value: diagnoses || 0,
      color: "bg-secondary",
      delay: "animation-delay-200",
    },
    {
      icon: FileText,
      label: t("schemes"),
      value: bookmarks || 0,
      color: "bg-accent",
      delay: "animation-delay-300",
    },
    {
      icon: Users,
      label: t("community"),
      value: posts || 0,
      trend: "active",
      trendUp: true,
      color: "bg-primary/80",
      delay: "animation-delay-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};
