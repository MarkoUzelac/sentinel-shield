import { Check, X, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Besplatno",
    price: "€0",
    period: "zauvijek",
    icon: Zap,
    description: "Za osnovne korisnike",
    features: [
      { name: "Pristup open-source alatima", included: true },
      { name: "Speed test (1x dnevno)", included: true },
      { name: "Procjena rizika (osnovni kviz)", included: true },
      { name: "Pregled zakona", included: true },
      { name: "Napredna forenzička analiza", included: false },
      { name: "Priority podrška", included: false },
      { name: "API pristup", included: false },
    ],
    cta: "Trenutni plan",
    disabled: true,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "€9.99",
    period: "/mjesec",
    icon: Shield,
    description: "Za profesionalce i istraživače",
    features: [
      { name: "Sve iz Besplatnog plana", included: true },
      { name: "Neograničeni speed testovi", included: true },
      { name: "Detaljna forenzička analiza", included: true },
      { name: "Vodič za instalaciju alata", included: true },
      { name: "Email podrška (24h odgovor)", included: true },
      { name: "Izvoz izvještaja (PDF)", included: true },
      { name: "API pristup", included: false },
    ],
    cta: "Započni Pro",
    disabled: false,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "€49.99",
    period: "/mjesec",
    icon: Crown,
    description: "Za tvrtke i organizacije",
    features: [
      { name: "Sve iz Pro plana", included: true },
      { name: "White-label izvještaji", included: true },
      { name: "API pristup (10k req/mj)", included: true },
      { name: "Dedicirani account manager", included: true },
      { name: "Priority podrška (1h odgovor)", included: true },
      { name: "Trening za tim (2h)", included: true },
      { name: "Custom integracije", included: true },
    ],
    cta: "Kontaktiraj nas",
    disabled: false,
    popular: false,
  },
];

export const SubscriptionPlans = () => {
  const { toast } = useToast();

  const handlePlanSelect = (planId: string) => {
    toast({
      title: "Plaćanje trenutno nije dostupno",
      description: "Za aktivaciju plana, omogućite Lovable Cloud i Stripe integraciju.",
    });
  };

  return (
    <section id="pricing" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">Pretplate</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Odaberite Pravi Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Od besplatnog pristupa do enterprise rješenja - pronađite plan koji odgovara vašim potrebama
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              variant="cyber"
              className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Najpopularnije
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <plan.icon className={`w-7 h-7 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? "cyber" : "outline"}
                  className="w-full"
                  disabled={plan.disabled}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Sve cijene su u EUR i ne uključuju PDV. Otkazivanje moguće u bilo kojem trenutku.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Sigurno plaćanje</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-success" />
              <span>30-dana garancija povrata</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
