import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaArrowRight, FaLock, FaShieldAlt } from "react-icons/fa";
import { authOptions } from "@/lib/auth";

const checkpoints = [
  "La ruta está protegida por middleware y también valida sesión en el servidor.",
  "El usuario autenticado llega desde Google y NextAuth persiste la sesión con JWT.",
  "La navegación a /profile reutiliza la misma sesión sin volver a pedir credenciales.",
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signIn");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="panel-strong rounded-[32px] p-8 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-xs font-medium">Dashboard protegido</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Acceso concedido a la zona privada.
            </h1>
          </div>
          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#14532d] text-2xl text-white sm:flex">
            <FaLock />
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5e5a52]">
          Si puedes ver esta página, el flujo completo está funcionando:
          autenticación con Google, creación de sesión y protección de ruta.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/8 bg-white/75 p-5">
            <p className="text-sm text-[#5e5a52]">Usuario autenticado</p>
            <p className="mt-2 text-xl font-semibold">
              {session.user?.name ?? "Sin nombre"}
            </p>
            <p className="mt-2 text-sm text-[#5e5a52]">{session.user?.email}</p>
          </div>

          <div className="rounded-3xl border border-black/8 bg-white/75 p-5">
            <p className="text-sm text-[#5e5a52]">Método de sesión</p>
            <p className="mt-2 text-xl font-semibold">JWT</p>
            <p className="mt-2 text-sm text-[#5e5a52]">
              Compatible con el middleware de NextAuth.js.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-[#14532d]/12 bg-[#f8fbf5] p-6">
          <p className="text-sm font-medium text-[#14532d]">
            Fragmento útil para la captura del laboratorio
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#163020] p-4 text-sm text-[#f5f5ef]">
            {JSON.stringify(
              {
                user: session.user,
                route: "/dashboard",
                protectedBy: ["middleware", "getServerSession"],
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <div className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3 text-[#14532d]">
            <FaShieldAlt />
            <p className="font-semibold">Qué valida esta pantalla</p>
          </div>
          <div className="mt-5 space-y-3">
            {checkpoints.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-black/8 bg-white/75 p-4 text-sm leading-7 text-[#5e5a52]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel rounded-[32px] p-7">
          <p className="eyebrow text-xs font-medium">Siguiente revisión</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Ver los datos del perfil
          </h2>
          <p className="mt-3 leading-7 text-[#5e5a52]">
            La página de perfil muestra los datos devueltos por Google y sirve
            como segunda evidencia de que la sesión está activa.
          </p>
          <Link
            href="/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0f3f23]"
          >
            Ir al perfil
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
