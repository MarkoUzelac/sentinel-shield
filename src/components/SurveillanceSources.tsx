import { Eye, Smartphone, Radio, Building2, Network, ScanFace, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Source {
  icon: typeof Eye;
  name: string;
  category: string;
  how: string;
  detect: string;
  legal: string;
  penalties: string[];
}

const sources: Source[] = [
  {
    icon: Smartphone,
    category: "Komercijalni spyware",
    name: "Pegasus (NSO Group, Izrael)",
    how: "Zero-click eksploiti (iMessage, WhatsApp) — instalira se bez interakcije. Prikuplja poruke, pozive, mikrofon, kameru, lokaciju.",
    detect: "MVT (Mobile Verification Toolkit, Amnesty Tech) — analiza iOS backup-a i Android logova za poznate IOC-e.",
    legal: "U EU prodaja regulirana Uredbom 2021/821 (dual-use). NSO sudski sporovi pokrenuti u SAD-u (WhatsApp v. NSO), Španjolskoj (Catalangate), Poljskoj.",
    penalties: ["EU: GDPR do €20M / 4% prometa", "ES: do 4 god. zatvora (Codigo Penal čl. 197)", "PL: do 5 god. (KK art. 267)", "SAD: do 10 god. (CFAA)"]
  },
  {
    icon: Smartphone,
    category: "Komercijalni spyware",
    name: "Predator (Intellexa, Cipar/Grčka)",
    how: "Android/iOS one-click eksploiti dostavljeni putem SMS-a ili MitM injekcije ISP-a. Sankcionirano od strane US Treasury (2024).",
    detect: "Citizen Lab IOC liste, MVT, mrežna analiza domena Intellexa infrastrukture.",
    legal: "EU PEGA komisija (2023) preporučila moratorij. Grčka 'Predatorgate' istraga 2022.",
    penalties: ["GR: do 10 god. (KP čl. 370A)", "EU: GDPR + dual-use sankcije", "US OFAC: zamrzavanje imovine"]
  },
  {
    icon: Smartphone,
    category: "Komercijalni spyware",
    name: "FinFisher / FinSpy (Njemačka)",
    how: "Trojan dostavljan kroz lažne ažuranja softvera i ISP MitM. Stečaj 2022. nakon kaznene istrage u DE.",
    detect: "AmnestyTech indikatori, Detect-It-Easy, YARA pravila.",
    legal: "Munich Public Prosecutor pokrenuo postupak 2019 zbog izvoza u Tursku bez dozvole.",
    penalties: ["DE: do 5 god. (AWG §17) za nezakoniti izvoz", "DE StGB §202a: do 3 god.", "EU: GDPR sankcije"]
  },
  {
    icon: Eye,
    category: "Stalkerware",
    name: "mSpy, FlexiSpy, Cocospy, Hoverwatch, Cerberus",
    how: "Instaliraju se fizičkim pristupom uređaju (oko 5 min). Skrivaju ikonu, prosljeđuju poruke, lokaciju, pozive partnera/djeteta.",
    detect: "Coalition Against Stalkerware IOC baza, Malwarebytes, Kaspersky TinyCheck, ručna provjera Device Admin app-ova.",
    legal: "FTC zabranio prodaju SpyFone 2021. U EU spada pod ilegalno praćenje partnera.",
    penalties: ["HR: do 3 god. (KZ čl. 143)", "DE: do 3 god. (StGB §202a)", "FR: do 5 god. + €300k (Code pénal 226-1)", "IT: do 4 god. (CP art. 617-quater)"]
  },
  {
    icon: Radio,
    category: "Mrežni nadzor",
    name: "IMSI Catcher / Stingray / Cellebrite",
    how: "Lažna bazna stanica koja prisiljava mobitele u okolici (do 1km) na 2G downgrade i presreće poziva, SMS, lokaciju. Cijena od $1.500 (rogue BTS) do $500k (Harris Stingray).",
    detect: "SnoopSnitch (Android s Qualcomm chipsetom + root), AIMSICD, Cell Spy Catcher, ručna provjera Cell ID-a.",
    legal: "U EU dozvoljeno samo policiji sa sudskim nalogom (DE: §100i StPO). U SAD-u zahtijeva warrant (Carpenter v. US 2018).",
    penalties: ["HR: do 3 god. (ZED čl. 100, KZ 143)", "DE: do 5 god. (StGB §202b + TKG)", "AT: do 1 god. (TKG §108)", "EU: ePrivacy direktiva + GDPR"]
  },
  {
    icon: Network,
    category: "Mrežni nadzor",
    name: "SS7 / Diameter eksploiti (2G/3G/4G/5G)",
    how: "Zloupotreba globalnog telekom signalizacijskog protokola za praćenje lokacije i presretanje SMS-a (2FA bypass). Pristup košta $500-5000/mj na crnom tržištu.",
    detect: "GSMA RAEX IR.82, ENISA SS7 vulnerability tracker, telekomunikacijski firewall (Adaptive Mobile, Cellusys).",
    legal: "GSMA FS.07 i ENISA preporuke. NIS2 obvezuje EU telekome na zaštitu od ovog napada.",
    penalties: ["NIS2: do €10M ili 2% prometa", "DE: do 5 god. (TKG §148)", "EU: GDPR + ePrivacy"]
  },
  {
    icon: Building2,
    category: "Državni nadzor",
    name: "PRISM / XKeyscore (NSA), Tempora (GCHQ)",
    how: "Masovno prikupljanje internet prometa sa optičkih kabela (Tempora) i izravna suradnja s tech kompanijama (PRISM — Snowden 2013).",
    detect: "Schrems II presuda (CJEU C-311/18) — transfer podataka u SAD ograničen. Koristite EU-based servise.",
    legal: "FISA Section 702 (US), Investigatory Powers Act 2016 (UK 'Snoopers Charter'). U EU u sukobu s GDPR-om.",
    penalties: ["US tvrtke: do $43.792 po kršenju TPP-a", "EU: GDPR do €20M / 4% za nezakoniti transfer", "Schrems II — invalidacija Privacy Shielda"]
  },
  {
    icon: Building2,
    category: "Državni nadzor",
    name: "EU 'Chat Control' (CSAR prijedlog 2022/0155)",
    how: "Prijedlog regulative koji bi obvezao platforme (Signal, WhatsApp) na client-side skeniranje svih poruka prije enkripcije.",
    detect: "Pratite glasanje u Vijeću EU. Apple, Signal i Threema najavili povlačenje iz EU ako prođe.",
    legal: "Europski parlament (LIBE) odbio masovno skeniranje u studenom 2023. Vijeće EU još raspravlja.",
    penalties: ["EU pravnici (EDPS, EDPB): kršenje Povelje EU čl. 7-8", "Predloženo: do 6% globalnog prometa za neprovođenje"]
  },
  {
    icon: ScanFace,
    category: "AI nadzor",
    name: "Clearview AI, PimEyes, FindClone",
    how: "Scraping milijardi fotografija s društvenih mreža za prepoznavanje lica bez pristanka. Clearview ima 50+ milijardi slika.",
    detect: "GDPR pravo na zaborav — zahtjev za brisanje preko privacy@clearview.ai. PimEyes opt-out form.",
    legal: "EU AI Act 2024 zabranjuje masovno scraping za biometriju. CNIL, Garante, AEPD su izrekli kazne.",
    penalties: ["IT (Garante): €20M (2022)", "GR (HDPA): €20M (2022)", "FR (CNIL): €20M (2022)", "UK (ICO): £7.5M (2022)", "EU AI Act: do €35M / 7% prometa"]
  },
  {
    icon: Network,
    category: "AdTech praćenje",
    name: "Meta Pixel, Google Analytics, Real-Time Bidding",
    how: "JavaScript pikseli prate korisnike preko stranica. IAB RTB sustav dnevno dijeli osobne podatke s 1000+ partnera u milisekundama.",
    detect: "Browser extension uBlock Origin, Privacy Badger, EFF Cover Your Tracks, Mozilla Lightbeam.",
    legal: "Austrijski DPA (2022) i CNIL (2022) presudili da Google Analytics krši GDPR. Belgijski APD presudio da je IAB TCF nezakonit (2022).",
    penalties: ["Meta: €1.2B (DPC Ireland, 2023) za EU-US transfer", "Google: €150M (CNIL 2022) za cookies", "Criteo: €40M (CNIL 2023)", "IAB Europe: presuda APD 2022"]
  },
  {
    icon: Eye,
    category: "Komercijalni spyware",
    name: "Candiru (DevilsTongue), Hermit (RCS Lab/Italija)",
    how: "Windows + Android spyware koji se distribuira preko WHO/Vodafone phishinga. Hermit korišten u Kazahstanu i Italiji (2022).",
    detect: "Lookout Threat Intelligence, Google TAG izvještaji, MVT.",
    legal: "Sankcionirani US Commerce Dept Entity List 2021. RCS Lab pod istragom talijanskih tužitelja.",
    penalties: ["IT: do 5 god. (CP art. 615-ter)", "EU: dual-use Uredba 2021/821", "US Entity List: zabrana izvoza"]
  },
];

const categoryColors: Record<string, "destructive" | "default" | "secondary" | "legal" | "cyber"> = {
  "Komercijalni spyware": "destructive",
  "Stalkerware": "destructive",
  "Mrežni nadzor": "cyber",
  "Državni nadzor": "legal",
  "AI nadzor": "default",
  "AdTech praćenje": "secondary",
};

export const SurveillanceSources = () => {
  return (
    <section id="surveillance" className="py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="destructive" className="mb-4">Aktivne prijetnje 2024–2026</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Izvori praćenja i nadziranja ljudi
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            Pregled stvarnih alata, mreža i programa koji se koriste za nadzor pojedinaca — kako rade,
            kako ih detektirati i koje su zakonske kazne za zlouporabu u EU jurisdikcijama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {sources.map((s) => (
            <Card key={s.name} variant="cyber" className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <Badge variant={categoryColors[s.category]} className="text-[10px]">
                    {s.category}
                  </Badge>
                </div>
                <CardTitle className="text-base md:text-lg leading-tight">{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm flex-1">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Kako radi</p>
                  <p className="text-foreground/90 leading-relaxed">{s.how}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-primary mb-1">Kako detektirati</p>
                  <p className="text-foreground/90 leading-relaxed">{s.detect}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-accent mb-1">Pravna pozadina</p>
                  <p className="text-foreground/90 leading-relaxed">{s.legal}</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs font-mono uppercase tracking-wider text-destructive mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Kazne za zlouporabu
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {s.penalties.map((p, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] border-destructive/30">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 md:mt-12 p-4 md:p-6 rounded-xl border border-primary/20 bg-primary/5">
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Izvori:</strong> Citizen Lab (Toronto), Amnesty Tech, Access Now,
            EDPB, ENISA, GSMA, EU PEGA Commission Report (2023), CJEU C-311/18 (Schrems II),
            Coalition Against Stalkerware, Have I Been Pwned. Sve kazne preuzete iz objavljenih
            odluka nadležnih DPA tijela ili pravomoćnih sudskih presuda.
          </p>
        </div>
      </div>
    </section>
  );
};
