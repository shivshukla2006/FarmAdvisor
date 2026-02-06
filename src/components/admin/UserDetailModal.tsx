import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Wheat, 
  Activity,
  TrendingUp,
  Bug,
  MessageSquare,
  Bookmark
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type ActivityType = Database["public"]["Enums"]["activity_type"];
type AppRole = Database["public"]["Enums"]["app_role"];

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  farm_location: string | null;
  farm_size: string | null;
  primary_crops: string[] | null;
  language: string | null;
  notifications_weather: boolean | null;
  notifications_schemes: boolean | null;
  notifications_community: boolean | null;
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  activity_type: ActivityType;
  title: string;
  description: string | null;
  created_at: string;
}

interface UserRole {
  role: AppRole;
}

interface UserDetailModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailModal = ({ userId, open, onOpenChange }: UserDetailModalProps) => {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId && open,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["admin-user-activities", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as UserActivity[];
    },
    enabled: !!userId && open,
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-user-roles-detail", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId && open,
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
        return "bg-orange-500/10 text-orange-600";
      case "forum_post":
        return "bg-blue-500/10 text-blue-600";
      case "scheme_bookmark":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatActivityType = (type: ActivityType) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const isLoading = profileLoading || activitiesLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : profile ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">
                Activity ({activities?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {profile.full_name || "Unnamed User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      <div className="flex gap-1 mt-2">
                        {roles && roles.length > 0 ? (
                          roles.map((r, i) => (
                            <Badge key={i} variant={r.role === "admin" ? "default" : "secondary"}>
                              {r.role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">user</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{profile.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Farm Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Farm Details
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium">
                            {profile.farm_location || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Wheat className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Farm Size</p>
                          <p className="text-sm font-medium">
                            {profile.farm_size || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {profile.primary_crops && profile.primary_crops.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-2">Primary Crops</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.primary_crops.map((crop, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preferences */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Notification Preferences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={profile.notifications_weather ? "default" : "outline"}>
                        Weather: {profile.notifications_weather ? "On" : "Off"}
                      </Badge>
                      <Badge variant={profile.notifications_schemes ? "default" : "outline"}>
                        Schemes: {profile.notifications_schemes ? "On" : "Off"}
                      </Badge>
                      <Badge variant={profile.notifications_community ? "default" : "outline"}>
                        Community: {profile.notifications_community ? "On" : "Off"}
                      </Badge>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {format(new Date(profile.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <div>
                      Updated {formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {activities && activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
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
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">No activity recorded yet</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
