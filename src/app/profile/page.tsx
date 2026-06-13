import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaArrowRight, FaFingerprint, FaUserShield } from "react-icons/fa";
import { authOptions } from "@/lib/auth";

function InitialsFallback({ label }: { label: string }) {
  const initial = label.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#14532d] text-4xl font-semibold text-white">
      {initial}
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signIn");
  }

  const userLabel = session.user?.name ?? session.user?.email ?? "Usuario";

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="panel-strong rounded-[32px] p-8">
        <p className="eyebrow text-xs font-medium">Perfil autenticado</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Datos de la cuenta devueltos por Google.
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={userLabel}
              width={112}
              height={112}
              className="h-28 w-28 rounded-[32px] object-cover"
            />
          ) : (
            <InitialsFallback label={userLabel} />
          )}

          <div>
            <p className="text-2xl font-semibold">{userLabel}</p>
            <p className="mt-2 text-[#5e5a52]">{session.user?.email}</p>
            <div className="chip mt-4 inline-flex rounded-full px-4 py-2 text-sm font-medium">
              Sesión validada con NextAuth.js
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="rounded-3xl border border-black/8 bg-white/80 p-5">
            <p className="text-sm text-[#5e5a52]">Proveedor configurado</p>
            <p className="mt-2 text-lg font-semibold">GoogleProvider</p>
          </div>
          <div className="rounded-3xl border border-black/8 bg-white/80 p-5">
            <p className="text-sm text-[#5e5a52]">Página protegida</p>
            <p className="mt-2 text-lg font-semibold">/profile</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3 text-[#14532d]">
            <FaFingerprint />
            <p className="font-semibold">Campos visibles</p>
          </div>
          <dl className="mt-5 space-y-4">
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              <dt className="text-sm text-[#5e5a52]">Nombre</dt>
              <dd className="mt-2 font-semibold">{session.user?.name ?? "N/D"}</dd>
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              <dt className="text-sm text-[#5e5a52]">Correo</dt>
              <dd className="mt-2 font-semibold">{session.user?.email ?? "N/D"}</dd>
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              <dt className="text-sm text-[#5e5a52]">Imagen</dt>
              <dd className="mt-2 font-semibold">
                {session.user?.image ? "Disponible" : "No enviada por Google"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3 text-[#14532d]">
            <FaUserShield />
            <p className="font-semibold">Comprobación de seguridad</p>
          </div>
          <p className="mt-4 leading-7 text-[#5e5a52]">
            Esta página combina dos capas de control: primero el middleware evita
            el acceso anónimo y luego el componente del servidor vuelve a validar
            la sesión antes de renderizar.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:border-[#14532d]/30"
          >
            Volver al dashboard
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
