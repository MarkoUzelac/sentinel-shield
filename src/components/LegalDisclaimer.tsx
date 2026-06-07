import { Shield, AlertTriangle, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const LegalDisclaimer = () => {
  return (
    <section className="relative py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">
                  Pravno upozorenje
                </h2>
                <Badge variant="legal">Članak 143. KZ RH</Badge>
                <Badge variant="legal">GDPR</Badge>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Svi alati prikazani na ovoj stranici namijenjeni su <span className="text-foreground font-medium">isključivo edukaciji, 
                  istraživanju sigurnosti i detekciji prijetnji</span>. Neovlašteno praćenje, prisluškivanje ili hakiranje 
                  bez sudskog naloga predstavlja kazneno djelo.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Scale className="w-4 h-4 text-accent" />
                    <span>Zakon o elektroničkim komunikacijama</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>Kazneni zakon RH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
