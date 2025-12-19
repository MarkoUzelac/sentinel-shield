import { useState } from "react";
import { Shield, Search, Eye, Phone, Mail, Check, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const services = [
  {
    id: "basic",
    name: "Osnovna Provjera",
    price: "€99",
    duration: "24-48h",
    icon: Search,
    description: "Remote analiza uređaja pomoću MVT alata",
    features: [
      "Analiza Android/iOS uređaja",
      "Provjera poznatih spyware potpisa",
      "Pregled sumnjivih aplikacija",
      "Pisani izvještaj s preporukama",
    ],
    recommended: false,
  },
  {
    id: "advanced",
    name: "Napredna Forenzika",
    price: "€299",
    duration: "3-5 dana",
    icon: Eye,
    description: "Dubinska analiza s forenzičkim alatima",
    features: [
      "Sve iz Osnovne provjere",
      "Analiza mrežnog prometa",
      "Provjera DNS leak i tracking",
      "Pregled sistemskih logova",
      "Detaljan tehnički izvještaj",
      "30-minutna konzultacija",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium Zaštita",
    price: "€599/god",
    duration: "Kontinuirano",
    icon: Shield,
    description: "Kontinuirano praćenje i hitna podrška",
    features: [
      "Sve iz Napredne forenzike",
      "Kvartalna sigurnosna provjera",
      "24/7 hitna podrška",
      "Prioritetni odgovor (< 2h)",
      "Personalizirani sigurnosni plan",
      "VPN + enkriptirane komunikacije setup",
    ],
    recommended: false,
  },
];

export const ProfessionalServices = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deviceType: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: "Odaberite uslugu",
        description: "Molimo odaberite jednu od ponuđenih usluga.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate form submission (would go to backend in production)
    await new Promise(r => setTimeout(r, 1500));
    
    toast({
      title: "Zahtjev poslan!",
      description: "Kontaktirat ćemo vas u roku 24 sata.",
    });
    
    setSubmitting(false);
    setFormData({ name: "", email: "", phone: "", deviceType: "", description: "" });
    setSelectedService(null);
  };

  return (
    <section id="services" className="py-16 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">SecHub Shield</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Profesionalna Detekcija i Zaštita
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sumnjate da vas netko prati ili prisluškuje? Naši stručnjaci koriste iste alate
            kao i Amnesty International za forenzičku analizu vaših uređaja.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">EU-Based</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">100% Diskrecija</span>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <Card
              key={service.id}
              variant="cyber"
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedService === service.id
                  ? "ring-2 ring-primary shadow-[0_0_30px_hsl(175_80%_50%/0.2)]"
                  : "hover:-translate-y-1"
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              {service.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Preporučeno
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{service.price}</span>
                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                </div>
                
                <ul className="text-left space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={selectedService === service.id ? "cyber" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service.id);
                  }}
                >
                  {selectedService === service.id ? "Odabrano" : "Odaberi"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card variant="cyber" className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Zatražite konzultaciju
            </CardTitle>
            <CardDescription>
              Popunite formu i javit ćemo vam se u roku 24 sata. Sve informacije su strogo povjerljive.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Ime i prezime *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Vaše ime"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vas@email.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Telefon</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+385..."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tip uređaja *</label>
                  <Input
                    required
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    placeholder="Android, iPhone, Laptop..."
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Opis problema *</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Opišite što ste primijetili (neuobičajeno ponašanje uređaja, sumnja na praćenje, itd.)"
                  rows={4}
                />
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    Vaši podaci su zaštićeni enkripcijom i koriste se isključivo za obradu vašeg zahtjeva
                    u skladu s GDPR-om.
                  </p>
                </div>
              </div>
              
              <Button type="submit" variant="cyber" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Slanje...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Pošalji zahtjev
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
