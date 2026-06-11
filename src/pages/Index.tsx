import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { NetworkSpeedTest } from "@/components/NetworkSpeedTest";
import { ToolCategories } from "@/components/ToolCategories";
import { ToolComparison } from "@/components/ToolComparison";
import { ThreatAssessment } from "@/components/ThreatAssessment";
import { ProfessionalServices } from "@/components/ProfessionalServices";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { ExtendedJurisdictionInfo } from "@/components/ExtendedJurisdictionInfo";
import { FAQ } from "@/components/FAQ";
import { Newsletter } from "@/components/Newsletter";
import { CookieConsent } from "@/components/CookieConsent";
import { AboutProviders } from "@/components/AboutProviders";
import { SurveillanceSources } from "@/components/SurveillanceSources";
import { Shield, Github, Heart, Mail, Phone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        <HeroSection />
        <LegalDisclaimer />
        
        <div id="speedtest">
          <NetworkSpeedTest />
        </div>
        
        <div id="tools">
          <ToolCategories />
        </div>
        
        <div id="comparison">
          <ToolComparison />
        </div>
        
        <div id="assessment">
          <ThreatAssessment />
        </div>
        
        <AboutProviders />
        <SurveillanceSources />
        <ProfessionalServices />
        <SubscriptionPlans />
        <ExtendedJurisdictionInfo />
        <FAQ />
        <Newsletter />
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-border bg-card/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-mono font-bold text-foreground">SecHub</span>
                  <span className="text-xs text-primary ml-2">Pro</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Vodeća platforma za edukaciju o mobilnoj sigurnosti i profesionalnu 
                zaštitu od digitalnog nadzora. GDPR compliant, EU-based.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
              <div className="space-y-2">
                <a href="mailto:info@sechub.pro" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  info@sechub.pro
                </a>
                <a href="tel:+385991234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  +385 99 123 4567
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Poveznice</h4>
              <div className="space-y-2">
                <a href="#services" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Usluge
                </a>
                <a href="#pricing" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cijene
                </a>
                <a href="#faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
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
            
            <p className="text-xs text-muted-foreground">
              © 2025 SecHub Pro. Svi podaci su javno dostupni.
            </p>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Index;
