import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Leaf,
  CloudRain,
  Bug,
  Newspaper,
  Users,
  BarChart3,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Leaf, label: "Crop Recommendations", path: "/recommendations" },
  { icon: CloudRain, label: "Weather Alerts", path: "/weather" },
  { icon: Bug, label: "Pest Diagnosis", path: "/pest-diagnosis" },
  { icon: Newspaper, label: "Government Schemes", path: "/schemes" },
  { icon: Users, label: "Community Forum", path: "/community" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
];

export const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-heading font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm font-medium mb-1">Need Help?</div>
              <div className="text-xs text-muted-foreground mb-3">
                Chat with our AI assistant for instant support
              </div>
              <Button size="sm" className="w-full" variant="outline">
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
