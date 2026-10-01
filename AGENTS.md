# Base44 Dev Environment

## Stack
- Vite 6 + React 19 + TypeScript frontend (Tailwind CSS v4 via `@tailwindcss/vite`).
- Package manager: **Bun** (lockfile `bun.lock` uses `lockfileVersion: 1`, which requires Bun **>= 1.2**). Do NOT use Bun 1.1 — it cannot parse the lockfile.
- Pure frontend app; no backend service. `@google/genai` is listed as a dependency but is **not imported anywhere in `src/`**, so no `GEMINI_API_KEY` is needed to boot.

## Running
```
docker compose -f docker-compose.base44.yml up -d --build
```
- Service `web` runs `bun install --frozen-lockfile` then `bun dev` (resolves to `vite --port=3000 --host=0.0.0.0`).
- `node_modules` is a named volume so installs don't clobber the bind-mounted source.
- Vite is allowed to accept the preview's external hostname via `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` (set by the platform).

## Verifying
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → expect `200`.
- Dev server confirmed by `/@react-refresh` and `/@vite/client` scripts in the served HTML (not a prebuilt bundle).
- Healthcheck probes `http://127.0.0.1:3000/` via wget.

## Notes
- `vite.config.ts` disables HMR + file watching when `DISABLE_HMR=true` (an AI Studio artifact). Leave it unset here so live reload works.
- `.env.example` references `GEMINI_API_KEY` / `APP_URL`, but neither is read by the app code; they are not required.
