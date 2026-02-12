import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Smartphone, Wifi, WifiOff, Zap, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const benefits = [
    { icon: Zap, title: "Fast Loading", desc: "Loads instantly even on slow networks" },
    { icon: WifiOff, title: "Works Offline", desc: "Access key features without internet" },
    { icon: Smartphone, title: "Home Screen", desc: "Launch like a native app from your phone" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading font-semibold text-lg">Install FarmAdvisor</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isOnline ? "Online" : "Offline"}
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Get FarmAdvisor on Your Device
          </h2>
          <p className="text-muted-foreground">
            Install the app for a faster, offline-ready farming experience.
          </p>
        </div>

        <div className="space-y-3">
          {benefits.map((b) => (
            <Card key={b.title} className="flex items-center gap-4 p-4 bg-card">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {isInstalled ? (
          <div className="text-center space-y-2 py-4">
            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
            <p className="font-heading font-semibold">App Installed!</p>
            <p className="text-sm text-muted-foreground">You can launch FarmAdvisor from your home screen.</p>
          </div>
        ) : deferredPrompt ? (
          <Button onClick={handleInstall} size="lg" className="w-full h-12 text-base">
            <Download className="mr-2 h-5 w-5" />
            Install FarmAdvisor
          </Button>
        ) : (
          <Card className="p-4 bg-muted/50 text-center space-y-2">
            <p className="text-sm font-medium">Manual Install</p>
            <p className="text-xs text-muted-foreground">
              <strong>iPhone:</strong> Tap Share → "Add to Home Screen"<br />
              <strong>Android:</strong> Tap ⋮ menu → "Install app" or "Add to Home Screen"
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Install;
