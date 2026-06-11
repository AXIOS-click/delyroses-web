# Obtener URL y Secret de Supabase

## 1. Entrar al proyecto

Abre Supabase y entra al proyecto donde vas a guardar los pedidos.

```text
https://supabase.com/dashboard/projects
```

## 2. Copiar la URL

En el menú lateral ve a:

```text
Project Settings > API
```

Busca la sección `Project URL` y copia el valor de `URL`.

Ese valor va en `.env.local` así:

```bash
SUPABASE_URL=https://TU_PROYECTO.supabase.co
```

## 3. Copiar el secret

En la misma pantalla:

```text
Project Settings > API
```

Busca la sección `Project API keys` y copia la key llamada `service_role`.

Ese valor va en `.env.local` así:

```bash
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

## 4. Archivo final

Tu `.env.local` mínimo debería quedar así:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CURRENCY=USD
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

## Importante

No uses `NEXT_PUBLIC_` para `SUPABASE_SERVICE_ROLE_KEY`.

La `service_role` puede saltarse las reglas de seguridad de Supabase. Debe existir solo en el servidor y nunca exponerse al navegador.
