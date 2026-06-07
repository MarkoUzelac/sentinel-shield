import { ShieldCheck, Radar, Database, Globe, Lock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const providers = [
  {
    icon: Radar,
    name: "Mjerenje signala i brzine",
    source: "WebRTC + Cloudflare/Google STUN, speed.cloudflare.com",
    desc: "Stvarno mjerenje download/upload brzine, latencije, jittera i detekcija WebRTC/DNS leakova bez prikupljanja osobnih podataka.",
  },
  {
    icon: Globe,
    name: "Geolokacija po IP-u",
    source: "IP-API (HTTPS)",
    desc: "Server-side detekcija države i grada korisnika kako bismo prikazali ispravan pravni okvir (HR, EU, US, UK) i lokalne operatere.",
  },
  {
    icon: Database,
    name: "Pravni okvir i kazne",
    source: "EUR-Lex, NN.hr, GDPR, US Code Title 18",
    desc: "Stvarni izvodi iz zakona (ZED HR čl. 143, GDPR čl. 32, ECPA 18 U.S.C. §2511) s rasponom kazni i poveznicama na izvore.",
  },
  {
    icon: ShieldCheck,
    name: "Forenzika uređaja",
    source: "MVT (Amnesty International), iVerify, Stalkerware-IOC",
    desc: "Korištenje istih open-source alata koji su otkrili Pegasus, Predator i druge komercijalne spyware operacije.",
  },
  {
    icon: Activity,
    name: "Detekcija IMSI catchera",
    source: "SnoopSnitch (Android baseband), AIMSICD signature DB",
    desc: "Indikatori sumnjivih baznih stanica, downgrade napada (2G/3G) i tihih SMS-ova; vodič za samostalnu provjeru.",
  },
  {
    icon: Lock,
    name: "OSINT i provjera curenja",
    source: "Have I Been Pwned, intelx.io (javni indeks)",
    desc: "Provjera kompromitiranih email/telefonskih zapisa i preporuke za rotaciju lozinki, 2FA i hardware ključeve.",
  },
];

export const AboutProviders = () => {
  return (
    <section id="about" className="py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="cyber" className="mb-4">Izvori podataka</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            7 Pružatelja Sigurnosnih i Nadzornih Podataka
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Sve informacije na platformi temelje se na stvarnim, javno dostupnim izvorima i provjerenim
            open-source alatima. Bez izmišljenih podataka, bez mock vrijednosti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {providers.map((p) => (
            <Card key={p.name} variant="cyber">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <CardDescription className="text-xs font-mono text-primary/80">
                  {p.source}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto">
            SecHub Pro ne prodaje vaše podatke i ne koristi tracking pixele trećih strana. Sva mjerenja
            obavljaju se u vašem pregledniku ili preko provjerenih HTTPS API-ja, u skladu s GDPR-om.
          </p>
        </div>
      </div>
    </section>
  );
};
