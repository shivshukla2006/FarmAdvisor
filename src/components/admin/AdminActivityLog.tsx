import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, TrendingUp, Bug, MessageSquare, Bookmark } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type ActivityType = Database["public"]["Enums"]["activity_type"];

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  title: string;
  description: string | null;
  created_at: string;
}

export const AdminActivityLog = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["admin-activity-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as UserActivity[];
    },
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "recommendation":
        return <TrendingUp className="h-4 w-4" />;
      case "diagnosis":
        return <Bug className="h-4 w-4" />;
      case "forum_post":
        return <MessageSquare className="h-4 w-4" />;
      case "scheme_bookmark":
        return <Bookmark className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "recommendation":
        return "bg-primary/10 text-primary";
      case "diagnosis":
        return "bg-secondary/10 text-secondary-foreground";
      case "forum_post":
        return "bg-accent/10 text-accent-foreground";
      case "scheme_bookmark":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatActivityType = (type: ActivityType) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading activities...
            </div>
          ) : activities?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities found
            </div>
          ) : (
            <div className="space-y-4">
              {activities?.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        {activity.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {formatActivityType(activity.activity_type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span title={format(new Date(activity.created_at), "PPpp")}>
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{activity.user_id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
