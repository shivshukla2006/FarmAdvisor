import { TrendingUp, Bug, FileText, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
  iconBg: string;
  index: number;
}

const StatCard = ({ icon: Icon, label, value, trend, trendUp, gradient, iconBg, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <Card className={`relative p-5 overflow-hidden border-0 ${gradient} card-shine stat-glow group cursor-pointer`}>
      {/* Glow effect on hover */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1) 0%, transparent 70%)'
        }}
      />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <motion.div 
            className="flex items-baseline gap-2"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2, type: "spring" }}
          >
            <span className="text-3xl font-heading font-bold text-foreground">{value}</span>
            {trend && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            )}
          </motion.div>
        </div>
        <motion.div 
          className={`p-3 rounded-xl ${iconBg} shadow-sm`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="h-5 w-5 text-primary-foreground" />
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/5 blur-2xl" />
    </Card>
  </motion.div>
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
      gradient: "bg-gradient-to-br from-primary/10 via-card to-card",
      iconBg: "bg-gradient-to-br from-primary to-primary/70",
    },
    {
      icon: Bug,
      label: t("pestDiagnosis"),
      value: diagnoses || 0,
      gradient: "bg-gradient-to-br from-secondary/10 via-card to-card",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/70",
    },
    {
      icon: FileText,
      label: t("schemes"),
      value: bookmarks || 0,
      gradient: "bg-gradient-to-br from-accent/10 via-card to-card",
      iconBg: "bg-gradient-to-br from-accent to-accent/70",
    },
    {
      icon: Users,
      label: t("community"),
      value: posts || 0,
      trend: "active",
      trendUp: true,
      gradient: "bg-gradient-to-br from-primary/10 via-card to-card",
      iconBg: "bg-gradient-to-br from-primary/80 to-primary/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
};
