import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="font-heading font-bold text-xl">FarmAdvisor</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-[60]">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mr">मराठी</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link to="/auth">{t("login")}</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/auth">{t("signUp")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
