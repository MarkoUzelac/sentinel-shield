import { useEffect, useState } from "react";
import {
  Wifi,
  Download,
  Upload,
  Clock,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Radio,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SpeedResult {
  download: number;
  upload: number;
  latency: number;
  jitter: number;
}

interface LocationData {
  ip: string;
  city: string;
  country: string;
  countryCode: string;
  isp: string;
  timezone: string;
  vpn: boolean;
  proxy: boolean;
  lat?: number;
  lon?: number;
}

interface NetworkOperator {
  name: string;
  mcc: string;
  mnc: string;
  technology: string[];
}

// This is a country registry, not a claim about the operator currently serving the device.
const operatorsByCountry: Record<string, NetworkOperator[]> = {
  HR: [
    { name: "Hrvatski Telekom", mcc: "219", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "A1 Hrvatska", mcc: "219", mnc: "10", technology: ["5G", "4G", "3G"] },
    { name: "Telemach Hrvatska", mcc: "219", mnc: "02", technology: ["5G", "4G"] },
  ],
  DE: [
    { name: "Telekom Deutschland", mcc: "262", mnc: "01", technology: ["5G", "4G"] },
    { name: "Vodafone D2", mcc: "262", mnc: "02", technology: ["5G", "4G"] },
    { name: "O2 (Telefónica)", mcc: "262", mnc: "03", technology: ["5G", "4G"] },
    { name: "1&1", mcc: "262", mnc: "23", technology: ["5G", "4G"] },
  ],
  US: [
    { name: "Verizon Wireless", mcc: "311", mnc: "480", technology: ["5G", "4G LTE"] },
    { name: "AT&T Mobility", mcc: "310", mnc: "410", technology: ["5G", "4G LTE"] },
    { name: "T-Mobile US", mcc: "310", mnc: "260", technology: ["5G", "4G LTE"] },
  ],
  GB: [
    { name: "EE", mcc: "234", mnc: "30", technology: ["5G", "4G"] },
    { name: "O2 UK", mcc: "234", mnc: "10", technology: ["5G", "4G"] },
    { name: "Vodafone UK", mcc: "234", mnc: "15", technology: ["5G", "4G"] },
    { name: "Three UK", mcc: "234", mnc: "20", technology: ["5G", "4G"] },
  ],
  FR: [
    { name: "Orange France", mcc: "208", mnc: "01", technology: ["5G", "4G"] },
    { name: "SFR", mcc: "208", mnc: "10", technology: ["5G", "4G"] },
    { name: "Bouygues Telecom", mcc: "208", mnc: "20", technology: ["5G", "4G"] },
    { name: "Free Mobile", mcc: "208", mnc: "15", technology: ["5G", "4G"] },
  ],
};

const downloadTest = async (bytes: number): Promise<number> => {
  const started = performance.now();
  const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${bytes}`, {
    cache: "no-store",
    credentials: "omit",
  });
  if (!response.ok) throw new Error(`Download probe failed: ${response.status}`);
  const data = await response.arrayBuffer();
  const seconds = (performance.now() - started) / 1000;
  if (data.byteLength === 0 || seconds <= 0) throw new Error("Empty download measurement");
  return (data.byteLength * 8) / seconds / 1_000_000;
};

const uploadTest = async (bytes: number): Promise<number> => {
  const payload = new Uint8Array(bytes);
  crypto.getRandomValues(payload);
  const started = performance.now();
  const response = await fetch("https://speed.cloudflare.com/__up", {
    method: "POST",
    body: payload,
    cache: "no-store",
    credentials: "omit",
  });
  if (!response.ok) throw new Error(`Upload probe failed: ${response.status}`);
  const seconds = (performance.now() - started) / 1000;
  if (seconds <= 0) throw new Error("Invalid upload measurement");
  return (bytes * 8) / seconds / 1_000_000;
};

export const NetworkSpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState("");
  const [results, setResults] = useState<SpeedResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [webrtcLeak, setWebrtcLeak] = useState<boolean | null>(null);
  const [operators, setOperators] = useState<NetworkOperator[]>([]);

  useEffect(() => {
    void fetchLocation();
    void checkWebRTCLeak();
  }, []);

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      const response = await fetch(
        "https://ip-api.com/json/?fields=status,message,country,countryCode,city,isp,query,timezone,proxy,hosting,lat,lon",
        { cache: "no-store", credentials: "omit" },
      );
      const data = await response.json();
      if (data.status !== "success") throw new Error(data.message || "IP geolocation unavailable");

      const locData: LocationData = {
        ip: data.query,
        city: data.city || "Nepoznato",
        country: data.country || "Nepoznato",
        countryCode: data.countryCode || "",
        isp: data.isp || "Nepoznato",
        timezone: data.timezone || "",
        vpn: Boolean(data.hosting),
        proxy: Boolean(data.proxy),
        lat: data.lat,
        lon: data.lon,
      };
      setLocation(locData);
      setOperators(operatorsByCountry[data.countryCode] || []);
    } catch (error) {
      console.error("IP geolocation unavailable:", error);
      setLocation(null);
      setOperators([]);
    } finally {
      setLocationLoading(false);
    }
  };

  const checkWebRTCLeak = async () => {
    if (!window.RTCPeerConnection) {
      setWebrtcLeak(null);
      return;
    }

    let foundPublicCandidate = false;
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      pc.createDataChannel("");
      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const candidate = event.candidate.candidate;
        const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
        if (match?.[1] && !match[1].startsWith("0.")) foundPublicCandidate = true;
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      pc.close();
      setWebrtcLeak(foundPublicCandidate);
    } catch (error) {
      console.error("WebRTC audit unavailable:", error);
      setWebrtcLeak(null);
    }
  };

  const runSpeedTest = async () => {
    setTesting(true);
    setProgress(0);
    setResults(null);
    setTestError(null);

    try {
      setCurrentTest("Mjerenje latencije...");
      const latencies: number[] = [];
      for (let i = 0; i < 5; i += 1) {
        const started = performance.now();
        const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
          cache: "no-store",
          credentials: "omit",
        });
        if (!response.ok) throw new Error(`Latency probe failed: ${response.status}`);
        latencies.push(performance.now() - started);
        setProgress(5 + i * 5);
      }
      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const jitter = Math.sqrt(
        latencies.reduce((acc, latency) => acc + Math.pow(latency - avgLatency, 2), 0) / latencies.length,
      );

      setCurrentTest("Stvarno mjerenje brzine preuzimanja...");
      const downloadMeasurements: number[] = [];
      for (let i = 0; i < 2; i += 1) {
        downloadMeasurements.push(await downloadTest(5_000_000));
        setProgress(30 + (i + 1) * 15);
      }
      const download = downloadMeasurements.reduce((a, b) => a + b, 0) / downloadMeasurements.length;

      setCurrentTest("Stvarno mjerenje brzine učitavanja...");
      setProgress(70);
      const uploadMeasurements: number[] = [];
      for (let i = 0; i < 2; i += 1) {
        uploadMeasurements.push(await uploadTest(2_000_000));
        setProgress(70 + (i + 1) * 10);
      }
      const upload = uploadMeasurements.reduce((a, b) => a + b, 0) / uploadMeasurements.length;

      setCurrentTest("Završna provjera mjerenja...");
      setProgress(100);
      setResults({ download, upload, latency: avgLatency, jitter });
    } catch (error) {
      console.error("Speed test unavailable:", error);
      setTestError("Test nije moguće dovršiti. Nema lažnog rezultata: pokušajte ponovno kada su testni endpointi dostupni.");
    } finally {
      setTesting(false);
      setCurrentTest("");
    }
  };

  const getSpeedRating = (speed: number) => {
    if (speed >= 100) return { label: "Odlično", color: "text-success" };
    if (speed >= 50) return { label: "Dobro", color: "text-primary" };
    if (speed >= 20) return { label: "Prosječno", color: "text-accent" };
    return { label: "Sporo", color: "text-destructive" };
  };

  return (
    <section id="speedtest" className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="cyber" className="mb-4">Dijagnostika</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Mrežna Sigurnost i Brzina</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Samo stvarno izmjereni rezultati. Ako izvor podataka nije dostupan, Sentinel Shield prikazuje UNAVAILABLE umjesto izmišljene vrijednosti.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card variant="cyber">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base md:text-lg"><Globe className="w-5 h-5 text-primary" />Vaša IP lokacija</CardTitle></CardHeader>
            <CardContent>
              {locationLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /><span className="ml-2 text-sm text-muted-foreground">Dohvaćanje...</span></div>
              ) : location ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50"><p className="text-xs text-muted-foreground">IP ADRESA</p><p className="text-sm font-mono mt-1 truncate">{location.ip}</p></div>
                    <div className="p-3 rounded-lg bg-secondary/50"><p className="text-xs text-muted-foreground">LOKACIJA</p><p className="text-sm mt-1">{location.city}, {location.countryCode}</p></div>
                    <div className="p-3 rounded-lg bg-secondary/50 col-span-2"><p className="text-xs text-muted-foreground">ISP</p><p className="text-sm mt-1 truncate">{location.isp}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={location.vpn ? "warning" : "outline"}><Shield className="w-3 h-3 mr-1" />{location.vpn ? "VPN/hosting indikator" : "VPN nije potvrđen"}</Badge>
                    <Badge variant={location.proxy ? "warning" : "outline"}>{location.proxy ? "Proxy indikator" : "Proxy nije potvrđen"}</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8"><AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning" /><p className="text-sm text-muted-foreground">IP geolokacija: UNAVAILABLE</p></div>
              )}
            </CardContent>
          </Card>

          <Card variant="cyber">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base md:text-lg"><Wifi className="w-5 h-5 text-primary" />Test Brzine</CardTitle></CardHeader>
            <CardContent>
              {!testing && !results && !testError && (
                <div className="text-center py-8"><Button variant="cyber" size="lg" onClick={() => void runSpeedTest()} className="w-full sm:w-auto"><Wifi className="w-5 h-5 mr-2" />Pokreni stvarno mjerenje</Button><p className="text-xs text-muted-foreground mt-4">Bez simuliranih ili procijenjenih rezultata.</p></div>
              )}
              {testing && (
                <div className="space-y-4 py-4"><div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" /><p className="text-sm font-medium">{currentTest}</p></div><Progress value={progress} className="h-2" /><p className="text-xs text-muted-foreground text-center">{progress}%</p></div>
              )}
              {testError && !testing && (
                <div className="text-center py-6"><AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning" /><p className="text-sm text-muted-foreground mb-4">{testError}</p><Button variant="outline" onClick={() => void runSpeedTest()}><RefreshCw className="w-4 h-4 mr-2" />Pokušaj ponovno</Button></div>
              )}
              {results && !testing && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {([['download', Download, results.download], ['upload', Upload, results.upload]] as const).map(([kind, Icon, value]) => (
                      <div key={kind} className="p-4 rounded-lg bg-secondary/50 text-center"><Icon className="w-6 h-6 text-primary mx-auto mb-2" /><p className="text-2xl font-bold">{value.toFixed(1)}</p><p className="text-xs text-muted-foreground">Mbps {kind === 'download' ? 'Download' : 'Upload'}</p><Badge variant="outline" className={`mt-2 ${getSpeedRating(value).color}`}>{getSpeedRating(value).label}</Badge></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3"><div className="p-3 rounded-lg bg-secondary/30 text-center"><Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" /><p className="text-lg font-semibold">{results.latency.toFixed(0)} ms</p><p className="text-xs text-muted-foreground">Latencija</p></div><div className="p-3 rounded-lg bg-secondary/30 text-center"><Wifi className="w-4 h-4 text-muted-foreground mx-auto mb-1" /><p className="text-lg font-semibold">{results.jitter.toFixed(1)} ms</p><p className="text-xs text-muted-foreground">Jitter</p></div></div>
                  <Button variant="outline" className="w-full" onClick={() => void runSpeedTest()}><RefreshCw className="w-4 h-4 mr-2" />Ponovi stvarno mjerenje</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {operators.length > 0 && (
          <Card variant="cyber" className="mt-6 md:mt-8">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base md:text-lg"><Radio className="w-5 h-5 text-primary" />Registrirani mobilni operateri za {location?.country}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Ovo je javni MCC/MNC registar za državu IP lokacije. Ne predstavlja trenutno spojeni mobilni operater uređaja.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{operators.map((op) => <div key={`${op.mcc}-${op.mnc}`} className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between"><div><p className="text-sm font-medium">{op.name}</p><p className="text-xs text-muted-foreground font-mono">MCC {op.mcc} · MNC {op.mnc}</p></div><div className="flex gap-1">{op.technology.slice(0, 2).map((tech) => <Badge key={tech} variant="outline" className="text-[10px]">{tech}</Badge>)}</div></div>)}</div>
            </CardContent>
          </Card>
        )}

        <Card variant="cyber" className="mt-6 md:mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base md:text-lg"><MapPin className="w-5 h-5 text-primary" />Cellular / bazne stanice</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" /><div><p className="font-medium">UNAVAILABLE — potreban je Android cellular ingest</p><p className="text-sm text-muted-foreground mt-1">Web aplikacija nema pristup MCC/MNC, Cell ID, eNB/gNB, PCI ili radio-signal podacima uređaja. Sentinel Shield zato ne prikazuje simulirane tornjeve niti izmišlja udaljenost ili jačinu signala.</p></div></div>
          </CardContent>
        </Card>

        <Card variant="cyber" className="mt-6 md:mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base md:text-lg"><Shield className="w-5 h-5 text-primary" />WebRTC audit</CardTitle></CardHeader>
          <CardContent>
            {webrtcLeak === null ? <p className="text-sm text-muted-foreground">UNAVAILABLE — WebRTC dokaz nije dostupan.</p> : webrtcLeak ? <div className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-4 h-4" />Moguće curenje javnog IP kandidata</div> : <div className="flex items-center gap-2 text-success"><CheckCircle className="w-4 h-4" />Nije pronađen javni IP kandidat</div>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
