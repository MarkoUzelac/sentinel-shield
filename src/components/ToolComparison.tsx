import { ExternalLink, Github, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Tool {
  name: string;
  category: string;
  type: "offensive" | "defensive" | "osint" | "legal";
  hardware: string;
  github?: string;
  website?: string;
  legalRisk: "high" | "medium" | "low";
  description: string;
}

const tools: Tool[] = [
  {
    name: "simple-IMSI-catcher.py",
    category: "IMSI Catcher",
    type: "offensive",
    hardware: "RTL-SDR (~20€)",
    github: "https://github.com/Oros42/IMSI-catcher",
    legalRisk: "high",
    description: "Python alat za prikaz IMSI brojeva mobitela u blizini",
  },
  {
    name: "X3RX3SSec IMSI_Catcher",
    category: "IMSI Catcher",
    type: "offensive",
    hardware: "RTL-SDR",
    github: "https://github.com/X3RX3SSec/IMSI_Catcher",
    legalRisk: "high",
    description: "Pasivni sniffer s web dashboardom",
  },
  {
    name: "AIMSICD",
    category: "Detektor",
    type: "defensive",
    hardware: "Android uređaj",
    github: "https://github.com/CellularPrivacy/Android-IMSI-Catcher-Detector",
    legalRisk: "low",
    description: "Android app za detekciju StingRay i silent SMS-ova",
  },
  {
    name: "Rayhunter",
    category: "Detektor",
    type: "defensive",
    hardware: "Mobilni hotspot",
    website: "https://www.eff.org/deeplinks/2025/03/meet-rayhunter-new-open-source-tool-eff-detect-cellular-spying",
    legalRisk: "low",
    description: "EFF-ov alat za detekciju cell-site simulatora",
  },
  {
    name: "OpenCellID",
    category: "Triangulacija",
    type: "osint",
    hardware: "Nije potreban",
    website: "https://opencellid.org/",
    legalRisk: "low",
    description: "Najveća open baza podataka o baznim stanicama",
  },
  {
    name: "MVT",
    category: "Forenzika",
    type: "defensive",
    hardware: "Računalo",
    github: "https://github.com/mvt-project/mvt",
    legalRisk: "low",
    description: "Mobile Verification Toolkit za detekciju Pegasusa",
  },
  {
    name: "ExifTool",
    category: "OSINT",
    type: "osint",
    hardware: "Računalo",
    website: "https://exiftool.org/",
    legalRisk: "low",
    description: "Ekstrakcija metadata iz slika/video/dokumenata",
  },
  {
    name: "OpenLI",
    category: "Lawful Interception",
    type: "legal",
    hardware: "Server infrastruktura",
    github: "https://github.com/OpenLI-NZ/openli",
    legalRisk: "medium",
    description: "ETSI-kompatibilni sustav za operatore",
  },
];

const getRiskBadge = (risk: string) => {
  switch (risk) {
    case "high":
      return <Badge variant="destructive">Visok rizik</Badge>;
    case "medium":
      return <Badge variant="warning">Srednji</Badge>;
    case "low":
      return <Badge variant="success">Nizak</Badge>;
    default:
      return null;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "offensive":
      return <Badge variant="destructive">Ofenzivni</Badge>;
    case "defensive":
      return <Badge variant="success">Defenzivni</Badge>;
    case "osint":
      return <Badge variant="cyber">OSINT</Badge>;
    case "legal":
      return <Badge variant="warning">Zakonski</Badge>;
    default:
      return null;
  }
};

export const ToolComparison = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyber" className="mb-4">Usporedba</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Detaljna Usporedba Alata
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interaktivna tablica s pregledom svih alata, njihovih karakteristika i pravnog rizika
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Alat
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Kategorija
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Tip
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Hardware
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Pravni rizik
                </th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Linkovi
                </th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool, index) => (
                <tr 
                  key={index}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground font-mono text-sm">
                        {tool.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {tool.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {getTypeBadge(tool.type)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground font-mono">
                      {tool.hardware}
                    </span>
                  </td>
                  <td className="p-4">
                    {getRiskBadge(tool.legalRisk)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {tool.github && (
                        <a 
                          href={tool.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-secondary transition-colors group"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {tool.website && (
                        <a 
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-secondary transition-colors group"
                          title="Website"
                        >
                          <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
