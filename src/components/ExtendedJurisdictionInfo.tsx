import { useState, useEffect } from "react";
import { MapPin, Scale, AlertTriangle, ExternalLink, Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Jurisdiction {
  region: string;
  flag: string;
  code: string;
  laws: {
    name: string;
    description: string;
    article?: string;
    link?: string;
  }[];
  penalties: {
    offense: string;
    penalty: string;
  }[];
  cases?: {
    name: string;
    year: string;
    outcome: string;
  }[];
  notes: string;
}

const jurisdictions: Jurisdiction[] = [
  {
    region: "Hrvatska",
    flag: "🇭🇷",
    code: "HR",
    laws: [
      { 
        name: "Kazneni zakon (čl. 143.)", 
        description: "Neovlašteno prisluškivanje i snimanje",
        article: "Članak 143",
        link: "https://narodne-novine.nn.hr/clanci/sluzbeni/2011_11_125_2498.html"
      },
      { 
        name: "Zakon o elektroničkim komunikacijama", 
        description: "Zaštita tajnosti elektroničkih komunikacija",
        link: "https://narodne-novine.nn.hr/clanci/sluzbeni/2022_07_76_1106.html"
      },
      { 
        name: "GDPR / ZZOP", 
        description: "Opća uredba o zaštiti osobnih podataka",
        link: "https://azop.hr/gdpr/"
      },
      { 
        name: "Kazneni zakon (čl. 266.)", 
        description: "Neovlašteni pristup računalnom sustavu",
        article: "Članak 266"
      },
    ],
    penalties: [
      { offense: "Neovlašteno prisluškivanje", penalty: "Zatvor do 3 godine" },
      { offense: "Izrađivanje i posjedovanje uređaja za prisluškivanje", penalty: "Zatvor do 1 godine" },
      { offense: "Neovlašteni pristup računalnom sustavu", penalty: "Zatvor do 3 godine" },
      { offense: "Uništavanje/oštećivanje podataka", penalty: "Zatvor do 5 godina" },
    ],
    cases: [
      { name: "USKOK prisluškivanje", year: "2020", outcome: "Osuđen na 2 godine uvjetno" },
    ],
    notes: "Presretanje komunikacija zahtijeva sudski nalog. AZOP je nadležno tijelo za GDPR.",
  },
  {
    region: "Europska unija",
    flag: "🇪🇺",
    code: "EU",
    laws: [
      { 
        name: "GDPR (Uredba 2016/679)", 
        description: "Opća uredba o zaštiti osobnih podataka",
        link: "https://eur-lex.europa.eu/legal-content/HR/TXT/?uri=CELEX%3A32016R0679"
      },
      { 
        name: "NIS2 Direktiva (2022/2555)", 
        description: "Mjere za visoku razinu kibernetičke sigurnosti",
        link: "https://eur-lex.europa.eu/legal-content/HR/TXT/?uri=CELEX:32022L2555"
      },
      { 
        name: "Direktiva 2013/40/EU", 
        description: "Napadi na informacijske sustave",
        link: "https://eur-lex.europa.eu/legal-content/HR/TXT/?uri=celex%3A32013L0040"
      },
      { 
        name: "ePrivacy Direktiva", 
        description: "Zaštita privatnosti u elektroničkim komunikacijama"
      },
    ],
    penalties: [
      { offense: "Kršenje GDPR-a (manja)", penalty: "Do €10M ili 2% godišnjeg prometa" },
      { offense: "Kršenje GDPR-a (veća)", penalty: "Do €20M ili 4% godišnjeg prometa" },
      { offense: "Ilegalni pristup sustavu", penalty: "Min. 2 godine zatvora" },
      { offense: "Ilegalno presretanje", penalty: "Min. 3 godine zatvora" },
      { offense: "NIS2 kršenja", penalty: "Do €10M ili 2% prometa" },
    ],
    cases: [
      { name: "British Airways (GDPR)", year: "2020", outcome: "Kazna £20M" },
      { name: "Amazon (GDPR)", year: "2021", outcome: "Kazna €746M" },
      { name: "Meta/Facebook (GDPR)", year: "2023", outcome: "Kazna €1.2B" },
    ],
    notes: "Svaka država članica ima dodatne nacionalne zakone. Kazne se izriču u zemlji kršenja.",
  },
  {
    region: "Sjedinjene Države",
    flag: "🇺🇸",
    code: "US",
    laws: [
      { 
        name: "Computer Fraud and Abuse Act (CFAA)", 
        description: "Federalni zakon o računalnom kriminalu",
        link: "https://www.law.cornell.edu/uscode/text/18/1030"
      },
      { 
        name: "Wiretap Act (18 U.S.C. § 2511)", 
        description: "Federalni zakon o prisluškivanju",
        link: "https://www.law.cornell.edu/uscode/text/18/2511"
      },
      { 
        name: "ECPA", 
        description: "Electronic Communications Privacy Act",
        link: "https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285"
      },
      { 
        name: "Stored Communications Act", 
        description: "Zaštita pohranjenih elektroničkih komunikacija"
      },
    ],
    penalties: [
      { offense: "CFAA - prvi prekršaj", penalty: "Do 1 godine zatvora" },
      { offense: "CFAA - teži oblik", penalty: "Do 10 godina zatvora" },
      { offense: "CFAA - ponovljeni", penalty: "Do 20 godina zatvora" },
      { offense: "Wiretap Act kršenje", penalty: "Do 5 godina + $250,000 kazne" },
      { offense: "ECPA kršenje", penalty: "Do 5 godina zatvora" },
    ],
    cases: [
      { name: "United States v. Auernheimer", year: "2012", outcome: "3.5 godine (kasnije poništeno)" },
      { name: "United States v. Swartz", year: "2011", outcome: "Do 35 godina (postupak prekinut)" },
      { name: "United States v. Morris", year: "1989", outcome: "3 godine uvjetno + kazna" },
    ],
    notes: "Različiti zakoni po saveznim državama. California i New York imaju strože propise.",
  },
  {
    region: "Ujedinjeno Kraljevstvo",
    flag: "🇬🇧",
    code: "UK",
    laws: [
      { 
        name: "Computer Misuse Act 1990", 
        description: "Temeljni zakon o računalnom kriminalu",
        link: "https://www.legislation.gov.uk/ukpga/1990/18/contents"
      },
      { 
        name: "Regulation of Investigatory Powers Act", 
        description: "Regulacija prisluškivanja i nadzora",
        link: "https://www.legislation.gov.uk/ukpga/2000/23/contents"
      },
      { 
        name: "Data Protection Act 2018", 
        description: "UK implementacija GDPR-a",
        link: "https://www.legislation.gov.uk/ukpga/2018/12/contents"
      },
      { 
        name: "Investigatory Powers Act 2016", 
        description: "Snoopers' Charter - ovlasti za nadzor"
      },
    ],
    penalties: [
      { offense: "Neovlašteni pristup (Section 1)", penalty: "Do 2 godine zatvora" },
      { offense: "Pristup s namjerom (Section 2)", penalty: "Do 5 godina zatvora" },
      { offense: "Neovlaštena modifikacija (Section 3)", penalty: "Do 10 godina zatvora" },
      { offense: "Ozbiljni napadi (Section 3ZA)", penalty: "Do doživotnog zatvora" },
    ],
    cases: [
      { name: "R v Mudd", year: "2017", outcome: "21 mjesec za DDoS napade" },
      { name: "R v Caffrey", year: "2003", outcome: "Oslobođen (nedostatak dokaza)" },
    ],
    notes: "Post-Brexit, UK više nije pod GDPR-om ali ima slične propise kroz UK GDPR.",
  },
  {
    region: "Njemačka",
    flag: "🇩🇪",
    code: "DE",
    laws: [
      { 
        name: "Strafgesetzbuch § 202a-c", 
        description: "Neovlašteno dohvaćanje podataka",
        link: "https://www.gesetze-im-internet.de/stgb/__202a.html"
      },
      { 
        name: "BDSG (Bundesdatenschutzgesetz)", 
        description: "Federalni zakon o zaštiti podataka"
      },
      { 
        name: "TKG (Telekommunikationsgesetz)", 
        description: "Zakon o telekomunikacijama"
      },
    ],
    penalties: [
      { offense: "Špijuniranje podataka (§202a)", penalty: "Do 3 godine zatvora" },
      { offense: "Presretanje podataka (§202b)", penalty: "Do 2 godine zatvora" },
      { offense: "Priprema za špijuniranje (§202c)", penalty: "Do 2 godine zatvora" },
    ],
    notes: "Njemačka ima stroge zakone o privatnosti. BfDI je nadležna agencija za zaštitu podataka.",
  },
  {
    region: "Francuska",
    flag: "🇫🇷",
    code: "FR",
    laws: [
      { name: "Code pénal Art. 323-1", description: "Neovlašteni pristup IT sustavima", link: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000030939438" },
      { name: "Code pénal Art. 226-1", description: "Povreda privatnosti / snimanje bez pristanka" },
      { name: "Loi Informatique et Libertés", description: "Zakon o informatici i slobodama (CNIL)" },
    ],
    penalties: [
      { offense: "Neovlašteni pristup", penalty: "Do 2 godine + €60,000" },
      { offense: "S uništavanjem podataka", penalty: "Do 3 godine + €100,000" },
      { offense: "Snimanje bez pristanka", penalty: "Do 1 godine + €45,000" },
      { offense: "Protiv države", penalty: "Do 7 godina + €300,000" },
    ],
    cases: [{ name: "Clearview AI", year: "2022", outcome: "CNIL kazna €20M" }, { name: "Google Cookies", year: "2022", outcome: "€150M" }],
    notes: "CNIL je francuska agencija za zaštitu podataka, jedna od najaktivnijih u EU.",
  },
  {
    region: "Italija",
    flag: "🇮🇹",
    code: "IT",
    laws: [
      { name: "Codice Penale art. 615-ter", description: "Neovlašteni pristup informatičkom sustavu" },
      { name: "Codice Penale art. 617-quater", description: "Presretanje elektroničkih komunikacija" },
      { name: "Codice Privacy (D.Lgs. 196/2003)", description: "Garante per la protezione dei dati" },
    ],
    penalties: [
      { offense: "Neovlašteni pristup", penalty: "Do 3 godine zatvora" },
      { offense: "Presretanje komunikacija", penalty: "Do 5 godina" },
      { offense: "Stalkerware/spyware", penalty: "Do 4 godine (art. 617-quater)" },
    ],
    cases: [{ name: "Clearview AI", year: "2022", outcome: "Garante €20M" }],
    notes: "Garante je vrlo aktivan; često prvi u EU kažnjava AI/biometriju.",
  },
  {
    region: "Španjolska",
    flag: "🇪🇸",
    code: "ES",
    laws: [
      { name: "Código Penal art. 197", description: "Otkrivanje tajni i povreda privatnosti" },
      { name: "Código Penal art. 197 bis", description: "Neovlašteni pristup IT sustavima" },
      { name: "LOPDGDD 3/2018", description: "Španjolski GDPR (AEPD)" },
    ],
    penalties: [
      { offense: "Otkrivanje tajni", penalty: "Do 4 godine + €72,000" },
      { offense: "Pristup sustavu", penalty: "Do 2 godine zatvora" },
      { offense: "Pegasus/Catalangate", penalty: "U postupku — istraga Audiencia Nacional" },
    ],
    notes: "AEPD vodi 'Catalangate' istragu o korištenju Pegasusa protiv katalonskih političara.",
  },
  {
    region: "Poljska",
    flag: "🇵🇱",
    code: "PL",
    laws: [
      { name: "Kodeks karny art. 267", description: "Neovlašteni pristup informacijama" },
      { name: "Kodeks karny art. 268", description: "Uništavanje podataka" },
      { name: "Ustawa o ochronie danych osobowych", description: "UODO – poljski GDPR" },
    ],
    penalties: [
      { offense: "Neovlašteni pristup", penalty: "Do 2 godine zatvora" },
      { offense: "Presretanje komunikacija", penalty: "Do 5 godina" },
      { offense: "Pegasus zlouporaba (Sejm istraga 2024)", penalty: "Postupci u tijeku" },
    ],
    notes: "Sejm komisija 2024. ispituje korištenje Pegasusa od strane CBA-e pod PiS vladom.",
  },
  {
    region: "Nizozemska",
    flag: "🇳🇱",
    code: "NL",
    laws: [
      { name: "Wetboek van Strafrecht art. 138ab", description: "Computervredebreuk (računalna provala)" },
      { name: "AVG / UAVG", description: "Autoriteit Persoonsgegevens" },
      { name: "Tw (Telecommunicatiewet)", description: "Zakon o telekomunikacijama" },
    ],
    penalties: [
      { offense: "Računalna provala", penalty: "Do 1 godinu (4 g. ako se kopiraju podaci)" },
      { offense: "Presretanje", penalty: "Do 2 godine" },
    ],
    notes: "AP je vrlo aktivan; nizozemski sudovi često prvi tumače GDPR.",
  },
  {
    region: "Austrija",
    flag: "🇦🇹",
    code: "AT",
    laws: [
      { name: "StGB §118a", description: "Neovlašteni pristup računalnom sustavu" },
      { name: "DSG (Datenschutzgesetz)", description: "Austrijski GDPR" },
      { name: "TKG 2021 §108", description: "Zaštita tajnosti komunikacija" },
    ],
    penalties: [
      { offense: "Neovlašteni pristup", penalty: "Do 6 mjeseci ili €360 dnevno" },
      { offense: "Presretanje (TKG)", penalty: "Do 1 godinu" },
    ],
    cases: [{ name: "DSB v. Google Analytics", year: "2022", outcome: "Korištenje GA proglašeno nezakonitim" }],
    notes: "Prva EU presuda da Google Analytics krši GDPR (Schrems II).",
  },
  {
    region: "Belgija",
    flag: "🇧🇪",
    code: "BE",
    laws: [
      { name: "Code pénal art. 550bis", description: "Hakiranje" },
      { name: "Loi du 30 juillet 2018", description: "APD – belgijski GDPR" },
    ],
    penalties: [
      { offense: "Hakiranje", penalty: "Do 2 godine + €25,000" },
      { offense: "Sa zloupotrebom", penalty: "Do 5 godina" },
    ],
    cases: [{ name: "IAB Europe (TCF)", year: "2022", outcome: "APD proglasio IAB TCF nezakonitim" }],
    notes: "APD je donio presedansku odluku o oglašivačkom TCF okviru.",
  },
  {
    region: "Švedska",
    flag: "🇸🇪",
    code: "SE",
    laws: [
      { name: "Brottsbalken 4 kap. 9c §", description: "Dataintrång (računalna provala)" },
      { name: "Dataskyddslagen", description: "IMY – švedski GDPR" },
    ],
    penalties: [
      { offense: "Dataintrång", penalty: "Do 2 godine" },
      { offense: "Teški oblik", penalty: "Do 6 godina" },
    ],
    notes: "IMY (bivši Datainspektionen) izriče redovne GDPR kazne.",
  },
  {
    region: "Grčka",
    flag: "🇬🇷",
    code: "GR",
    laws: [
      { name: "Poinikos Kodikas art. 370A", description: "Povreda tajnosti komunikacija" },
      { name: "Law 4624/2019", description: "HDPA – grčki GDPR" },
    ],
    penalties: [
      { offense: "Predator/Intellexa zlouporaba", penalty: "Do 10 god. (KP 370A)" },
      { offense: "Neovlašteni pristup", penalty: "Do 5 godina" },
    ],
    cases: [{ name: "Predatorgate", year: "2022", outcome: "EYP (obavještajna) povezana s Intellexom" }],
    notes: "Grčka je epicentar Predator spyware skandala u EU.",
  },
  {
    region: "Češka",
    flag: "🇨🇿",
    code: "CZ",
    laws: [
      { name: "Trestní zákoník §230", description: "Neovlašteni pristup računalnom sustavu" },
      { name: "Zákon č. 110/2019 Sb.", description: "ÚOOÚ – češki GDPR" },
    ],
    penalties: [{ offense: "Pristup sustavu", penalty: "Do 3 godine (8 god. teški oblik)" }],
    notes: "NÚKIB regulira kibernetičku sigurnost u skladu s NIS2.",
  },
];

export const ExtendedJurisdictionInfo = () => {
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect user's country
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ip-api.com/json/?fields=countryCode");
        const data = await response.json();
        setUserCountry(data.countryCode);
      } catch {
        setUserCountry(null);
      }
      setLoading(false);
    };
    detectCountry();
  }, []);

  const getUserJurisdiction = () => {
    if (!userCountry) return null;
    // Map country codes to jurisdictions
    const euCountries = ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"];
    
    if (userCountry === "HR") return "HR";
    if (userCountry === "US") return "US";
    if (userCountry === "GB") return "UK";
    if (userCountry === "DE") return "DE";
    if (userCountry === "FR") return "FR";
    if (euCountries.includes(userCountry)) return "EU";
    return null;
  };

  const userJurisdiction = getUserJurisdiction();
  const userJurisdictionData = jurisdictions.find(j => j.code === userJurisdiction);

  return (
    <section id="laws" className="py-16 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">Jurisdikcije</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pravni Okvir po Regijama
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pregled relevantnih zakona, kazni i sudskih presedana za neovlašteno praćenje
          </p>
        </div>

        {/* User's jurisdiction highlight */}
        {loading ? (
          <div className="flex justify-center mb-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : userJurisdictionData && (
          <Card variant="cyber" className="mb-8 border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">
                  Vaša jurisdikcija: {userJurisdictionData.flag} {userJurisdictionData.region}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Na temelju vaše lokacije, primjenjuju se zakoni {userJurisdictionData.region}. 
                Pogledajte detaljne informacije u nastavku.
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={userJurisdiction || "EU"} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
            {jurisdictions.map((j) => (
              <TabsTrigger
                key={j.code}
                value={j.code}
                className={`px-4 py-2 rounded-lg border transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary ${
                  j.code === userJurisdiction ? "ring-2 ring-primary/50" : ""
                }`}
              >
                <span className="mr-2">{j.flag}</span>
                {j.region}
              </TabsTrigger>
            ))}
          </TabsList>

          {jurisdictions.map((jurisdiction) => (
            <TabsContent key={jurisdiction.code} value={jurisdiction.code}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Laws Card */}
                <Card variant="cyber">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Scale className="w-5 h-5 text-primary" />
                      Relevantni zakoni
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {jurisdiction.laws.map((law, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{law.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{law.description}</p>
                            {law.article && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {law.article}
                              </Badge>
                            )}
                          </div>
                          {law.link && (
                            <a
                              href={law.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Penalties Card */}
                <Card variant="cyber">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Kazne i sankcije
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {jurisdiction.penalties.map((penalty, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                        <span className="text-sm text-foreground">{penalty.offense}</span>
                        <Badge variant="destructive" className="ml-2 whitespace-nowrap">
                          {penalty.penalty}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Cases Card */}
                {jurisdiction.cases && jurisdiction.cases.length > 0 && (
                  <Card variant="cyber" className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="w-5 h-5 text-accent" />
                        Sudski presedani
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {jurisdiction.cases.map((c, i) => (
                          <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                            <p className="font-medium text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Godina: {c.year}</p>
                            <p className="text-sm text-accent mt-2">{c.outcome}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-6 italic text-center">
                * {jurisdiction.notes}
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
