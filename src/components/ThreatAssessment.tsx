import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Primjećujete li neuobičajeno brzo pražnjenje baterije?",
    options: [
      { text: "Da, drastično", score: 3 },
      { text: "Ponekad", score: 1 },
      { text: "Ne", score: 0 },
    ],
  },
  {
    id: 2,
    text: "Zagrijava li se uređaj bez očitog razloga?",
    options: [
      { text: "Da, često", score: 3 },
      { text: "Ponekad", score: 1 },
      { text: "Ne", score: 0 },
    ],
  },
  {
    id: 3,
    text: "Primjećujete li neobične zvukove tijekom poziva?",
    options: [
      { text: "Da, klikovi/šumovi", score: 3 },
      { text: "Rijetko", score: 1 },
      { text: "Ne", score: 0 },
    ],
  },
  {
    id: 4,
    text: "Dobivate li nepoznate SMS poruke s čudnim znakovima?",
    options: [
      { text: "Da", score: 3 },
      { text: "Jednom se dogodilo", score: 1 },
      { text: "Ne", score: 0 },
    ],
  },
  {
    id: 5,
    text: "Imate li pristup osjetljivim informacijama (novinar, aktivist, političar)?",
    options: [
      { text: "Da, visoko osjetljivim", score: 3 },
      { text: "Djelomično", score: 2 },
      { text: "Ne", score: 0 },
    ],
  },
];

export const ThreatAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getTotalScore = () => answers.reduce((a, b) => a + b, 0);

  const getResult = () => {
    const score = getTotalScore();
    if (score >= 10) {
      return {
        level: "high",
        title: "Visok rizik",
        description: "Preporučujemo detaljnu provjeru uređaja s MVT alatom i konzultacije sa sigurnosnim stručnjakom.",
        icon: AlertTriangle,
        color: "text-destructive",
        actions: ["Pokrenite MVT skeniranje", "Kontaktirajte Amnesty Tech", "Razmislite o novom uređaju"],
      };
    } else if (score >= 5) {
      return {
        level: "medium",
        title: "Srednji rizik",
        description: "Postoje određeni indikatori. Preporučujemo instalaciju AIMSICD i praćenje aktivnosti.",
        icon: HelpCircle,
        color: "text-accent",
        actions: ["Instalirajte AIMSICD", "Pratite potrošnju baterije", "Provjerite dozvole aplikacija"],
      };
    }
    return {
      level: "low",
      title: "Nizak rizik",
      description: "Nema značajnih indikatora praćenja. Nastavite s osnovnim sigurnosnim praksama.",
      icon: CheckCircle,
      color: "text-success",
      actions: ["Redovito ažurirajte sustav", "Koristite 2FA", "Izbjegavajte sumnjive linkove"],
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">Procjena</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Procjena Rizika od Praćenja
          </h2>
          <p className="text-muted-foreground">
            Odgovorite na nekoliko pitanja kako biste procijenili potencijalnu izloženost nadzoru
          </p>
        </div>

        <Card variant="cyber" className="overflow-hidden">
          {!showResult ? (
            <>
              <CardHeader className="border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Pitanje {currentQuestion + 1} od {questions.length}
                  </CardTitle>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i < currentQuestion
                            ? "bg-primary"
                            : i === currentQuestion
                            ? "bg-primary animate-pulse"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-xl text-foreground mb-8">
                  {questions[currentQuestion].text}
                </p>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-4 px-6"
                      onClick={() => handleAnswer(option.score)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8">
              {(() => {
                const result = getResult();
                const ResultIcon = result.icon;
                return (
                  <div className="text-center space-y-6">
                    <div className={`inline-flex p-4 rounded-full bg-secondary ${result.color}`}>
                      <ResultIcon className="w-12 h-12" />
                    </div>
                    
                    <div>
                      <Badge 
                        variant={
                          result.level === "high" ? "destructive" : 
                          result.level === "medium" ? "warning" : "success"
                        }
                        className="mb-3"
                      >
                        {result.title}
                      </Badge>
                      <p className="text-muted-foreground">{result.description}</p>
                    </div>

                    <div className="text-left bg-secondary/50 rounded-lg p-6">
                      <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-3">
                        Preporučene akcije:
                      </p>
                      <ul className="space-y-2">
                        {result.actions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="cyber" onClick={resetQuiz}>
                      Ponovi procjenu
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          )}
        </Card>
      </div>
    </section>
  );
};
