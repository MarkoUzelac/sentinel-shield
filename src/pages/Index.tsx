import { HeroSection } from "@/components/HeroSection";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { ToolCategories } from "@/components/ToolCategories";
import { ToolComparison } from "@/components/ToolComparison";
import { ThreatAssessment } from "@/components/ThreatAssessment";
import { JurisdictionInfo } from "@/components/JurisdictionInfo";
import { Shield, Github, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono font-bold text-foreground">SecHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Alati
              </a>
              <a href="#comparison" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Usporedba
              </a>
              <a href="#assessment" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Procjena
              </a>
              <a href="#laws" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Zakoni
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">
        <HeroSection />
        
        <LegalDisclaimer />
        
        <div id="tools">
          <ToolCategories />
        </div>
        
        <div id="comparison">
          <ToolComparison />
        </div>
        
        <div id="assessment">
          <ThreatAssessment />
        </div>
        
        <div id="laws">
          <JurisdictionInfo />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-mono font-bold text-foreground">SecHub</span>
                <p className="text-xs text-muted-foreground">Edukativna platforma</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Napravljeno s <Heart className="w-4 h-4 text-destructive" /> za sigurnosnu zajednicu
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors group"
              >
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © 2025 SecHub. Svi podaci su javno dostupni. Korištenje alata za ilegalne svrhe nije podržano.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
