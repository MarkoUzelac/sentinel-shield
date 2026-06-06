import { useState } from "react";
import { z } from "zod";
import { Mail, Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email je obavezan" })
  .email({ message: "Neispravan email" })
  .max(255, { message: "Email mora biti kraći od 255 znakova" });

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Neispravan unos",
        description: result.error.issues[0]?.message ?? "Provjerite email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    
    setLoading(false);
    setSubmitted(true);
    setEmail("");
    
    toast({
      title: "Uspješno ste se prijavili!",
      description: "Dobivat ćete sigurnosne vijesti i savjete na vaš email.",
    });
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/20 p-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Sigurnosne Vijesti
            </h3>
            <p className="text-muted-foreground mb-6">
              Prijavite se za tjedni newsletter s najnovijim sigurnosnim prijetnjama, 
              savjetima i novostima iz svijeta kibernetičke sigurnosti.
            </p>
            
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-success">
                <Check className="w-5 h-5" />
                <span>Hvala na prijavi!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="vas@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" variant="cyber" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            )}
            
            <p className="text-xs text-muted-foreground mt-4">
              Bez spama. Otkazivanje u bilo kojem trenutku.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
