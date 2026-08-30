# Umang Foundation — Backend API

Node.js + Express + MongoDB backend for the Umang Foundation website (Diploma CSE project).

## Features

- User signup/login with JWT auth (roles: Volunteer, Donor, NGO Partner, Beneficiary)
- Contact form submissions stored in MongoDB
- Donation submissions with auto-generated receipt IDs
- Read-only Gallery and Team endpoints
- Simple env-based Admin login to view messages, donations and stats

## Local Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # or: npm start
```

Server runs at `http://localhost:8080` by default.

## Environment Variables

| Variable       | Description                                             |
|----------------|----------------------------------------------------------|
| PORT           | Port to run the server on (Railway sets this itself)     |
| MONGO_URI      | MongoDB Atlas connection string                          |
| JWT_SECRET     | Long random string used to sign JWTs                     |
| CLIENT_ORIGIN  | Allowed frontend origin for CORS (`*` for any origin)     |
| ADMIN_EMAIL    | Email used to log into the admin endpoints                |
| ADMIN_PASSWORD | Password used to log into the admin endpoints             |

## API Endpoints

### Auth
- `POST /api/auth/signup` — `{ fullName, email, password, role }`
- `POST /api/auth/login` — `{ email, password }`
- `GET  /api/auth/me` — requires `Authorization: Bearer <token>`

### Contact
- `POST /api/contact` — `{ fullName, email, phone, subject, message }`
- `GET  /api/contact` — admin only

### Donations
- `POST /api/donate` — `{ fullName, email, amount, campaign, cycle }`
- `GET  /api/donate` — admin only

### Gallery / Team (read-only)
- `GET /api/gallery?category=education`
- `GET /api/team`

### Admin
- `POST /api/admin/login` — `{ email, password }` → returns admin token
- `GET  /api/admin/stats` — admin only

## Getting a free MongoDB database

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free (M0) cluster.
3. Under **Database Access**, create a DB user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Railway can connect.
5. Click **Connect → Drivers**, copy the connection string, and paste it into `MONGO_URI` (replace `<password>` with your DB user's password).

## Deploying to Railway

1. Push this repo (including the `backend/` folder) to GitHub.
2. On [railway.app](https://railway.app), create a **New Project → Deploy from GitHub repo**, select this repo.
3. Set the service's **Root Directory** to `/backend`.
4. Add the environment variables above under the service's **Variables** tab.
5. Railway auto-detects Node and runs `npm install && npm start`. It also injects its own `PORT`.
6. Once deployed, copy the public domain Railway gives you (e.g. `https://umang-backend-production.up.railway.app`) and put it into `js/config.js` in the frontend as `API_BASE_URL`.
