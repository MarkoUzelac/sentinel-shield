import { Shield, Lock, Zap, CheckCircle, Users, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-noise" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      {/* Floating elements - hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-10 animate-float opacity-20">
        <Shield className="w-16 h-16 text-primary" />
      </div>
      <div className="hidden md:block absolute bottom-20 right-10 animate-float opacity-20" style={{ animationDelay: "2s" }}>
        <Lock className="w-12 h-12 text-primary" />
      </div>
      <div className="hidden md:block absolute top-40 right-20 animate-float opacity-20" style={{ animationDelay: "4s" }}>
        <Zap className="w-10 h-10 text-accent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Badge variant="cyber" className="mb-4 md:mb-6 animate-glow-pulse text-xs md:text-sm">
          <Shield className="w-3 h-3 mr-1" />
          Vaš Partner za Digitalnu Sigurnost
        </Badge>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
          Dobrodošli u
          <br />
          <span className="text-gradient-primary glow-text">SecHub Pro</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
          Vaša privatnost je naš prioritet. SecHub je vodeća platforma za 
          edukaciju o mobilnoj sigurnosti i profesionalnu zaštitu od digitalnog nadzora.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 md:mb-8 px-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Open-source alati</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-accent" />
            <span>EU-Based</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
            <Headphones className="w-4 h-4 text-primary" />
            <span>24/7 Podrška</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
          <Button variant="cyber" size="lg" asChild className="w-full sm:w-auto">
            <a href="#tools">
              Istraži alate
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <a href="#services">
              Profesionalne usluge
            </a>
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-8 md:mt-12 text-sm md:text-base text-primary/80 italic font-medium">
          "Osjećajte se sigurno u digitalnom svijetu."
        </p>

        {/* Terminal-style decoration - simplified on mobile */}
        <div className="mt-8 md:mt-16 p-3 md:p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm max-w-lg mx-auto text-left">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-success" />
          </div>
          <div className="font-mono text-xs md:text-sm space-y-1">
            <p className="text-muted-foreground">
              <span className="text-primary">$</span> ./sechub --init
            </p>
            <p className="text-success">
              ✓ Sigurnosna analiza spremna
            </p>
            <p className="text-success">
              ✓ Zaštita privatnosti aktivna
            </p>
            <p className="text-foreground">
              <span className="text-primary">$</span> <span className="animate-pulse">_</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
