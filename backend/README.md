# Backend API

Express.js API for music products. Basic CRUD, file uploads, JWT auth.

## Setup

```bash
npm install
cp .env.example .env
# edit .env with database details
npm run migrate up
npm run dev
```

Server runs on http://localhost:3000
API docs at http://localhost:3000/api-docs

## Environment (.env)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/fuga_music
JWT_SECRET=your-secret-here
PORT=3000
```

## Main Endpoints

- `GET /api/v1/products` - list products
- `POST /api/v1/products` - create product (auth required)
- `PUT /api/v1/products/:id` - update product (auth required)
- `DELETE /api/v1/products/:id` - delete product (auth required)
- `POST /api/v1/auth/login` - login
- `POST /api/v1/auth/register` - register

## Scripts

```bash
npm run dev         # development server
npm run build       # build for production
npm test           # run tests
npm run migrate up  # run database migrations
```

## File Uploads

Images saved to `uploads/` directory. Max 5MB, JPEG/PNG/WebP only.

## Database

PostgreSQL with these tables:
- `users` - user accounts
- `products` - music products

Run `npm run migrate up` to create tables.