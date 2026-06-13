# Lab13_WebAvanzado

Aplicación de laboratorio construida con Next.js y NextAuth.js.

Incluye:

- Inicio de sesión con credenciales
- Registro de usuarios
- Cifrado de contraseñas con `bcrypt`
- Bloqueo temporal por intentos fallidos
- Inicio de sesión con Google
- Inicio de sesión con GitHub
- Rutas protegidas con middleware

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Variables de entorno

Crea `.env.local` con:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

## Despliegue

El proyecto está preparado para desplegarse en Vercel como aplicación Next.js.
