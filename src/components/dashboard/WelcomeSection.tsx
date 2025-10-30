import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const WelcomeSection = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("Farmer");

  useEffect(() => {
    const loadUserName = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (data?.full_name) {
        setUserName(data.full_name.split(' ')[0]);
      }
    };

    loadUserName();
  }, [user]);
  
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your farm today
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI Ready</span>
        </div>
      </div>
    </Card>
  );
};
