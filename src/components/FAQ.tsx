import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Kako mogu znati prati li me netko?",
    answer: "Postoji nekoliko znakova: neuobičajeno brzo pražnjenje baterije, zagrijavanje uređaja bez korištenja, čudni zvukovi tijekom poziva, nepoznate aplikacije, te porast potrošnje mobilnih podataka. Koristite naš kviz za procjenu rizika i alate poput MVT-a za detaljnu provjeru."
  },
  {
    question: "Što je Pegasus i trebam li se brinuti?",
    answer: "Pegasus je napredni spyware izraelske tvrtke NSO Group koji koriste isključivo državne agencije. Može zaraziti uređaj bez ikakve interakcije korisnika (zero-click). Prosječni korisnici nisu meta, ali novinari, aktivisti i političari mogu biti izloženi. MVT alat može detektirati tragove Pegasusa."
  },
  {
    question: "Jesu li open-source alati s ove stranice legalni?",
    answer: "Alati sami po sebi su legalni za posjedovanje i proučavanje u edukativne svrhe. Međutim, korištenje alata poput IMSI catchera za presretanje tuđih komunikacija bez ovlaštenja je KAZNENO DJELO u svim jurisdikcijama. Defenzivni alati (AIMSICD, MVT) su potpuno legalni za korištenje."
  },
  {
    question: "Kako se zaštititi od praćenja?",
    answer: "Redovito ažurirajte operativni sustav, koristite 2FA, izbjegavajte javne WiFi mreže bez VPN-a, ne klikajte na sumnjive linkove, provjerite dozvole aplikacija, koristite enkriptirane komunikacijske aplikacije (Signal), i redovito provjeravajte uređaj s alatima poput AIMSICD-a."
  },
  {
    question: "Što učiniti ako sumnjam da sam hakiran?",
    answer: "Prvo, ne paničarite. Koristite naš kviz za procjenu rizika. Ako rezultati pokazuju visok rizik, kontaktirajte naš tim za profesionalnu provjeru ili sami pokrenite MVT skeniranje. U međuvremenu, izbjegavajte osjetljive razgovore na tom uređaju."
  },
  {
    question: "Koliko košta profesionalna provjera?",
    answer: "Naša Osnovna provjera počinje od €99 i uključuje remote analizu uređaja s MVT alatom. Napredna forenzika košta €299 i uključuje dubinsku analizu mrežnog prometa i sistemskih logova. Za kontinuirano praćenje, Premium paket košta €599 godišnje."
  },
  {
    question: "Što je IMSI catcher i kako radi?",
    answer: "IMSI catcher (poznat i kao Stingray) je uređaj koji simulira baznu stanicu mobilnog operatera. Mobiteli u blizini se automatski spajaju na njega, omogućujući presretanje poziva, poruka i praćenje lokacije. Policija ih koristi s nalogom, ali postoje i ilegalne verzije."
  },
  {
    question: "Mogu li se zaštititi od IMSI catchera?",
    answer: "Potpuna zaštita je teška jer je IMSI catcher na razini mreže. Možete koristiti detekcijske alate (AIMSICD, Rayhunter), koristiti 4G/5G umjesto 2G kada je moguće, te koristiti enkriptirane aplikacije za osjetljive komunikacije koje štite sadržaj čak i ako je signal presretnut."
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="cyber" className="mb-4">FAQ</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Često Postavljana Pitanja
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Odgovori na najčešća pitanja o mobilnoj sigurnosti i zaštiti privatnosti
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg bg-card px-4 md:px-6 data-[state=open]:shadow-[0_0_20px_hsl(175_80%_50%/0.1)]"
            >
              <AccordionTrigger className="hover:no-underline py-3 md:py-4">
                <div className="flex items-center gap-2 md:gap-3 text-left">
                  <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base text-foreground">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground pb-3 md:pb-4 pl-6 md:pl-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
