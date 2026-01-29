import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  LayoutDashboard,
  Leaf,
  CloudRain,
  Bug,
  Newspaper,
  Users,
  BarChart3,
  X,
  Shield,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const { openChatbot } = useChatbot();
  const { t } = useLanguage();
  const { isAdmin } = useUserRole();

  const menuItems = [
    { icon: LayoutDashboard, label: t("dashboard"), path: "/dashboard" },
    { icon: Leaf, label: t("recommendations"), path: "/recommendations" },
    { icon: CloudRain, label: t("weather"), path: "/weather" },
    { icon: Bug, label: t("pestDiagnosis"), path: "/pest-diagnosis" },
    { icon: Newspaper, label: t("schemes"), path: "/schemes" },
    { icon: Users, label: t("community"), path: "/community" },
    { icon: BarChart3, label: t("analytics"), path: "/analytics" },
    ...(isAdmin ? [{ icon: Shield, label: "Admin Panel", path: "/admin" }] : []),
  ];

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
          "fixed top-16 left-0 bottom-0 z-40 w-64 bg-gradient-to-b from-sidebar-background/98 via-sidebar-background/95 to-sidebar-background/90 backdrop-blur-md border-r border-sidebar-border/50 transition-transform duration-300 shadow-xl shadow-primary/5",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-3">
          {/* Inner container with distinct background */}
          <div className="flex flex-col h-full bg-card/60 rounded-2xl border border-border/30 shadow-inner overflow-hidden">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 lg:hidden border-b border-border/30">
              <span className="font-heading font-semibold text-sidebar-foreground">Menu</span>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-sidebar-accent">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium shadow-md shadow-primary/20"
                        : "hover:bg-sidebar-accent/80 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      !isActive && "group-hover:scale-110"
                    )} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Help section */}
            <div className="p-3 border-t border-border/30">
              <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
                <div className="text-sm font-heading font-semibold mb-1 text-sidebar-foreground">{t("needHelp")}</div>
                <div className="text-xs text-sidebar-foreground/60 mb-3">
                  {t("chatWithAI")}
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30" 
                  onClick={() => {
                    openChatbot();
                    onClose();
                  }}
                >
                  {t("getSupport")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
