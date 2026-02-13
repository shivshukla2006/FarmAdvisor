import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Zap, WifiOff, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed or previously dismissed this session
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after a short delay so it doesn't feel jarring
      setTimeout(() => setVisible(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-400">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base">Install FarmAdvisor</h3>
              <p className="text-xs text-muted-foreground">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Benefits */}
        <div className="px-4 py-3 flex gap-3">
          {[
            { icon: Zap, label: "Fast" },
            { icon: WifiOff, label: "Offline" },
            { icon: Smartphone, label: "Native feel" },
          ].map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/50">
              <b.icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 pt-2 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleDismiss}>
            Not now
          </Button>
          <Button className="flex-1" onClick={handleInstall}>
            <Download className="h-4 w-4 mr-1.5" />
            Install
          </Button>
        </div>
      </div>
    </div>
  );
};
