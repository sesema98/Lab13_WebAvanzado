"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({
  className = "",
}: LogoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignOut() {
    try {
      setIsSubmitting(true);

      const result = await signOut({
        redirect: false,
        callbackUrl: `${window.location.origin}/`,
      });

      window.location.href = result?.url ?? "/";
    } catch (error) {
      console.error("No se pudo cerrar la sesión.", error);
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSubmitting}
      className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#1c1b18] hover:-translate-y-0.5 hover:border-[#14532d]/30 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      <HiArrowRightOnRectangle className="text-lg" />
      {isSubmitting ? "Saliendo..." : "Salir"}
    </button>
  );
}
