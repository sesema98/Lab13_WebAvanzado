"use client";

import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

type ProviderProps = {
  children: React.ReactNode;
  session?: Session | null;
};

export default function SessionProvider({
  children,
  session,
}: ProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
