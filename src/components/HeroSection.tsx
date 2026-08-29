import { ArrowRight, CheckCircle, Shield, Users, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "WEB", label: "Trenutni klijent" },
  { value: "EVIDENCE", label: "Pristup podacima" },
  { value: "HTTPS", label: "Mrežni izvori" },
];

export const HeroSection = () => (
  <section className="relative overflow-hidden border-b border-border">
    <div className="absolute inset-0 bg-grid opacity-60" />
    <div className="absolute inset-0 bg-noise" />
    <div className="absolute -top-40 -left-40 w-[700px] h-[700px]" style={{ background: "var(--gradient-glow)" }} />
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <p className="label-mono mb-5">Digitalna sigurnost / 01</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.92] tracking-tighter text-foreground">Saznaj što<br />možeš dokazati.<br /><span className="text-outline">Bez izmišljanja.</span></h1>
          <p className="mt-6 md:mt-8 font-mono text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">Sentinel Shield prikazuje stvarne mrežne dokaze kada su dostupni i jasno označava svaki nedostupni izvor.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button variant="cyber" size="lg" asChild className="w-full sm:w-auto"><a href="#assessment">Pokreni procjenu<ArrowRight className="w-4 h-4 ml-2" /></a></Button>
            <a href="#tools" className="font-mono text-xs uppercase tracking-[0.18em] text-foreground border-b border-primary pb-1 self-start sm:self-auto hover:text-primary transition-colors">Pregledaj alate</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {[
              { icon: CheckCircle, text: "Evidence-first" },
              { icon: Shield, text: "Bez mock rezultata" },
              { icon: Users, text: "Web klijent" },
              { icon: Headphones, text: "Jasni statusi izvora" },
            ].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-2"><Icon className="w-4 h-4 text-primary" /><span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{text}</span></div>)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="border border-border bg-card/70 backdrop-blur-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4"><div className="w-2.5 h-2.5 rounded-full bg-destructive" /><div className="w-2.5 h-2.5 rounded-full bg-warning" /><div className="w-2.5 h-2.5 rounded-full bg-primary" /><span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">sentinel — evidence</span></div>
            <div className="font-mono text-xs md:text-sm space-y-1.5"><p className="text-muted-foreground"><span className="text-primary">$</span> ./sentinel --status</p><p className="text-primary">✓ Evidence pipeline ready</p><p className="text-primary">✓ No synthetic security results</p><p className="text-muted-foreground"><span className="text-primary">$</span> ./sentinel --scan network</p><p className="text-foreground"><span className="text-primary">$</span> _</p></div>
          </div>
          <div className="grid grid-cols-3 border border-border bg-card/70 backdrop-blur-sm divide-x divide-border">{stats.map((s) => <div key={s.label} className="p-4 text-center"><p className="text-xl md:text-2xl font-extrabold text-foreground">{s.value}</p><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1">{s.label}</p></div>)}</div>
        </div>
      </div>
    </div>
  </section>
);
