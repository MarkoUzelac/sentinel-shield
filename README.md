# Sentinel Shield

Sentinel Shield je **evidence-first** sigurnosna aplikacija za mrežnu, telephony i cellular analitiku. Cilj projekta je prikazivati samo podatke koje je moguće dokazati iz stvarnog izvora.

> **Production rule:** nema mock podataka, nema testnih tornjeva, nema `Math.random()` sigurnosnih rezultata, nema izmišljenih koordinata, signala, brzina ili threat događaja.

Ako stvarni izvor nije dostupan, UI mora prikazati `UNAVAILABLE`, `STALE` ili `ACTIVE_UNVERIFIED`, uz izvor i provenance. Nikada se ne smije popunjavati lažnim fallbackom.

## Cilj proizvoda

Sentinel Shield treba biti **native Android APK**, a ne web aplikacija koja glumi pristup Android telephony hardveru.

Web UI može služiti kao vizualizacijski sloj, ali autoritativni cellular/telephony podaci moraju dolaziti iz native Android sloja. Android ingest mora koristiti stvarne API-je uređaja i poštovati ograničenja konkretne verzije Androida, OEM-a, SIM-a, operatora i dodijeljenih runtime dozvola.

Prioriteti proizvoda:

- premium, precizan i čitljiv security UI/UX
- stvarni podaci umjesto demonstracijskih podataka
- jasna razlika između opaženog dokaza, neprovjerenog stanja i nedostupnosti
- provenance za svaki važan rezultat
- timestamp i freshness/TTL
- native Android telemetry kao autoritativni izvor za cellular podatke
- nikakvo pretvaranje javnih baza ili procjena u dokaz trenutnog stanja uređaja

## Arhitektura

Projekt ima dva sloja:

### 1. Web/UI sloj

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MapLibre GL JS
- OpenFreeMap

Web sloj prikazuje evidence objekte koje dobiva iz stvarnih izvora. Browser API-ji ne smiju se predstavljati kao zamjena za native Android telephony API-je.

### 2. Native Android sloj

Native Android modul nalazi se u `android/` i predstavlja izvor cellular/telephony evidence podataka.

Koristi:

- Kotlin
- Android Gradle Plugin
- `TelephonyManager`
- `SubscriptionManager`
- Android runtime permissions
- Android `CellInfo` API-je

Native aplikacija se gradi kao Android APK kroz Gradle i GitHub Actions.

## Native cellular / telephony ingest

Native ingest mora prikupljati **samo stvarno opažene podatke uređaja**.

Implementirani izvori uključuju:

- `TelephonyManager`
- `SubscriptionManager`
- aktivne SIM/subscription podatke
- registrirane i opažene ćelije
- LTE
- 5G NR
- WCDMA
- GSM
- TD-SCDMA

Za ćelije se, kada ih Android uređaj stvarno izloži, prikupljaju:

- MCC
- MNC
- Cell ID / CI / NCI
- TAC/LAC odnosno odgovarajući area code
- PCI/PSC/BSIC/CPID gdje je primjenjivo
- signal strength u dBm kada je dostupan
- signal level
- registration state
- Android cell-info timestamp

Podaci koji nisu dostupni na konkretnom uređaju moraju ostati `null`/`UNAVAILABLE`; ne smiju se procjenjivati ili generirati.

### Runtime permissions

Native sloj mora eksplicitno provjeravati runtime dozvole prije čitanja telephony podataka. Trenutna implementacija koristi:

- `ACCESS_FINE_LOCATION`
- `READ_PHONE_STATE`

Manifest može deklarirati i druge potrebne network/telephony dozvole, ali aplikacija ne smije tvrditi da ima podatke samo zato što je dozvola deklarirana. Android verzija, OEM i operator mogu dodatno ograničiti dostupnost podataka.

Ako obavezna dozvola nedostaje:

`status = UNAVAILABLE`

`provenance = runtime_permission_missing`

### Freshness

Svaki cellular snapshot mora imati vrijeme prikupljanja i, kada Android izvor daje timestamp, dob podataka.

Standardna stanja:

- `ACTIVE` — dokaz je dostupan i svjež
- `STALE` — dokaz postoji, ali je stariji od definiranog TTL-a
- `ACTIVE_UNVERIFIED` — podatak postoji, ali nema dovoljno vremenskog dokaza za punu potvrdu
- `UNAVAILABLE` — stvarni dokaz nije dostupan

Trenutni native collector koristi TTL od **5 minuta** za cell-info freshness.

## Provenance / evidence model

Svaki sigurnosni rezultat mora jasno identificirati:

- `source`
- `observedAt` / `capturedAt`
- `status`
- payload
- provenance
- freshness kada je primjenjiv

Primjer native cellular izvora:

`Android TelephonyManager/SubscriptionManager`

Primjer provenancea:

`device_observed_cell_info`

Nedostatak dozvole mora biti eksplicitno označen kao:

`runtime_permission_missing`

Javna baza, IP geolokacija, carrier registry ili procjena **nije dokaz** da je određena bazna stanica trenutno fizički prisutna na lokaciji uređaja.

## Karta i OpenCellID

Karta smije prikazivati cellular/threat markere samo kada postoji stvarni evidence zapis koji ih podržava.

