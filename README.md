# Sentinel Shield

Sentinel Shield je moderna web aplikacija za pregled i vizualizaciju mrežne sigurnosti, s fokusom na stvarne podatke, jasnu evidenciju izvora i sigurnu kartografsku vizualizaciju.

## Trenutni web stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MapLibre GL JS
- OpenFreeMap

## Karta

Web karta koristi **MapLibre GL JS** kao open-source renderer i **OpenFreeMap** kao javni map style/tile izvor. Google Maps/Mapbox runtime nije potreban za osnovni prikaz karte.

Implementirane su:

- interaktivna karta
- geolokacija korisnika uz dopuštenje preglednika
- reset prikaza na zadani položaj
- stvarni GitHub link u footeru
- centralizirani kartografski sloj spreman za daljnje povezivanje sa Sentinel Shield threat/evidence podacima

## Pokretanje lokalno

Zahtjevi:

- Node.js 20+
- npm 10+

```bash
git clone https://github.com/MarkoUzelac/sentinel-shield.git
cd sentinel-shield
npm ci
npm run dev
```

Za produkcijski build:

```bash
npm run build
```

Za lokalni pregled produkcijskog builda:

```bash
npm run preview
```

## Važno za geolokaciju

Browser geolokacija radi samo uz korisničko dopuštenje i u sigurnom kontekstu (HTTPS ili localhost). Odbijena dozvola ne smije se tretirati kao greška karte; aplikacija treba ostati funkcionalna bez geolokacije.

## Arhitektura sigurnosnih podataka

Sentinel Shield treba koristiti jedan kanonski izvor stvarnih opažanja (`ThreatSnapshot` / evidence pipeline) za Radar, Tactical Map i ostale prikaze. UI ne smije izmišljati uređaje, lokacije, handshakeove ili threat podatke koji nisu potvrđeni stvarnim izvorom.

Statusi poput `UNAVAILABLE`, `STALE` i `ACTIVE_UNVERIFIED` moraju ostati eksplicitni kada izvorni podaci nisu dostupni ili nisu dovoljno svježi.

## OpenFreeMap i produkcija

OpenFreeMap je praktičan za javni razvoj i demonstracije. Za veće produkcijsko opterećenje potrebno je provjeriti aktualne uvjete korištenja, dostupnost i eventualno koristiti vlastiti ili komercijalni tile/style servis.

## Razvojni smjer

Sljedeći koraci projekta uključuju:

1. povezivanje karte s kanonskim Sentinel Shield evidence podacima
2. Radar + Tactical Map projekcije iz istog `ThreatSnapshot` modela
3. stvarni WireGuard handshake/freshness verification
4. Android signal ingest za GPS, cellular, Wi-Fi, BLE i Connectivity/VPN
5. GitHub Actions CI za lint, typecheck, build i artifact verification

## GitHub

Izvorni repozitorij:

https://github.com/MarkoUzelac/sentinel-shield

## Licenca

Licenca i uvjeti distribucije trebaju biti definirani prije javnog produkcijskog izdanja.
