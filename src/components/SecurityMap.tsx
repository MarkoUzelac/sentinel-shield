import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, LocateFixed, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEFAULT_CENTER: [number, number] = [15.9819, 45.815];
const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

export const SecurityMap = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [status, setStatus] = useState("Karta spremna");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: DEFAULT_CENTER,
      zoom: 5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const marker = new maplibregl.Marker({ color: "#16f2c5" })
      .setLngLat(DEFAULT_CENTER)
      .setPopup(
        new maplibregl.Popup({ offset: 18 }).setHTML(
          '<div style="font-family:ui-monospace,monospace"><strong>Sentinel Shield</strong><br/>Sigurnosni centar</div>'
        ),
      )
      .addTo(map);

    map.on("load", () => setStatus("Karta povezana"));
    map.on("error", () => setStatus("Provjerite mrežnu vezu"));

    mapRef.current = map;

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const locateUser = () => {
    if (!navigator.geolocation) {
      setStatus("Geolokacija nije podržana");
      return;
    }

    setStatus("Tražim vašu lokaciju…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const center: [number, number] = [coords.longitude, coords.latitude];
        mapRef.current?.flyTo({ center, zoom: 13, essential: true });
        setStatus("Lokacija pronađena");
      },
      () => setStatus("Lokacija nije dostupna"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const resetView = () => {
    mapRef.current?.flyTo({ center: DEFAULT_CENTER, zoom: 5, essential: true });
    setStatus("Pogled vraćen na zadanu lokaciju");
  };

  return (
    <section className="py-12 md:py-16 px-4" id="map">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
          <div>
            <Badge variant="cyber" className="mb-3">Sentinel Map</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Sigurnosna karta bez Googlea
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Interaktivna karta za Sentinel Shield izgrađena na MapLibre GL JS i OpenFreeMap infrastrukturi, bez obveznog Maps API ključa.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            {status}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div ref={containerRef} className="h-[420px] md:h-[560px] w-full" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Button variant="secondary" size="sm" onClick={locateUser}>
              <LocateFixed className="w-4 h-4 mr-2" />
              Moja lokacija
            </Button>
            <Button variant="secondary" size="sm" onClick={resetView}>
              <Crosshair className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground font-mono">
          Karta: MapLibre GL JS · podaci: OpenStreetMap/OpenMapTiles putem OpenFreeMap. Za produkcijski promet preporučuje se vlastiti ili ugovoreni tile provider.
        </p>
      </div>
    </section>
  );
};
