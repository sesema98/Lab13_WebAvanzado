"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { IconType } from "react-icons";
import { HiArrowPath } from "react-icons/hi2";

type OAuthProviderButtonProps = {
  callbackUrl?: string;
  className?: string;
  disabled?: boolean;
  icon: IconType;
  label: string;
  provider: "google" | "github";
};

export default function OAuthProviderButton({
  callbackUrl = "/dashboard",
  className = "",
  disabled = false,
  icon: Icon,
  label,
  provider,
}: OAuthProviderButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    try {
      setIsSubmitting(true);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`No se pudo iniciar sesión con ${provider}.`, error);
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isSubmitting}
      className={`inline-flex items-center justify-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {isSubmitting ? <HiArrowPath className="animate-spin text-lg" /> : <Icon className="text-xl" />}
      {isSubmitting ? "Redirigiendo..." : label}
    </button>
  );
}
