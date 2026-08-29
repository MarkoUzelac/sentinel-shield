import { ShieldCheck, Radar, Database, Globe, Lock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const providers = [
  {
    icon: Radar,
    name: "Mrežno mjerenje",
    source: "Cloudflare speed endpoint + browser WebRTC",
    desc: "Stvarno mjerenje HTTP latencije, download/upload prijenosa i WebRTC indikatora. Ako endpoint nije dostupan, rezultat ostaje UNAVAILABLE.",
  },
  {
    icon: Globe,
    name: "IP geolokacija",
    source: "IP geolocation HTTPS API",
    desc: "Približna geolokacija prema javnoj IP adresi. To nije GPS i ne predstavlja fizičku lokaciju uređaja.",
  },
  {
    icon: Database,
    name: "Pravni izvori",
    source: "EUR-Lex / nacionalni i službeni izvori",
    desc: "Pravni sadržaj mora biti vezan uz provjerljiv službeni izvor i jurisdikciju. Aplikacija ne smije izmišljati pravne rezultate.",
  },
  {
    icon: ShieldCheck,
    name: "Forenzički alati",
    source: "Open-source projekti",
    desc: "MVT i drugi alati mogu biti navedeni kao vanjski forenzički alati. Web aplikacija sama po sebi ne tvrdi da je izvršila forenzički pregled uređaja.",
  },
  {
    icon: Activity,
    name: "Cellular evidence",
    source: "Android native ingest — trenutno UNAVAILABLE",
    desc: "MCC/MNC, Cell ID, PCI, radio tehnologija i signal moraju doći iz stvarnog Android izvora. Web preglednik ih ne simulira.",
  },
  {
    icon: Lock,
    name: "OSINT i breach provjere",
    source: "Vanjski izvori uz eksplicitnu integraciju",
    desc: "Nema automatske tvrdnje o kompromitaciji bez stvarnog odgovora izvora. Svaki nalaz mora imati izvor i vrijeme opažanja.",
  },
];

export const AboutProviders = () => (
  <section id="about" className="py-12 md:py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <Badge variant="cyber" className="mb-4">Izvori podataka</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Izvori i status dokaza</h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Sentinel Shield jasno razlikuje stvarno opažanje od nedostupnog izvora. Nema simuliranih sigurnosnih dokaza.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {providers.map((p) => (
          <Card key={p.name} variant="cyber">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3"><p.icon className="w-6 h-6 text-primary" /></div>
              <CardTitle className="text-lg">{p.name}</CardTitle>
              <CardDescription className="text-xs font-mono text-primary/80">{p.source}</CardDescription>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
