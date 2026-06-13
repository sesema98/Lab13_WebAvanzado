import Link from "next/link";
import { getServerSession } from "next-auth";
import { FaArrowRight, FaRoute, FaShieldAlt, FaUserLock } from "react-icons/fa";
import { authOptions } from "@/lib/auth";

const highlights = [
  {
    title: "Tres métodos de acceso",
    description:
      "La aplicación ahora separa claramente acceso por credenciales, Google OAuth y GitHub OAuth.",
    icon: FaUserLock,
  },
  {
    title: "Sesiones persistentes",
    description:
      "La sesión se comparte entre páginas mediante SessionProvider y se consulta en el servidor con getServerSession.",
    icon: FaUserLock,
  },
  {
    title: "Rutas protegidas",
    description:
      "El middleware restringe el acceso a /dashboard y /profile para usuarios autenticados.",
    icon: FaRoute,
  },
  {
    title: "Seguridad por secreto",
    description:
      "NEXTAUTH_SECRET cifra y firma la sesión para que el middleware y la API usen la misma clave.",
    icon: FaShieldAlt,
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-strong grid-sheen rounded-[34px] p-8 sm:p-10">
          <p className="eyebrow text-xs font-medium">Desarrollo Web Avanzado</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#1c1b18] sm:text-5xl">
            Autenticación segura con Google, sesiones activas y rutas privadas.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5e5a52]">
            Esta implementación cubre todo el laboratorio previo a la tarea:
            configuración de NextAuth.js, login con Google OAuth, páginas
            protegidas y uso de middleware.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0f3f23]"
                >
                  Ir al dashboard
                  <FaArrowRight />
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:border-[#14532d]/30"
                >
                  Ver perfil
                </Link>
              </>
            ) : (
              <Link
                href="/signIn"
                className="inline-flex items-center gap-2 rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0f3f23]"
              >
                Elegir método de acceso
                <FaArrowRight />
              </Link>
            )}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-black/8 bg-white/70 p-4">
              <p className="text-sm text-[#5e5a52]">Acceso</p>
              <p className="mt-2 text-lg font-semibold">Credentials + OAuth</p>
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/70 p-4">
              <p className="text-sm text-[#5e5a52]">Protección</p>
              <p className="mt-2 text-lg font-semibold">Middleware JWT</p>
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/70 p-4">
              <p className="text-sm text-[#5e5a52]">Rutas privadas</p>
              <p className="mt-2 text-lg font-semibold">/dashboard y /profile</p>
            </div>
          </div>
        </div>

        <div className="panel rounded-[34px] p-8">
          <p className="eyebrow text-xs font-medium">Estado actual</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            {session ? "Sesión detectada" : "Falta configurar credenciales"}
          </h2>
          <p className="mt-4 text-[#5e5a52]">
            {session
              ? `Ingresaste como ${session.user?.name ?? session.user?.email}. Ya puedes tomar las capturas del dashboard y del perfil.`
              : "La interfaz está lista. Solo debes completar las credenciales del método que quieras activar en .env.local."}
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-black/8 bg-white/75 p-4">
              <p className="text-sm font-medium text-[#14532d]">
                Ruta de callback requerida
              </p>
              <code className="mt-2 block overflow-x-auto text-sm text-[#1c1b18]">
                {baseUrl}/api/auth/callback/google
              </code>
            </div>

            <div className="rounded-3xl border border-black/8 bg-white/75 p-4">
              <p className="text-sm font-medium text-[#14532d]">
                Métodos disponibles
              </p>
              <code className="mt-2 block overflow-x-auto text-sm text-[#1c1b18]">
                CredentialsProvider
                <br />
                GoogleProvider
                <br />
                GitHubProvider
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon }) => (
          <article key={title} className="panel rounded-[28px] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff8ea] text-2xl text-[#14532d]">
              <Icon />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 leading-7 text-[#5e5a52]">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
