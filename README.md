# Recipes + API

A simple recipe sharing application built with Next.js (App Router), Drizzle ORM, and Cloudflare R2 for image storage.

## Features

- Create, edit and delete recipes
- Upload photos stored in Cloudflare R2
- User authentication with JWT (stored in HTTP-only cookies)
- Search and tag filtering
- Pagination for recipe lists

## Quick start

1. Install dependencies at project root:

```bash
npm install
```

2. Install dependencies for the API (optional if running from root script):

```bash
cd recipes-api
npm install
```

3. Create environment variables. You can place a `.env` file in the repository root or inside `recipes-api/`. Required variables:

- `DATABASE_URL` - Postgres connection (Neon or other)
- `JWT_SECRET` - secret for signing JWTs
- `R2_ENDPOINT` or `R2_ENDPOINT_URL` - Cloudflare R2 endpoint
- `R2_BUCKET_NAME` - R2 bucket
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret
- `R2_PUBLIC_URL` - public base URL for uploaded files (e.g. https://pub-...r2.dev)

Example `.env` (do not commit):

```
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=super-secret
R2_ENDPOINT=https://example.r2.cloudflarestorage.com
R2_BUCKET_NAME=recipes-bucket
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

4. Start development server from repository root:

```bash
npm run dev
```

This runs the script which proxies into `recipes-api` and starts Next.js (App Router). If port 3000 is already in use, Next will pick the next available port and warn about multiple lockfiles — you can ignore this or set `turbopack.root` in `recipes-api/next.config.ts`.

## Useful scripts

- `npm run dev` — start development server
- `npm run build` — build the Next.js app
- `npm run start` — start the production server
- `npm run db:seed` — seed the database (in `recipes-api`)

## Troubleshooting

- Port in use: find PID with `netstat -ano | findstr :3000` and kill with `taskkill /PID <PID> /F`.
- Next warns about workspace root: set `turbopack.root` in `recipes-api/next.config.ts`:

```js
const nextConfig = {
  turbopack: { root: __dirname }
}
export default nextConfig;
```

- Image uploads: ensure R2 env vars are present in either repo root `.env` or `recipes-api/.env`. The API looks for either `R2_ENDPOINT_URL` or `R2_ENDPOINT`.

## Key files

- `recipes-api/src/app` — Next.js pages and API routes
- `recipes-api/src/app/api/recipes/[id]/photo/route.ts` — photo upload handler
- `recipes-api/src/lib/r2.ts` — R2 helper created to load env and build client
- `recipes-api/src/db` — database schema and queries

## Next steps

- Configure a proper production R2 bucket and set env vars on your host
- Add image optimization or CDN rules if needed
- Secure JWT secret and consider refresh tokens for long-lived sessions

If you want, I can add a short `docker-compose` setup or CI deploy steps next.
