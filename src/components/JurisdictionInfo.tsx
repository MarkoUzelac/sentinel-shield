import { MapPin, Scale, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const jurisdictions = [
  {
    region: "Hrvatska",
    flag: "🇭🇷",
    laws: [
      { name: "Kazneni zakon (čl. 143.)", description: "Neovlašteno prisluškivanje i snimanje" },
      { name: "Zakon o elektroničkim komunikacijama", description: "Zaštita tajnosti komunikacija" },
      { name: "GDPR / ZZOP", description: "Zaštita osobnih podataka" },
    ],
    penalty: "Do 5 godina zatvora",
    notes: "Presretanje komunikacija zahtijeva sudski nalog",
  },
  {
    region: "Europska unija",
    flag: "🇪🇺",
    laws: [
      { name: "GDPR (Uredba 2016/679)", description: "Opća uredba o zaštiti podataka" },
      { name: "ePrivacy Direktiva", description: "Zaštita privatnosti u elektroničkim komunikacijama" },
      { name: "Direktiva 2013/40/EU", description: "Napadi na informacijske sustave" },
    ],
    penalty: "Do 20M€ ili 4% godišnjeg prometa",
    notes: "Svaka država članica ima dodatne nacionalne zakone",
  },
  {
    region: "SAD",
    flag: "🇺🇸",
    laws: [
      { name: "CFAA", description: "Computer Fraud and Abuse Act" },
      { name: "Wiretap Act", description: "Federalni zakon o prisluškivanju" },
      { name: "ECPA", description: "Electronic Communications Privacy Act" },
    ],
    penalty: "Do 20 godina zatvora (federalno)",
    notes: "Različiti zakoni po državama",
  },
];

export const JurisdictionInfo = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">Jurisdikcije</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pravni Okvir po Regijama
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pregled relevantnih zakona i kazni za neovlašteno praćenje u različitim jurisdikcijama
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {jurisdictions.map((jurisdiction, index) => (
            <Card key={index} variant="cyber" className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{jurisdiction.flag}</span>
                  <div>
                    <CardTitle className="text-xl">{jurisdiction.region}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Jurisdikcija</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Scale className="w-3 h-3" />
                    Relevantni zakoni
                  </p>
                  <div className="space-y-2">
                    {jurisdiction.laws.map((law, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <p className="text-sm font-medium text-foreground">{law.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{law.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-destructive mb-1">
                        Maksimalna kazna
                      </p>
                      <p className="text-sm text-foreground font-medium">{jurisdiction.penalty}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  * {jurisdiction.notes}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
