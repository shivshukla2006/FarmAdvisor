import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const WelcomeSection = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            {greeting}, Rajesh! 👋
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
