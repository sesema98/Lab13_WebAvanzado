"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { HiArrowPath } from "react-icons/hi2";

type GoogleSignInButtonProps = {
  callbackUrl?: string;
  className?: string;
};

export default function GoogleSignInButton({
  callbackUrl = "/dashboard",
  className = "",
}: GoogleSignInButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    try {
      setIsSubmitting(true);
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("No se pudo iniciar el flujo OAuth con Google.", error);
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isSubmitting}
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0f3f23] disabled:cursor-not-allowed disabled:opacity-70 ${className}`.trim()}
    >
      {isSubmitting ? (
        <HiArrowPath className="animate-spin text-lg" />
      ) : (
        <FcGoogle className="text-xl" />
      )}
      {isSubmitting ? "Redirigiendo..." : "Continuar con Google"}
    </button>
  );
}
