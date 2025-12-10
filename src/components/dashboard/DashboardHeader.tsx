import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const { isAdmin, isLoading } = useUserRole();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect gradient-header shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline group-hover:text-primary transition-colors duration-200">FarmAdvisor</span>
            {!isLoading && isAdmin && (
              <Badge variant="default" className="ml-2 bg-accent text-accent-foreground animate-pulse-soft">
                Admin
              </Badge>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[100px] md:w-[120px] bg-background/50 border-border/50 hover:bg-background/80 transition-colors duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-[60]">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mr">मराठी</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>

          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border z-[60] animate-scale-in">
              <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer hover:bg-primary/10 transition-colors">{t("profileSettings")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/analytics" className="cursor-pointer hover:bg-primary/10 transition-colors">{t("analytics")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer hover:bg-destructive/10 transition-colors" onClick={signOut}>
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
