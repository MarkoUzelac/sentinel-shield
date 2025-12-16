import { Shield, Wifi, Search, MapPin, Eye, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    icon: Wifi,
    title: "IMSI Catcher Alati",
    description: "Prikupljanje IMSI/IMEI podataka preko simulacije baznih stanica",
    tools: ["simple-IMSI-catcher.py", "X3RX3SSec/IMSI_Catcher"],
    purpose: "Pasivno hvatanje signala",
    warning: true,
  },
  {
    icon: Shield,
    title: "Detektori Praćenja",
    description: "Obrambeni alati za detekciju IMSI catchera i StingRay uređaja",
    tools: ["AIMSICD", "Rayhunter (EFF)"],
    purpose: "Zaštita privatnosti",
    warning: false,
  },
  {
    icon: MapPin,
    title: "Triangulacija Lokacije",
    description: "Geolokacija na temelju cell tower podataka bez GPS-a",
    tools: ["OpenCellID", "Triangulator"],
    purpose: "Lokacijska analiza",
    warning: false,
  },
  {
    icon: Search,
    title: "OSINT Alati",
    description: "Prikupljanje javno dostupnih metadata iz raznih izvora",
    tools: ["ExifTool", "SpiderFoot", "Maltego CE"],
    purpose: "Metadata analiza",
    warning: false,
  },
  {
    icon: Eye,
    title: "Detekcija Spywarea",
    description: "Provjera uređaja za prisutnost naprednog spywarea",
    tools: ["MVT (Amnesty)", "iMazing"],
    purpose: "Forenzička analiza",
    warning: false,
  },
  {
    icon: Server,
    title: "Lawful Interception",
    description: "ETSI-kompatibilni sustavi za operatore (uz sudski nalog)",
    tools: ["OpenLI"],
    purpose: "Samo za operatore",
    warning: true,
  },
];

export const ToolCategories = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">Kategorije</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Open-Source Sigurnosni Alati
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pregled alata organiziranih prema namjeni - od detekcije prijetnji do zaštite privatnosti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              variant="cyber"
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:shadow-[0_0_20px_hsl(175_80%_50%/0.3)] transition-all duration-300">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  {category.warning && (
                    <Badge variant="warning">Oprez</Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-4">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-mono">
                    Alati
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool, i) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Namjena:</span> {category.purpose}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
