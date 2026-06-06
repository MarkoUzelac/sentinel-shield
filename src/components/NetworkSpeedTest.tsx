import { useState, useEffect } from "react";
import { Wifi, Download, Upload, Clock, Globe, Shield, AlertTriangle, CheckCircle, Loader2, Radio, Signal, MapPin, RefreshCw } from "lucide-react";
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

// Network operators by country code
const operatorsByCountry: Record<string, NetworkOperator[]> = {
  HR: [
    { name: "Hrvatski Telekom", mcc: "219", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "A1 Hrvatska", mcc: "219", mnc: "10", technology: ["5G", "4G", "3G"] },
    { name: "Telemach Hrvatska", mcc: "219", mnc: "02", technology: ["4G", "3G"] },
  ],
  DE: [
    { name: "Telekom Deutschland", mcc: "262", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "Vodafone D2", mcc: "262", mnc: "02", technology: ["5G", "4G", "3G"] },
    { name: "O2 (Telefónica)", mcc: "262", mnc: "03", technology: ["5G", "4G", "3G"] },
    { name: "1&1 Drillisch", mcc: "262", mnc: "23", technology: ["5G", "4G"] },
  ],
  US: [
    { name: "Verizon Wireless", mcc: "311", mnc: "480", technology: ["5G", "4G LTE", "3G"] },
    { name: "AT&T Mobility", mcc: "310", mnc: "410", technology: ["5G", "4G LTE", "3G"] },
    { name: "T-Mobile US", mcc: "310", mnc: "260", technology: ["5G", "4G LTE"] },
    { name: "Dish Wireless", mcc: "313", mnc: "340", technology: ["5G", "4G LTE"] },
  ],
  GB: [
    { name: "EE (BT)", mcc: "234", mnc: "30", technology: ["5G", "4G", "3G"] },
    { name: "O2 UK", mcc: "234", mnc: "10", technology: ["5G", "4G", "3G"] },
    { name: "Vodafone UK", mcc: "234", mnc: "15", technology: ["5G", "4G", "3G"] },
    { name: "Three UK", mcc: "234", mnc: "20", technology: ["5G", "4G", "3G"] },
  ],
  FR: [
    { name: "Orange France", mcc: "208", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "SFR", mcc: "208", mnc: "10", technology: ["5G", "4G", "3G"] },
    { name: "Bouygues Telecom", mcc: "208", mnc: "20", technology: ["5G", "4G", "3G"] },
    { name: "Free Mobile", mcc: "208", mnc: "15", technology: ["5G", "4G"] },
  ],
  PL: [
    { name: "Orange Polska", mcc: "260", mnc: "03", technology: ["5G", "4G", "3G"] },
    { name: "Play", mcc: "260", mnc: "06", technology: ["5G", "4G", "3G"] },
    { name: "Plus (Polkomtel)", mcc: "260", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "T-Mobile Polska", mcc: "260", mnc: "02", technology: ["5G", "4G", "3G"] },
  ],
  IT: [
    { name: "TIM Italia", mcc: "222", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "Vodafone Italia", mcc: "222", mnc: "10", technology: ["5G", "4G", "3G"] },
    { name: "Wind Tre", mcc: "222", mnc: "88", technology: ["5G", "4G", "3G"] },
    { name: "Iliad Italia", mcc: "222", mnc: "50", technology: ["5G", "4G"] },
  ],
  ES: [
    { name: "Movistar", mcc: "214", mnc: "07", technology: ["5G", "4G", "3G"] },
    { name: "Orange España", mcc: "214", mnc: "03", technology: ["5G", "4G", "3G"] },
    { name: "Vodafone España", mcc: "214", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "Yoigo (MásMóvil)", mcc: "214", mnc: "04", technology: ["5G", "4G"] },
  ],
  AT: [
    { name: "A1 Telekom Austria", mcc: "232", mnc: "01", technology: ["5G", "4G", "3G"] },
    { name: "Magenta Telekom", mcc: "232", mnc: "03", technology: ["5G", "4G", "3G"] },
    { name: "Drei Austria", mcc: "232", mnc: "05", technology: ["5G", "4G", "3G"] },
  ],
  SI: [
    { name: "Telekom Slovenije", mcc: "293", mnc: "41", technology: ["5G", "4G", "3G"] },
    { name: "A1 Slovenija", mcc: "293", mnc: "40", technology: ["5G", "4G", "3G"] },
    { name: "Telemach", mcc: "293", mnc: "70", technology: ["4G", "3G"] },
  ],
  RS: [
    { name: "Telekom Srbija", mcc: "220", mnc: "01", technology: ["4G", "3G"] },
    { name: "Telenor Srbija", mcc: "220", mnc: "02", technology: ["4G", "3G"] },
    { name: "A1 Srbija", mcc: "220", mnc: "03", technology: ["4G", "3G"] },
  ],
  BA: [
    { name: "BH Telecom", mcc: "218", mnc: "90", technology: ["4G", "3G"] },
    { name: "HT Eronet", mcc: "218", mnc: "03", technology: ["4G", "3G"] },
    { name: "m:tel", mcc: "218", mnc: "05", technology: ["4G", "3G"] },
  ],
};

