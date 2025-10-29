import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Bug, Newspaper, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Leaf,
    title: "Get Crop Recommendations",
    description: "AI-powered suggestions for your farm",
    path: "/recommendations",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Bug,
    title: "Diagnose Pest Issues",
    description: "Upload photo for instant analysis",
    path: "/pest-diagnosis",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: Newspaper,
    title: "Browse Gov Schemes",
    description: "Find subsidies and programs",
    path: "/schemes",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export const QuickActions = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className={`h-12 w-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-3`}>
              <action.icon className={`h-6 w-6 ${action.color}`} />
            </div>
            <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {action.description}
            </p>
            <div className="flex items-center text-sm text-primary font-medium">
              Start now
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