Javne baze poput OpenCellID mogu služiti kao pomoćni/registarski izvor za geografsko obogaćivanje, ali rezultat mora biti označen kao vanjski/registarski podatak. Ne smije se prikazivati kao trenutna opažena ćelija uređaja bez odgovarajućeg native evidence zapisa.

Ako nema stvarnog koordinatnog dokaza za ćeliju, karta ne smije izmišljati lokaciju iz nasumičnog offseta ili procjene.

## Mrežni audit

Network audit treba koristiti stvarne browser/Android network capability podatke i stvarne HTTPS probe gdje su podržani.

Rezultat mora razlikovati:

- dostupnost mreže
- capability podatke uređaja
- stvarno uspješan HTTPS probe
- latency/mjerenje kada je stvarno izmjereno
- nedostupan ili neprovjeren rezultat

Ne smije se koristiti random ili procijenjena vrijednost kao dokaz mrežnog stanja.

## Speed test

Download i upload moraju biti **stvarno mjereni** prijenosom podataka.

Nije dopušteno:

- `upload = download * faktor`
- `Math.random()` fallback
- hardkodirana brzina predstavljena kao stvarno mjerenje
- lažni rezultat kada endpoint ne odgovori

Ako mjerenje ne uspije, rezultat je `UNAVAILABLE` ili odgovarajuća greška.

## Call & MMI audit

MMI/USSD kodovi mogu biti poslani prema Android dialeru samo kao korisnički pokrenuta radnja.

Dial intent sam po sebi **nije dokaz odgovora operatora**.

Aplikacija ne smije tvrditi da je MMI/USSD rezultat verificiran ako stvarni odgovor operatora nije automatski i pouzdano dostupan kao evidence podatak.

Primjereni statusi uključuju `UNVERIFIED` kada je potrebna korisnička/operator evaluacija.

## Telephony / RF audit

RF/cellular audit mora se temeljiti na native Android telemetry podacima kada su dostupni.

Aplikacija mora jasno pokazati kada nedostaju:

- location permission
- phone-state permission
- cell-info podaci
- signal strength
- identity podaci
- dovoljno svjež timestamp

Ne smije se iz nedostatka podataka zaključiti da postoji prijetnja, niti se smije generirati lažni signal ili lažna bazna stanica.

## Threat detection

Sentinel Shield ne smije predstavljati **IMSI catcher, rogue cell, MITM ili drugi threat kao potvrđen** samo na temelju jednog indikatora, javne baze, procjene ili browser podatka.

Threat rezultat mora biti vezan uz konkretan evidence payload i provenance. Ako nema dovoljno dokaza, UI mora koristiti neprovjereno ili nedostupno stanje.

## Nema testnih podataka

Production UI ne smije imati:

- `load test data`
- fake towers
- synthetic cells
- random coordinates
- random signal values
- random network speeds
- fabricated threat events
- fabricated carrier evidence
- fallback koji izgleda kao stvarni rezultat

Testovi mogu koristiti fixture podatke unutar testnog okruženja, ali ti podaci nikada ne smiju biti prikazani kao production telemetry.

## Android build

Native Android build mora koristiti:

- JDK 17
- Kotlin JVM 17
- Android SDK 35
- Gradle
- `assembleDebug`

GitHub Actions Android CI mora:

1. instalirati JDK 17
2. pripremiti Android SDK
3. izgraditi native APK
4. provjeriti da APK postoji i nije prazan
5. uploadati APK kao build artifact

Android CI ne smije biti označen kao PASS dok Gradle build, APK verification i artifact upload stvarno ne završe uspješno.

## Web CI

Web CI mora provjeriti:

- `npm ci`
- ESLint
- TypeScript typecheck
- produkcijski Vite build
- postojanje `dist/index.html`
- build artifact

## GitHub workflow pravilo

Svaki neuspjeli CI rezultat mora se tretirati kao stvarni blocker:

`CI failure → analiza loga → minimalni popravak → commit → novi CI run`

Ne smije se označiti projekt kao PASS na temelju pretpostavke ili samo zato što source izgleda ispravno.

## Pokretanje web klijenta

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

## Pokretanje native Android builda

Iz root direktorija projekta:

```bash
gradle -p android :app:assembleDebug
```

APK se očekuje na:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Trenutni status

Native Android cellular ingest je implementiran i koristi stvarne Android telephony API-je umjesto simuliranih podataka.

Android CI je konfiguriran za JDK 17 / Kotlin JVM 17 i generiranje debug APK-a.

Web i Android CI rezultati moraju se uvijek provjeravati na konkretnom GitHub Actions runu prije označavanja builda kao PASS.

## Ograničenja Androida

Dostupnost cellular podataka nije jednaka na svim uređajima. Android API, OEM, modem, dual-SIM konfiguracija, operator i runtime permissions mogu ograničiti dostupna polja.

Zbog toga je **točnost** definirana kao točan prikaz stvarno dostupnog izvora, a ne kao izmišljanje nedostajućih vrijednosti.

`UNAVAILABLE` je valjan i očekivan rezultat kada uređaj ne daje potreban dokaz.

## Licenca

Licenca i uvjeti distribucije trebaju biti definirani prije javnog produkcijskog izdanja.
