import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const activities = [
  {
    icon: CheckCircle2,
    iconColor: "text-primary",
    title: "Crop recommendation saved",
    time: "2 hours ago",
  },
  {
    icon: AlertCircle,
    iconColor: "text-accent",
    title: "Weather alert received",
    time: "5 hours ago",
  },
  {
    icon: Info,
    iconColor: "text-primary",
    title: "New scheme notification",
    time: "1 day ago",
  },
  {
    icon: CheckCircle2,
    iconColor: "text-primary",
    title: "Profile updated successfully",
    time: "2 days ago",
  },
];

export const RecentActivity = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-heading font-semibold mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
