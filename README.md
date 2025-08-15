# Fuga Music Products

Music product management system. Add albums, upload cover art, basic CRUD stuff.

## Quick Start

```bash
# Docker way (easiest)
docker-compose up

# Manual way
npm install
cp backend/.env.example backend/.env
cd backend && npm run migrate up
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/api-docs

## What's Inside

- **Backend**: Express.js + PostgreSQL + JWT auth
- **Frontend**: React 18 + Redux Toolkit + Vite
- **Features**: CRUD products, image upload, search, auth

## Scripts

```bash
npm run dev              # Start everything
npm run dev:backend      # Backend only (port 8000)
npm run dev:frontend     # Frontend only (port 3000)
npm run build           # Build for production
npm run test            # Run tests
npm run db:reset        # Reset DB with sample data
```

## Environment

Backend needs `.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/fuga_music
JWT_SECRET=some-secret-key
PORT=8000
```

That's it. Check individual README files in `backend/` and `frontend/` for more details.
