import { Shield, Terminal, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-noise" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float opacity-20">
        <Shield className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float opacity-20" style={{ animationDelay: "2s" }}>
        <Lock className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-40 right-20 animate-float opacity-20" style={{ animationDelay: "4s" }}>
        <Zap className="w-10 h-10 text-accent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Badge variant="cyber" className="mb-6 animate-glow-pulse">
          <Terminal className="w-3 h-3 mr-1" />
          Open-Source Security Tools
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Mobile Security
          <br />
          <span className="text-gradient-primary glow-text">Resource Hub</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Edukativna platforma za razumijevanje alata za mobilnu sigurnost, 
          detekciju prijetnji i zaštitu privatnosti.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="cyber" size="lg" asChild>
            <a href="#tools">
              Istraži alate
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#assessment">
              Procjena rizika
            </a>
          </Button>
        </div>

        {/* Terminal-style decoration */}
        <div className="mt-16 p-4 rounded-lg bg-card/50 border border-border backdrop-blur-sm max-w-lg mx-auto text-left">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>
          <div className="font-mono text-sm space-y-1">
            <p className="text-muted-foreground">
              <span className="text-primary">$</span> ./check_security --mode=educational
            </p>
            <p className="text-success">
              ✓ Loading open-source tools database...
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
