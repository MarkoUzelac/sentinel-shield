## Cilj
Proširiti SecHub Pro na sve službene jezike EU, dodati pravne okvire i nove izvore nadzora po jurisdikciji, povezati Google Search Console (META verifikacija), napraviti SEO optimizaciju i objaviti stranicu.

## 1. Višejezičnost (i18n)
- Dodati `react-i18next` + `i18next-browser-languagedetector`.
- Postaviti 24 službena EU jezika: HR, EN, DE, FR, IT, ES, PT, NL, PL, CS, SK, SL, HU, RO, BG, EL, DA, SV, FI, ET, LV, LT, MT, GA (+ fallback EN).
- Auto-detekcija jezika preko `navigator.language` + IP-API države, ručno prebacivanje preko izbornika zastavica u `Navigation.tsx`.
- Spremanje izbora u `localStorage`.
- Strategija prijevoda: zbog opsega koristiti **dinamički prijevod preko Lovable AI Gateway** edge funkcije s cacheom u `localStorage` (per-language JSON), uz ručno napisane HR i EN baze. Ostali jezici se generiraju on-demand i spremaju.
- Atribut `<html lang>` se ažurira dinamički.

## 2. Pravni okviri za sve EU države
Proširiti `ExtendedJurisdictionInfo.tsx` s pravim zakonima i kaznama za svih 27 EU država + UK, CH, NO. Primjeri:
- DE: StGB §201–202, BDSG, kazne do 5 god.
- FR: Code pénal art. 226-1, CNIL, do 5 god / 300k€.
- IT: Codice penale art. 617, Garante Privacy.
- ES: Código Penal art. 197, AEPD.
- PL, NL, SE, AT, BE, itd.
- Sve uz GDPR (do 20M€ / 4%) i NIS2 direktivu.
Geo-detekcija (IP-API) automatski otvara karticu korisničke države.

## 3. Novi izvori nadzora i praćenja
Novi component `SurveillanceSources.tsx` s detaljnim opisima i kaznama po jurisdikciji:
- **Komercijalni spyware**: Pegasus (NSO), Predator (Intellexa), FinFisher, Candiru, RCS Lab Hermit.
- **Stalkerware**: mSpy, FlexiSpy, Cocospy, Hoverwatch.
- **Mrežni nadzor**: IMSI catcher / Stingray, SS7 exploit, Diameter napadi 4G/5G.
- **Državni programi**: PRISM, Tempora, XKeyscore, EU Chat Control prijedlog.
- **AdTech tracking**: fingerprinting, Meta Pixel, Google Analytics u GDPR kontekstu (Schrems II).
- **AI nadzor**: prepoznavanje lica (Clearview AI – kažnjen 20M€ u IT/GR/FR), ChatControl skeniranje.
Svaki izvor: opis, kako radi, kako detektirati, pravna pozadina, kazne za počinitelje po EU jurisdikcijama.

## 4. Google Search Console + META verifikacija
- Dodati `<meta name="google-site-verification" content="...">` u `index.html` (token će se dohvatiti preko Search Console konektora).
- Tijek: provjeriti `standard_connectors--list_connections` za `google_search_console`; ako nije povezan, zatražiti povezivanje; zatim POST `/siteVerification/v1/token` (META), umetnuti tag, deploy, POST `/webResource?verificationMethod=META`, PUT `/webmasters/v3/sites/...`.

## 5. SEO optimizacija
- `hreflang` linkovi za svih 24 jezika u `index.html`.
- Proširiti `sitemap.xml` po jeziku (parametri `?lang=xx`) ili predrender ruta.
- Ažurirati `llms.txt` i JSON-LD `inLanguage` po prijevodu.
- Dodati `<html lang>` reaktivno.
- Pokrenuti SEO scan (`seo_chat--trigger_scan`) i fixati nove nalaze.

## 6. Bugfix prolaz
- Provjeriti `code--read_runtime_errors` i konzolu, popraviti sve runtime greške.
- Provjeriti security scan (`security--get_scan_results`) – riješiti kritične nalaze prije publisha.
- Mobilni viewport (360px): provjeriti hero, navigaciju, kartice — ispraviti overflow ako postoji.

## 7. Publish
- `preview_ui--publish` na `tkomesmijepratit.lovable.app` nakon što su website info, SEO i security uredu.

## Tehnički detalji
- Edge function `translate-content` (Lovable Cloud) zove Lovable AI Gateway (`google/gemini-2.5-flash`) s batch JSON-om stringova; rezultat se cachira u DB tablici `translations(lang, key, value)` s RLS public read.
- Language switcher: `Select` s nativnim imenom jezika + zastavica emoji.
- Svi postojeći hrvatski stringovi izvlače se u `src/i18n/locales/hr.json` (baza istine) i `en.json` (ručni prijevod); ostali jezici se popunjavaju lijeno.

## Pitanja prije implementacije
1. **Opseg prijevoda**: prevodimo li doslovno SVAKI string (uključujući pravne citate zakona) na svih 24 jezika, ili samo UI + sažetke a zakonski citati ostaju u izvornom jeziku te države?
2. **Google Search Console konektor**: imaš li ga već povezan u Lovable workspaceu? Ako ne, trebam te voditi kroz povezivanje prije nego što dohvatim META token.
3. **Lovable Cloud**: treba se uključiti za edge funkciju prijevoda + cache. OK?
