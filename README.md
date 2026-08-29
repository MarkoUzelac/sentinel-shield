# Sentinel Shield

Sentinel Shield je moderna web aplikacija za pregled i vizualizaciju mrežne sigurnosti. Aplikacija je namjerno **evidence-first**: UI ne smije prikazivati simulirane, procijenjene ili nasumično generirane sigurnosne podatke kao stvarne rezultate.

## Trenutni status

Ovaj repozitorij je **web klijent**, a ne native Android aplikacija.

### Web stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MapLibre GL JS
- OpenFreeMap

### Stvarno dostupni web dokazi

- IP geolokacija preko HTTPS API-ja, kada je API dostupan
- browser geolokacija samo uz korisničko dopuštenje
- WebRTC candidate audit, uz jasno označen status ako dokaz nije dostupan
- stvarno mjerenje download brzine preko HTTP preuzimanja
- stvarno mjerenje upload brzine preko HTTP POST mjerenja

Ako izvor ne odgovori ili dokaz nije dostupan, aplikacija prikazuje `UNAVAILABLE`/grešku. Ne koristi random fallback vrijednosti.

## Cellular / telephony ograničenja

Web preglednik nema ovlasti za izravan pristup Android telephony API-jima kao što su MCC/MNC, Cell ID, eNB/gNB, PCI, signal strength, network type ili operator koji trenutno opslužuje uređaj. Zbog toga web klijent **ne tvrdi da je detektirao bazne stanice ili IMSI catcher**.

Trenutni UI razlikuje:

- javni MCC/MNC registar za državu IP lokacije — informativno
- stvarni cellular ingest uređaja — `UNAVAILABLE` u web klijentu

Nema simuliranih tornjeva, slučajnih koordinata, slučajnog signala niti lažne udaljenosti.

## Android ingest

Za stvarne cellular/telephony dokaze potreban je zaseban native Android sloj koji prikuplja samo podatke za koje Android verzija, uređaj i dodijeljene runtime dozvole to dopuštaju. Taj sloj treba slati potpisani/validirani `ThreatSnapshot` ili drugi kanonski evidence objekt web/UI sloju.

Potrebno je implementirati i testirati prije nego što se status može označiti kao `ACTIVE`:

1. runtime permission flow za lokaciju i relevantne telephony/network podatke
2. stvarni `TelephonyManager`/`SubscriptionManager` ingest gdje je dopušten
3. cellular identity i signal evidence s timestampom
4. freshness/TTL i source provenance
5. jasno `UNAVAILABLE` ponašanje kada OEM/Android verzija blokira podatke
6. MMI/USSD intent kao korisnički pokrenuta radnja, nikad kao lažni dokaz operatorovog odgovora

## Karta

Web karta koristi **MapLibre GL JS** i **OpenFreeMap**. Karta ne smije prikazivati threat/cellular markere ako za njih ne postoji stvarni evidence zapis.

## Pokretanje

Zahtjevi:

- Node.js 20+
- npm 10+

```bash
git clone https://github.com/MarkoUzelac/sentinel-shield.git
cd sentinel-shield
npm ci
npm run dev
```

Produkcijski build:

```bash
npm run build
```

Lokalni pregled:

```bash
npm run preview
```

## CI

GitHub Actions workflow provjerava:

- `npm ci`
- ESLint
- TypeScript typecheck
- produkcijski Vite build
- postojanje i veličinu `dist/index.html`
- build artifact

## Evidence pravilo

Svi sigurnosni prikazi trebaju koristiti kanonski evidence model (`ThreatSnapshot` ili ekvivalent). Svaki rezultat mora imati barem:

- `source`
- `observedAt`
- `status`
- relevantan payload
- provenance kada je primjenjivo

Stanja `UNAVAILABLE`, `STALE` i `ACTIVE_UNVERIFIED` moraju ostati eksplicitna. Nikakav `Math.random()` ne smije služiti za generiranje sigurnosnog rezultata, lokacije, signala, brzine ili threat događaja.

## Napomena o brzini

Speed test mjeri stvarni prijenos podataka prema testnom endpointu. Ne koristi procjenu `upload = download × faktor` i ne ubacuje lažne vrijednosti kada endpoint ne odgovori.

## Licenca

Licenca i uvjeti distribucije trebaju biti definirani prije javnog produkcijskog izdanja.
