import { useState, useEffect } from "react";
import { Cookie, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {!showSettings ? (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Koristimo kolačiće 🍪
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Koristimo kolačiće za poboljšanje vašeg iskustva na stranici. 
                  Nužni kolačići su potrebni za rad stranice, dok analitički i marketinški 
                  pomažu u poboljšanju naših usluga.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="cyber" size="sm" onClick={handleAcceptAll}>
                    Prihvati sve
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAcceptNecessary}>
                    Samo nužni
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Postavke
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={handleAcceptNecessary}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Postavke kolačića</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Nužni kolačići</p>
                  <p className="text-xs text-muted-foreground">Potrebni za rad stranice</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="w-4 h-4 accent-primary"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Analitički kolačići</p>
                  <p className="text-xs text-muted-foreground">Pomažu u razumijevanju korištenja stranice</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Marketinški kolačići</p>
                  <p className="text-xs text-muted-foreground">Koriste se za ciljano oglašavanje</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="cyber" onClick={handleSavePreferences}>
                Spremi postavke
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Odustani
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
