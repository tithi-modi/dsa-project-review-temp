# Dairy Co-op Portal — Frontend

React (Vite) frontend for the MERN dairy co-op app. Talks to the Express
backend in the `Dummy` repo, using the endpoints documented in
`docs/api-contracts.md` there.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # points at http://localhost:5000 by default
npm run dev
```

Make sure the backend (`Dummy` repo) is running on port 5000 at the same time
(`npm start` / `node server.js` in that repo), otherwise API calls will fail.

## Structure

```
src/
  api/client.js          # one function per backend endpoint (axios)
  context/AuthContext.jsx# holds logged-in user + role, persisted to localStorage
  components/PageHeader.jsx
  pages/
    Home.jsx              # role selection screen (matches Figma)
    Login.jsx             # shared login for manager/staff/farmer
    ManagerDashboard.jsx   # analytics + route optimization
    StaffEntry.jsx         # intake submission form + live queue
    FarmerDashboard.jsx    # farmer profile (+ placeholder for history)
  App.jsx                 # routes
```

## Routes

| Path             | Page                          |
|------------------|--------------------------------|
| `/`              | Role selection (home)          |
| `/login/manager` | Manager login                  |
| `/login/staff`   | Staff login                    |
| `/login/farmer`  | Farmer ID lookup                |
| `/manager`       | Manager dashboard               |
| `/staff`         | Collection staff entry desk     |
| `/farmer`        | Farmer dashboard                 |

## Notes / known gaps (mirrors `docs/api-contracts.md` section 12.5)

These are backend gaps, not frontend bugs — flagged here so the team can
prioritize them:

- No dedicated **farmer login/auth** endpoint yet — the farmer "login" screen
  currently just looks the farmer up via `GET /api/farmers/:id`.
- No **farmer delivery/payout history** endpoint yet — `FarmerDashboard.jsx`
  has a placeholder card ready to receive a list of `CollectionLog` entries.
- Farmer ID ranges differ between generated data (`FARM-001`-`FARM-100`) and
  the intake-queue stub (`FARM-101`-`FARM-103`) — expect the demo queue and
  farmer lookups not to line up until that's reconciled on the backend.

## Priorities for this pass

This scaffold prioritizes **working data flow over visual design** per the
brief — every screen hits the real (stubbed) backend endpoints and handles
loading/error states, but styling is intentionally minimal (`src/index.css`).
Swap in the full Figma designs once the flows are confirmed working.
