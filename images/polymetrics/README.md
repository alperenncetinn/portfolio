# PolyMetrics

PolyMetrics is an industrial analytics dashboard project with a React frontend and two Express servers:

- Main API server for tag, alarm, and statistics data
- Configuration/Auth server for PI and Microsoft SSO settings

The project is designed for local development with mock data and can be adapted to real PI Web API integrations.

## Core Features

- Dashboard overview for quick system visibility
- Multi-axis time series analysis
- Tag directory and tag-level drill down
- Statistics page (summary and distribution style outputs)
- Alarm listing and filtering
- Protected routes with login flow
- Dual auth path:
  - Local admin login fallback
  - Microsoft SSO (when configured)
- Swagger API documentation for backend endpoints

## Screenshots

### Dashboard Overview

![Dashboard Overview](ss/dashboard.png)

### Multi-Axis Analysis

![Multi-Axis Analysis](ss/multiaxis-analyse.png)

### Statistics Panel

![Statistics Panel](ss/statistic.png)

## Project Structure

```
PolyMetrics/
  src/                  # React app
  server/
    src/
      api-server.ts     # Main API server (port 3001)
      config-server.ts  # Config/Auth server (port 3002)
  config.json           # Runtime configuration consumed by config server
  start.sh              # Starts frontend + both servers
  restart.sh            # Kills ports and restarts all services
```

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router
- Charts/visualization: lightweight-charts, recharts
- Backend: Express, TypeScript, swagger-jsdoc, swagger-ui-express
- Auth/SSO: express-session, @azure/msal-node

## Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended
- macOS/Linux shell for start.sh and restart.sh usage

## Installation

Install root dependencies:

```bash
npm install
```

Install server dependencies:

```bash
cd server
npm install
cd ..
```

## Run The Project

### Option 1: Start everything with one script

```bash
chmod +x start.sh
./start.sh
```

This starts:

- Config server: http://localhost:3002
- Main API server: http://localhost:3001
- API docs: http://localhost:3001/api-docs
- Frontend: http://localhost:5173

These URLs are for development. Production HTTPS is expected to terminate at a reverse proxy such as Nginx.

### Option 2: Start services manually

In terminal 1:

```bash
cd server
npm run start:config
```

In terminal 2:

```bash
cd server
npm run start:api
```

In terminal 3:

```bash
npm run dev
```

### Restart all services

```bash
chmod +x restart.sh
./restart.sh
```

## Auth Flow

### Local admin fallback

The frontend includes a local admin fallback login path for development.

Current hardcoded credentials in source:

- Username: admin
- Password: SasaAdmin123

Important: This is development-only behavior and should be replaced before production usage.

### Microsoft SSO

Microsoft SSO is enabled when the following fields are configured and authMethod is microsoft-sso:

- microsoftTenantId
- microsoftClientId
- microsoftClientSecret

Config/Auth endpoints are exposed under `config-api` on the frontend and proxied to port 3002.

Microsoft Entra setup checklist for this project:

- In Azure Entra admin center > App registrations > your app > Overview:
  - `Directory (tenant) ID` -> `microsoftTenantId`
  - `Application (client) ID` -> `microsoftClientId`
- In Certificates & secrets:
  - Client secret `Value` -> `microsoftClientSecret`
- In Authentication > Add a platform:
  - Platform type -> `Web`
  - Redirect URI -> `https://<your-host>/api/auth/microsoft/callback`
  - Optional front-channel/logout return URL -> your chosen logout landing page
- In this app config:
  - `authMethod` must be `microsoft-sso`
  - `microsoftRedirectUri` must exactly match the Redirect URI in Entra
  - `microsoftPostLogoutRedirectUri` should be the page users land on after logout

Important: Microsoft Entra requires `https://` redirect URIs outside localhost. `http://10.x.x.x/...` style internal IP callbacks will not be accepted in normal Entra web app registrations.

## Runtime Configuration

Runtime settings are stored in config.json at repository root and managed by the config server.

Relevant keys:

- piServerUrl
- authMethod
- piUsername
- piPassword
- defaultDatabaseId
- microsoftTenantId
- microsoftClientId
- microsoftClientSecret
- microsoftRedirectUri
- microsoftPostLogoutRedirectUri

When fetching config from API, secret fields are masked as ********.

## API Overview

Base URL: http://localhost:3001

Main endpoints:

- GET /api/status
- GET /api/tags
- POST /api/tags
- GET /api/tags/:tagId
- GET /api/tags/:tagId/values
- GET /api/tags/:tagId/summary
- GET /api/alarms
- POST /api/data/multiple

Interactive docs:

- http://localhost:3001/api-docs

## HTTPS Reverse Proxy

The repository now includes an example Nginx SSL config at `deploy/nginx/polymetrics.conf.example`.
The repository also includes a ready-to-adapt production config at `deploy/nginx/polymetrics.conf`.

Suggested production layout:

- Nginx terminates HTTPS on `443`
- Frontend static build is served from `dist/`
- Main API stays internal on `127.0.0.1:3001`
- Config/Auth server stays internal on `127.0.0.1:3002`
- Public routes:
  - `/` -> frontend
  - `/api` -> main API server
  - `/api-docs` -> Swagger UI
  - `/config-api` -> config/auth API
  - `/config/` -> config UI

Recommended production environment variables:

```bash
API_HOST=127.0.0.1
CONFIG_HOST=127.0.0.1
PUBLIC_API_BASE_PATH=/config-api
```

With this setup, Microsoft SSO callback URLs should use the public HTTPS address, for example:

- `https://polymetrics.example.com/config-api/auth/microsoft/callback`
- `https://polymetrics.example.com/`

## Systemd Services

Production service files are included under `deploy/systemd/`:

- `polymetrics-api.service`
- `polymetrics-config.service`
- `polymetrics.target`

Environment files are included under `deploy/env/`:

- `polymetrics-api.env`
- `polymetrics-config.env`

Quick install helper:

```bash
chmod +x deploy/scripts/install-production.sh
./deploy/scripts/install-production.sh
```

This installer expects:

- Nginx to be installed
- TLS certificate files to exist at:
  - `/etc/ssl/polymetrics/fullchain.pem`
  - `/etc/ssl/polymetrics/privkey.pem`
- The deployment path to remain `/home/srvadm/polymetrics/polymetrics`

Useful service commands:

```bash
sudo systemctl status polymetrics-api.service
sudo systemctl status polymetrics-config.service
sudo systemctl restart polymetrics-api.service
sudo systemctl restart polymetrics-config.service
sudo journalctl -u polymetrics-api.service -f
sudo journalctl -u polymetrics-config.service -f
```

## Frontend Routing

- /login
- /dashboard
- /analysis
- /tags
- /statistics

All application routes except /login are protected behind auth checks.

## Available Scripts

Root package scripts:

- npm run dev: Start Vite dev server
- npm run build: TypeScript build + Vite production build
- npm run lint: Run ESLint
- npm run preview: Preview production build

Server package scripts:

- npm run start:config: Start config/auth server (3002)
- npm run start:api: Start main API server (3001)
- npm run dev: Start both server processes

## Build For Production

Frontend production build:

```bash
npm run build
```

Preview build locally:

```bash
npm run preview
```

## Notes

- Frontend proxy rules are defined in vite.config.ts:
  - /api -> http://localhost:3001
  - /config-api -> http://localhost:3002/api
- Swagger definitions are generated from server/src/routes/*.ts annotations.
- Existing backend data layer currently uses mock-style behavior suitable for development.
