"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaGithub, FaRoute, FaShieldAlt, FaUserLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import CredentialsAuthPanel from "@/components/CredentialsAuthPanel";
import OAuthProviderButton from "@/components/OAuthProviderButton";

type AuthAccessHubProps = {
  baseUrl: string;
  initialError: string | null;
  providerStatus: {
    google: boolean;
    github: boolean;
  };
};

const mappedErrors: Record<string, string> = {
  AccessDenied:
    "El acceso fue denegado por el proveedor o por la configuración de la aplicación.",
  Configuration:
    "Hay un problema de configuración. Revisa tus variables de entorno.",
  CredentialsSignin: "No se pudo iniciar sesión con credenciales.",
  OAuthAccountNotLinked:
    "Ese correo ya está asociado a otro método. Usa el método original o una cuenta distinta.",
  OAuthCallback:
    "El proveedor devolvió un error en el callback. Revisa las URLs autorizadas.",
  OAuthCreateAccount:
    "No se pudo crear la cuenta con el proveedor OAuth.",
  SessionRequired:
    "Debes iniciar sesión antes de visitar esa ruta.",
};

function resolveErrorMessage(error: string | null) {
  if (!error) {
    return null;
  }

  return mappedErrors[error] ?? error;
}

export default function AuthAccessHub({
  baseUrl,
  initialError,
  providerStatus,
}: AuthAccessHubProps) {
  const { status } = useSession();
  const router = useRouter();
  const [errorMessage] = useState(() => resolveErrorMessage(initialError));

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  const configuredProviders = useMemo(
    () =>
      [
        providerStatus.google ? "Google" : null,
        providerStatus.github ? "GitHub" : null,
        "Credenciales",
      ].filter(Boolean),
    [providerStatus.github, providerStatus.google],
  );

  return (
    <section className="space-y-6">
      <div className="panel-strong rounded-[32px] p-8 sm:p-10">
        <p className="eyebrow text-xs font-medium">Tarea aplicada</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Tres métodos de acceso, visibles y separados en una sola pantalla.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5e5a52]">
          La aplicación ahora soporta `CredentialsProvider`, `GoogleProvider` y
          `GitHubProvider`, con registro local, contraseñas cifradas con `bcrypt`
          y bloqueo temporal por intentos fallidos.
        </p>

        {errorMessage ? (
          <div className="mt-6 rounded-3xl border border-[#7c2d12]/20 bg-[#fff1eb] p-4 text-sm leading-7 text-[#7c2d12]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {configuredProviders.map((provider) => (
            <div key={provider} className="chip rounded-full px-4 py-2 font-medium">
              {provider}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff8ea] text-2xl text-[#14532d]">
              <FaUserLock />
            </div>
            <div>
              <p className="font-semibold">1. Credenciales</p>
              <p className="text-sm text-[#5e5a52]">Correo + contraseña propia</p>
            </div>
          </div>

          <div className="mt-6">
            <CredentialsAuthPanel />
          </div>
        </article>

        <article className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff8ea] text-2xl">
              <FcGoogle />
            </div>
            <div>
              <p className="font-semibold">2. Google OAuth</p>
              <p className="text-sm text-[#5e5a52]">
                Inicio de sesión con cuenta Google
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#5e5a52]">
            Usa la URL de callback `{baseUrl}/api/auth/callback/google`.
          </p>

          <OAuthProviderButton
            provider="google"
            icon={FcGoogle}
            label={
              providerStatus.google
                ? "Entrar con Google"
                : "Configura GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET"
            }
            disabled={!providerStatus.google}
            className="mt-6 w-full bg-white text-[#1c1b18] ring-1 ring-black/10 hover:bg-[#f8f6f1]"
          />
        </article>

        <article className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff8ea] text-2xl text-[#1c1b18]">
              <FaGithub />
            </div>
            <div>
              <p className="font-semibold">3. GitHub OAuth</p>
              <p className="text-sm text-[#5e5a52]">
                Inicio de sesión con cuenta GitHub
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#5e5a52]">
            Usa la URL de callback `{baseUrl}/api/auth/callback/github`.
          </p>

          <OAuthProviderButton
            provider="github"
            icon={FaGithub}
            label={
              providerStatus.github
                ? "Entrar con GitHub"
                : "Configura GITHUB_CLIENT_ID y GITHUB_CLIENT_SECRET"
            }
            disabled={!providerStatus.github}
            className="mt-6 w-full bg-[#1f2937] text-white hover:bg-[#111827]"
          />
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3 text-[#14532d]">
            <FaShieldAlt />
            <p className="font-semibold">Seguridad implementada</p>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-[#5e5a52]">
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              Contraseñas cifradas con `bcrypt`.
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              Registro local vía API en `/api/register`.
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 p-4">
              Bloqueo automático tras varios intentos fallidos.
            </div>
          </div>
        </div>

        <div className="panel rounded-[32px] p-7">
          <div className="flex items-center gap-3 text-[#14532d]">
            <FaRoute />
            <p className="font-semibold">Rutas del laboratorio</p>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <Link
              href="/"
              className="rounded-3xl border border-black/8 bg-white/80 px-4 py-3 hover:-translate-y-0.5 hover:border-[#14532d]/30"
            >
              `/` página pública principal
            </Link>
            <div className="rounded-3xl border border-black/8 bg-white/80 px-4 py-3">
              `/dashboard` ruta privada
            </div>
            <div className="rounded-3xl border border-black/8 bg-white/80 px-4 py-3">
              `/profile` ruta privada
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
