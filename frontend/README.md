# Frontend

React app for music product management. Add products, upload images, search stuff.

## Setup

```bash
npm install
npm run dev
```

Runs on http://localhost:3001
Backend API calls proxy to http://localhost:3000

## Features

- Product list with search
- Add/edit/delete products
- Drag & drop image upload
- User login/register
- Responsive design (kinda)

## Tech Stack

- React 18 + TypeScript
- Redux Toolkit for state
- Vite for dev server
- CSS Modules for styling

## Scripts

```bash
npm run dev     # development server
npm run build   # build for production
npm run preview # preview production build
npm test       # run tests
```

## Folder Structure

```
src/
├── components/     # React components
├── store/         # Redux store + slices
├── hooks/         # Custom hooks
├── types/         # TypeScript types
└── App.tsx        # Main app component
```

Backend should be running on port 3000 for API calls to work.