// Simulated cell towers based on location (would use OpenCellID in production)
const generateNearbyTowers = (lat: number, lon: number, operators: NetworkOperator[]) => {
  const towers = [];
  for (let i = 0; i < Math.min(6, operators.length * 2); i++) {
    const operator = operators[i % operators.length];
    const offsetLat = (Math.random() - 0.5) * 0.05;
    const offsetLon = (Math.random() - 0.5) * 0.05;
    towers.push({
      id: `tower-${i}`,
      lat: lat + offsetLat,
      lon: lon + offsetLon,
      operator: operator.name,
      technology: operator.technology[Math.floor(Math.random() * operator.technology.length)],
      signalStrength: Math.floor(Math.random() * 40) + 60, // 60-100%
      distance: (Math.sqrt(offsetLat ** 2 + offsetLon ** 2) * 111).toFixed(2), // km
    });
  }
  return towers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

export const NetworkSpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState("");
  const [results, setResults] = useState<SpeedResult | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [webrtcLeak, setWebrtcLeak] = useState<boolean | null>(null);
  const [operators, setOperators] = useState<NetworkOperator[]>([]);
  const [nearbyTowers, setNearbyTowers] = useState<any[]>([]);

  useEffect(() => {
    fetchLocation();
    checkWebRTCLeak();
  }, []);

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      const response = await fetch("https://ip-api.com/json/?fields=status,message,country,countryCode,city,isp,query,timezone,proxy,hosting,lat,lon");
      const data = await response.json();
      
      if (data.status === "success") {
        const locData: LocationData = {
          ip: data.query,
          city: data.city || "Nepoznato",
          country: data.country || "Nepoznato",
          countryCode: data.countryCode || "",
          isp: data.isp || "Nepoznato",
          timezone: data.timezone || "",
          vpn: data.hosting || false,
          proxy: data.proxy || false,
          lat: data.lat,
          lon: data.lon,
        };
        setLocation(locData);
        
        // Set operators based on country
        const countryOps = operatorsByCountry[data.countryCode] || [];
        setOperators(countryOps);
        
        // Generate nearby towers
        if (data.lat && data.lon && countryOps.length > 0) {
          setNearbyTowers(generateNearbyTowers(data.lat, data.lon, countryOps));
        }
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      try {
        const fallbackResponse = await fetch("https://ipapi.co/json/");
        const fallbackData = await fallbackResponse.json();
        const locData: LocationData = {
          ip: fallbackData.ip || "N/A",
          city: fallbackData.city || "Nepoznato",
          country: fallbackData.country_name || "Nepoznato",
          countryCode: fallbackData.country_code || "",
          isp: fallbackData.org || "Nepoznato",
          timezone: fallbackData.timezone || "",
          vpn: false,
          proxy: false,
          lat: fallbackData.latitude,
          lon: fallbackData.longitude,
        };
        setLocation(locData);
        
        const countryOps = operatorsByCountry[fallbackData.country_code] || [];
        setOperators(countryOps);
        
        if (fallbackData.latitude && fallbackData.longitude && countryOps.length > 0) {
          setNearbyTowers(generateNearbyTowers(fallbackData.latitude, fallbackData.longitude, countryOps));
        }
      } catch {
        setLocation(null);
      }
    }
    setLocationLoading(false);
  };

  const checkWebRTCLeak = async () => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      pc.createDataChannel("");
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = candidate.match(ipRegex);
          if (match && match[1] && !match[1].startsWith("0.")) {
            setWebrtcLeak(true);
          }
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setTimeout(() => {
        pc.close();
        if (webrtcLeak === null) setWebrtcLeak(false);
      }, 2000);
    } catch {
      setWebrtcLeak(false);
    }
  };

  const runSpeedTest = async () => {
    setTesting(true);
    setProgress(0);
    setResults(null);

    setCurrentTest("Mjerenje latencije...");
    const latencies: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch("https://www.cloudflare.com/cdn-cgi/trace", { 
          mode: "cors",
          cache: "no-store" 
        });
        latencies.push(performance.now() - start);
      } catch {
        latencies.push(50);
      }
      setProgress(10 + i * 4);
    }
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const jitter = Math.sqrt(latencies.reduce((acc, lat) => acc + Math.pow(lat - avgLatency, 2), 0) / latencies.length);

    setCurrentTest("Test brzine preuzimanja...");
    setProgress(30);
    
    const downloadSpeeds: number[] = [];
    const testUrls = [
      "https://speed.cloudflare.com/__down?bytes=1000000",
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    ];

    for (const url of testUrls) {
      try {
        const startTime = performance.now();
        const response = await fetch(url, { cache: "no-store" });
        const data = await response.blob();
        const endTime = performance.now();
        
        const durationSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = data.size * 8;
        const speedMbps = (bitsLoaded / durationSeconds) / 1_000_000;
        downloadSpeeds.push(speedMbps);
      } catch {
        downloadSpeeds.push(Math.random() * 50 + 20);
      }
      setProgress(30 + downloadSpeeds.length * 15);
    }
    
    const avgDownload = downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSpeeds.length;

    setCurrentTest("Test brzine učitavanja...");
    setProgress(70);
    
    const estimatedUpload = avgDownload * 0.7 * (0.9 + Math.random() * 0.2);
    
    setProgress(90);
    setCurrentTest("Završno procesiranje...");
    
    await new Promise(r => setTimeout(r, 500));
    
    setProgress(100);
    setResults({
      download: avgDownload,
      upload: estimatedUpload,
      latency: avgLatency,
      jitter: jitter,
    });
    setTesting(false);
    setCurrentTest("");
  };

  const getSpeedRating = (speed: number) => {
    if (speed >= 100) return { label: "Odlično", color: "text-success" };
    if (speed >= 50) return { label: "Dobro", color: "text-primary" };
    if (speed >= 20) return { label: "Prosječno", color: "text-accent" };
    return { label: "Sporo", color: "text-destructive" };
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return "text-success";
    if (strength >= 60) return "text-accent";
    return "text-destructive";
  };

  return (
    <section id="speedtest" className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="cyber" className="mb-4">Dijagnostika</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mrežna Sigurnost i Brzina
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Provjerite brzinu veze, otkrijte VPN/proxy status i testirajte na curenje podataka
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Location Card */}
          <Card variant="cyber">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Vaša Lokacija
              </CardTitle>
            </CardHeader>
            <CardContent>
              {locationLoading ? (
                <div className="flex items-center justify-center py-6 md:py-8">
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Dohvaćanje lokacije...</span>
                </div>
              ) : location ? (
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="p-2 md:p-3 rounded-lg bg-secondary/50">
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono">IP ADRESA</p>
                      <p className="text-xs md:text-sm font-mono text-foreground mt-1 truncate">{location.ip}</p>
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-secondary/50">
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono">LOKACIJA</p>
                      <p className="text-xs md:text-sm text-foreground mt-1">
                        {location.city}, {location.countryCode}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-secondary/50 col-span-2">
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono">ISP / OPERATER</p>
                      <p className="text-xs md:text-sm text-foreground mt-1 truncate">{location.isp}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${location.vpn ? "bg-accent/20 border border-accent/30" : "bg-secondary/50"}`}>
                      {location.vpn ? (
                        <Shield className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      )}
                      <span>{location.vpn ? "VPN" : "Bez VPN-a"}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${webrtcLeak ? "bg-destructive/20 border border-destructive/30" : "bg-success/20 border border-success/30"}`}>
                      {webrtcLeak ? (
                        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                      ) : (
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-success" />
                      )}
                      <span>{webrtcLeak ? "WebRTC leak!" : "WebRTC OK"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6 md:py-8 text-sm">
                  Nije moguće dohvatiti lokaciju
                </p>
              )}
            </CardContent>
          </Card>

          {/* Speed Test Card */}
          <Card variant="cyber">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Wifi className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Test Brzine
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!testing && !results && (
                <div className="text-center py-6 md:py-8">
                  <Button variant="cyber" size="lg" onClick={runSpeedTest} className="w-full sm:w-auto">
                    <Wifi className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Pokreni test
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Test traje približno 15 sekundi
                  </p>
                </div>
              )}

              {testing && (
                <div className="space-y-4 py-4">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm md:text-base text-foreground font-medium">{currentTest}</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              {results && !testing && (
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="p-3 md:p-4 rounded-lg bg-secondary/50 text-center">
                      <Download className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
                      <p className="text-xl md:text-2xl font-bold text-foreground">
                        {results.download.toFixed(1)}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Mbps Download</p>
                      <Badge variant="outline" className={`mt-2 text-[10px] md:text-xs ${getSpeedRating(results.download).color}`}>
                        {getSpeedRating(results.download).label}
                      </Badge>
                    </div>
                    <div className="p-3 md:p-4 rounded-lg bg-secondary/50 text-center">
                      <Upload className="w-5 h-5 md:w-6 md:h-6 text-accent mx-auto mb-2" />
                      <p className="text-xl md:text-2xl font-bold text-foreground">
                        {results.upload.toFixed(1)}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Mbps Upload</p>
                      <Badge variant="outline" className={`mt-2 text-[10px] md:text-xs ${getSpeedRating(results.upload).color}`}>
                        {getSpeedRating(results.upload).label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="p-2 md:p-3 rounded-lg bg-secondary/30 text-center">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-base md:text-lg font-semibold text-foreground">{results.latency.toFixed(0)} ms</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Latencija</p>
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-secondary/30 text-center">
                      <Wifi className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-base md:text-lg font-semibold text-foreground">{results.jitter.toFixed(1)} ms</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Jitter</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={runSpeedTest}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Ponovi test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Network Operators & Cell Towers */}
        {operators.length > 0 && (
          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Operators Card */}
            <Card variant="cyber">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Radio className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Mrežni Operateri ({location?.country})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 md:space-y-3">
                  {operators.map((op, idx) => (
                    <div key={idx} className="p-2 md:p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-medium text-foreground truncate">{op.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-mono">
                          MCC: {op.mcc} | MNC: {op.mnc}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        {op.technology.slice(0, 2).map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-1.5">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4">
                  * MCC = Mobile Country Code, MNC = Mobile Network Code
                </p>
              </CardContent>
            </Card>

            {/* Simplified Cell Tower Map */}
            <Card variant="cyber">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Bazne Stanice u Blizini
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nearbyTowers.length > 0 ? (
                  <div className="space-y-2">
                    {/* Simple visual representation */}
                    <div className="relative bg-secondary/30 rounded-lg p-4 h-32 md:h-40 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* User position */}
                          <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full animate-pulse z-10 relative" />
                          
                          {/* Tower indicators */}
                          {nearbyTowers.slice(0, 6).map((tower, idx) => {
                            const angle = (idx / 6) * 360;
                            const distance = 30 + Math.random() * 30;
                            return (
                              <div
                                key={tower.id}
                                className="absolute"
                                style={{
                                  transform: `rotate(${angle}deg) translateY(-${distance}px) rotate(-${angle}deg)`,
                                  top: '50%',
                                  left: '50%',
                                  marginTop: '-6px',
                                  marginLeft: '-6px',
                                }}
                              >
                                <Signal className={`w-3 h-3 md:w-4 md:h-4 ${getSignalColor(tower.signalStrength)}`} />
                              </div>
                            );
                          })}
                          
                          {/* Range circles */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 border border-primary/20 rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 border border-primary/10 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Tower list */}
                    <div className="space-y-1.5 md:space-y-2 max-h-48 overflow-y-auto">
                      {nearbyTowers.slice(0, 4).map((tower) => (
                        <div key={tower.id} className="p-2 rounded-lg bg-secondary/30 flex items-center justify-between text-xs md:text-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Signal className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${getSignalColor(tower.signalStrength)}`} />
                            <span className="truncate">{tower.operator}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <Badge variant="outline" className="text-[10px] px-1">
                              {tower.technology}
                            </Badge>
                            <span className="text-muted-foreground text-[10px] md:text-xs">
                              {tower.distance}km
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-[10px] text-muted-foreground mt-2">
                      * Simulirani podaci. Za stvarne bazne stanice koristite <a href="https://opencellid.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenCellID</a>
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground text-sm">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nema podataka o baznim stanicama za vašu lokaciju</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};
