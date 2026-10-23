# Tienda online de chocolates artesanales

El nombre de la tienda se cambia en una sola línea: `BRAND_NAME` en `src/lib/constants.ts`.

Next.js 15 (App Router) · TypeScript estricto · Tailwind CSS · Prisma · MySQL

## Puesta en marcha
```bash
cp .env.example .env        # completa DATABASE_URL, ADMIN_PASSWORD y AUTH_SECRET
npm install
npx prisma db push          # crea las tablas (o: npm run db:migrate)
npm run db:seed             # carga categorías y 25 productos
npm run dev
```
- Tienda: http://localhost:3000
- Admin:  http://localhost:3000/admin
- Fotos: guarda cada imagen en `public/images/products/<slug>.jpg` (el slug sale del nombre; ej. `caja-de-trufas-x-10-unidades.jpg`). Si falta, se muestra un placeholder.

## Estructura
```
prisma/            schema.prisma, seed.ts
src/app/           rutas (/, /carrito, /checkout, /admin, /admin/login)
src/components/    layout (Navbar, FloatingCartButton, Footer)
src/features/
  productos/       catálogo, filtros, tarjeta, modal de detalle, aviso de precios
  carrito/         contexto del carrito (localStorage), filas y resumen
  checkout/        schema Zod, Server Action createOrder, formulario
  admin/           sesión JWT, acciones (login, estado), lista de pedidos
src/lib/           prisma, formato COP, WhatsApp, constantes
src/middleware.ts  protege /admin/*
```
