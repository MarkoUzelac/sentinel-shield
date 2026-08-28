# Sentinel Shield

Sentinel Shield is a security-focused web interface for situational awareness, built with React, TypeScript and Vite. The current map layer uses **MapLibre GL JS** with **OpenFreeMap**, providing an open-source map renderer without a Mapbox runtime dependency.

## Current status

The active map work is being developed on `feat/maplibre-openfreemap` and is proposed in **PR #1**.

Implemented in the current branch:

- MapLibre GL JS map renderer
- OpenFreeMap map style
- Browser geolocation with user-location display
- Map reset/recenter control
- Security map integrated into the main application
- GitHub repository link in the application footer
- `mapbox-gl` removed from the application dependencies

> CI/build verification should be completed before merging the map branch into `main`.

## Technology stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui / Radix UI
- MapLibre GL JS
- OpenFreeMap
- React Router
- TanStack Query

## Development

### Requirements

- Node.js 18+ (Node.js 20+ recommended)
- npm

### Install

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview the production build

```bash
npm run preview
```

## Map architecture

The map is intentionally based on open technologies:

```text
React UI
   ↓
SecurityMap
   ↓
MapLibre GL JS
   ↓
OpenFreeMap style / tiles
```

Browser geolocation is requested only when the user activates the location functionality. If location permission is denied or unavailable, the map continues without fabricating a user position.

## Security principles

Sentinel Shield should distinguish between:

- real observed data
- provider-derived/enriched data
- unavailable data
- UI state

The application must not invent device positions, network identities, threat observations or other security evidence merely to make the interface appear populated.

Secrets and API keys must never be committed to the repository. Use environment variables or the hosting platform's secret management for credentials.

## GitHub Actions

The repository should use CI to validate every important application change before release. The recommended web CI sequence is:

```text
npm ci → npm run lint → npm run build → artifact/preview verification
```

A build workflow should fail on compilation, type-checking or lint errors rather than masking them.

## Google AI Studio prompt

Use the following prompt in Google AI Studio when asking an AI coding agent to continue Sentinel Shield:

```text
You are working on the GitHub repository MarkoUzelac/sentinel-shield.

GOAL:
Continue Sentinel Shield as a production-oriented security situational-awareness web application. Preserve the existing architecture and do not replace working components with mock implementations.

CURRENT MAP IMPLEMENTATION:
- React + TypeScript + Vite
- MapLibre GL JS is the map renderer
- OpenFreeMap is the current open map style/provider
- mapbox-gl must NOT be reintroduced
- SecurityMap is integrated into the main page
- Browser geolocation and map reset/recenter are implemented

FIRST TASK:
Inspect the repository and the current branch before changing anything. Read package.json, README.md, the SecurityMap component, the main page, routing, and all GitHub Actions workflows.

THEN IMPLEMENT ALL NECESSARY NEXT STEPS:
1. Make the map implementation production-safe and responsive.
2. Preserve MapLibre + OpenFreeMap; do not migrate to Mapbox.
3. Handle geolocation permission denied, unavailable position, timeout and browser-insecure-context cases explicitly.
4. Never fabricate coordinates or security observations.
5. Add clear loading/error/empty states for the map.
6. Add cleanup for MapLibre instances, event listeners and geolocation watchers.
7. Prevent duplicate map initialization during React development/StrictMode lifecycle.
8. Add/update TypeScript types and eliminate unsafe any usage where practical.
9. Verify the map works on desktop and mobile layouts.
10. Add a real GitHub Actions workflow for the web project:
    npm ci
    npm run lint
    npm run build
    verify the production dist artifact
11. Make the workflow run on pushes to main, pull requests, and workflow_dispatch.
12. Cache npm dependencies using the package-lock lockfile.
13. Do not add secrets or hard-coded API keys.
14. Update README.md so it accurately describes the current architecture and CI process.

QUALITY GATE:
- Run the actual available checks.
- Fix every real TypeScript, ESLint, build or workflow error reported by the repository.
- Do not claim success without an actual successful command or GitHub Actions result.
- Keep changes focused and production-oriented.
- Review the final diff for dead code, duplicate workflows, dependency conflicts and accidental Mapbox references.

FINAL OUTPUT:
Report exactly what was changed, which checks actually passed, which checks could not be executed, and any remaining blocker. Do not invent test/build results.
```

## Repository

- GitHub: `MarkoUzelac/sentinel-shield`
- Active map branch: `feat/maplibre-openfreemap`
- Current map PR: `#1`
