# Checkout, Supabase y Zustand

## Qué quedó integrado

El carrito vive localmente en `src/store/cart-store.ts` usando Zustand con persistencia en `localStorage`.

El checkout envía el carrito a `POST /api/orders`. El servidor no confía en precios del navegador: recibe `productId` y `quantity`, busca cada producto en el catálogo JSON y recalcula subtotal, envío y total antes de guardar en Supabase.

La base de datos solo guarda clientes, pedidos y productos comprados como snapshot del pedido. El catálogo principal sigue viviendo en JSON.

## Rutas principales

Carrito local: `src/store/cart-store.ts`

Agregar al carrito: `src/components/cart/add-to-cart-panel.tsx`

Carrito: `src/components/cart/cart-view.tsx`

Checkout: `src/components/checkout/checkout-form.tsx`

API de pedidos: `src/app/api/orders/route.ts`

Migración SQL: `supabase/migrations/20260611000000_create_orders.sql`

## Variables de entorno

Este proyecto usa Supabase remoto en servidor, no Supabase local.

Tu proyecto remoto es:

```text
fklyicynndyxuhbnctsg
```

La URL correcta para `@supabase/supabase-js` debe ser la URL base del proyecto, sin `/rest/v1/`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CURRENCY=USD
SUPABASE_URL=https://fklyicynndyxuhbnctsg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=PEGAR_SERVICE_ROLE_KEY_AQUI
```

`SUPABASE_SERVICE_ROLE_KEY` debe quedarse únicamente en el servidor.

Si no sabes dónde conseguir esos valores, revisa `docs/supabase-credentials.md`.

## Aplicar la base de datos en Supabase remoto

Ejecuta estos comandos desde la raíz del proyecto:

```powershell
npm install -g supabase
supabase login
supabase link --project-ref fklyicynndyxuhbnctsg
pnpm supabase:db:push
```

El comando `supabase login` abre el navegador para autenticarte.

El comando `supabase link --project-ref fklyicynndyxuhbnctsg` puede pedir la contraseña de base de datos del proyecto Supabase.

El comando `pnpm supabase:db:push` aplica esta migración en Supabase remoto:

```text
supabase/migrations/20260611000000_create_orders.sql
```

## Levantar la app en este servidor

Desde la raíz del proyecto:

```bash
pnpm install
pnpm build
pnpm start
```

La app queda escuchando en `http://localhost:3000`.

## Levantar en un VPS Linux desde cero

Estos comandos son para Ubuntu/Debian. Ejecútalos en el servidor donde quedará corriendo Next.js.

1. Instalar Node.js 22 y pnpm:

```bash
sudo apt-get update
sudo apt-get install -y curl ca-certificates
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
corepack prepare pnpm@11.5.3 --activate
```

2. Instalar Supabase CLI:

```bash
npm install -g supabase
```

3. Entrar a la carpeta del proyecto:

```bash
cd /ruta/al/proyecto/DELYROSES
```

4. Crear el archivo `.env` en el servidor:

```bash
cp .env.example .env
nano .env
```

Dentro de `.env`, deja como mínimo:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CURRENCY=USD
SUPABASE_URL=https://fklyicynndyxuhbnctsg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=PEGAR_SERVICE_ROLE_KEY_AQUI
```

5. Instalar dependencias:

```bash
pnpm install --frozen-lockfile
```

6. Aplicar migraciones al Supabase remoto:

```bash
supabase login
supabase link --project-ref fklyicynndyxuhbnctsg
pnpm supabase:db:push
```

7. Compilar y levantar Next.js:

```bash
pnpm build
pnpm start
```

## Levantar con PM2 en el servidor

Si quieres que el proceso quede corriendo después de cerrar la terminal:

```bash
npm install -g pm2
pnpm build
pm2 start "pnpm start" --name dely-roses
pm2 save
pm2 startup
```

Después de `pm2 startup`, PM2 imprime un comando con `sudo env PATH=...`. Ejecuta exactamente el comando que PM2 imprime en tu servidor.

Comandos útiles:

```bash
pm2 status
pm2 logs dely-roses
pm2 restart dely-roses
pm2 stop dely-roses
```

## Aplicar SQL manualmente sin CLI

Si no quieres usar Supabase CLI, abre el SQL Editor de Supabase y ejecuta el contenido de:

```text
supabase/migrations/20260611000000_create_orders.sql
```

Tablas creadas:

`customers`: datos del cliente por email.

`orders`: pedido principal, totales y dirección/notas.

`order_items`: productos comprados con snapshot del producto en ese momento.

## Validar que el checkout usa Supabase remoto

1. Levanta la app con `pnpm start`.
2. Abre `http://localhost:3000/producto/ramo-rosas-rojas`.
3. Agrega el producto al carrito.
4. Entra a `/checkout`.
5. Completa nombre, email y teléfono.
6. Confirma el pedido.
7. En Supabase Dashboard, revisa estas tablas:

```text
Table Editor > customers
Table Editor > orders
Table Editor > order_items
```

## Flujo actual

1. El cliente entra a un producto y selecciona cantidad.
2. `AddToCartPanel` guarda el producto en Zustand y navega a `/carrito`.
3. El carrito permite sumar, restar o quitar productos.
4. `/checkout` toma el carrito local y pide datos del cliente.
5. `POST /api/orders` recalcula el pedido desde JSON y guarda en Supabase.
6. Si todo sale bien, limpia el carrito y navega a `/confirmacion/[orderNumber]`.

## Pendiente para la siguiente etapa

Agregar el JSON de sectores de envío y sumar ese costo al total antes de crear el pedido.

Crear la página de pedidos anteriores por email del cliente.
