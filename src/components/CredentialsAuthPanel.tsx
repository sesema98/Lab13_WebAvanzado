"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AUTH_POLICY } from "@/lib/auth-policy";

type CredentialsAuthPanelProps = {
  callbackUrl?: string;
};

type CredentialsMode = "signin" | "register";

const initialSignInState = {
  email: "",
  password: "",
};

const initialRegisterState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function CredentialsAuthPanel({
  callbackUrl = "/dashboard",
}: CredentialsAuthPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<CredentialsMode>("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "success";
    message: string;
  } | null>(null);
  const [signInState, setSignInState] = useState(initialSignInState);
  const [registerState, setRegisterState] = useState(initialRegisterState);

  const securityHint = useMemo(
    () =>
      `Se bloquea la cuenta por ${AUTH_POLICY.lockMinutes} minutos luego de ${AUTH_POLICY.maxFailedAttempts} intentos fallidos.`,
    [],
  );

  async function handleCredentialsSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl,
      email: signInState.email,
      password: signInState.password,
    });

    setIsSubmitting(false);

    if (!result?.ok || result.error) {
      setFeedback({
        tone: "error",
        message: result?.error ?? "No se pudo iniciar sesión con credenciales.",
      });
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (registerState.password !== registerState.confirmPassword) {
      setFeedback({
        tone: "error",
        message: "La confirmación de contraseña no coincide.",
      });
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerState.name,
        email: registerState.email,
        password: registerState.password,
      }),
    });

    const payload = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setFeedback({
        tone: "error",
        message: payload.message ?? "No se pudo registrar la cuenta.",
      });
      return;
    }

    setFeedback({
      tone: "success",
      message:
        payload.message ??
        "Cuenta creada. Ahora inicia sesión con tu correo y contraseña.",
    });
    setMode("signin");
    setSignInState({
      email: registerState.email,
      password: "",
    });
    setRegisterState(initialRegisterState);
  }

  return (
    <div className="rounded-[28px] border border-black/8 bg-white/80 p-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signin" ? "bg-[#14532d] text-white" : "border border-black/10 bg-white text-[#1c1b18]"}`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-[#14532d] text-white" : "border border-black/10 bg-white text-[#1c1b18]"}`}
        >
          Registrarse
        </button>
      </div>

      <p className="mt-4 text-sm leading-7 text-[#5e5a52]">
        Contraseñas con `bcrypt`, registro local y bloqueo temporal por intentos fallidos.
      </p>

      {feedback ? (
        <div
          className={`mt-5 rounded-3xl border p-4 text-sm leading-7 ${
            feedback.tone === "success"
              ? "border-[#14532d]/20 bg-[#eef9eb] text-[#14532d]"
              : "border-[#7c2d12]/20 bg-[#fff1eb] text-[#7c2d12]"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {mode === "signin" ? (
        <form className="mt-6 space-y-4" onSubmit={handleCredentialsSignIn}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Correo</span>
            <input
              type="email"
              value={signInState.email}
              onChange={(event) =>
                setSignInState((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#14532d]/40"
              placeholder="usuario@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Contraseña</span>
            <input
              type="password"
              value={signInState.password}
              onChange={(event) =>
                setSignInState((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#14532d]/40"
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0f3f23] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Validando..." : "Entrar con credenciales"}
          </button>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Nombre</span>
            <input
              type="text"
              value={registerState.name}
              onChange={(event) =>
                setRegisterState((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#14532d]/40"
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Correo</span>
            <input
              type="email"
              value={registerState.email}
              onChange={(event) =>
                setRegisterState((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#14532d]/40"
              placeholder="usuario@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Contraseña</span>
            <input
              type="password"
              value={registerState.password}
              onChange={(event) =>
                setRegisterState((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#14532d]/40"
              placeholder={`Mínimo ${AUTH_POLICY.minPasswordLength} caracteres`}
              autoComplete="new-password"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Confirmar contraseña
            </span>
            <input
              type="password"
              value={registerState.confirmPassword}
              onChange={(event) =>
                setRegisterState((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#14532d]/40"
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full border border-[#14532d]/20 bg-[#eff8ea] px-5 py-3 text-sm font-semibold text-[#14532d] hover:-translate-y-0.5 hover:border-[#14532d]/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrar cuenta"}
          </button>
        </form>
      )}

      <div className="mt-5 rounded-3xl border border-black/8 bg-[#faf7f0] p-4 text-sm leading-7 text-[#5e5a52]">
        {securityHint}
      </div>
    </div>
  );
}
