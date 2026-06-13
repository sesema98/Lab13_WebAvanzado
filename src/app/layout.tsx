import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import LogoutButton from "@/components/LogoutButton";
import SessionProvider from "@/components/SessionProvider";
import { authOptions } from "@/lib/auth";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "NextAuth Multi-Provider Lab",
  description:
    "Laboratorio de autenticación y seguridad con NextAuth.js, credenciales, Google OAuth y GitHub OAuth.",
};

function InitialsFallback({ label }: { label: string }) {
  const initial = label.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14532d] text-sm font-semibold text-white">
      {initial}
    </div>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const userLabel = session?.user?.name ?? session?.user?.email ?? "Usuario";

  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <body>
        <SessionProvider session={session}>
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#dcefd1] blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#efd9bc] blur-3xl" />
          </div>

          <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
            <header className="panel-strong flex flex-col gap-4 rounded-[28px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14532d] text-lg font-semibold text-white">
                  NL
                </div>
                <div>
                  <Link href="/" className="text-lg font-semibold tracking-tight">
                    NextAuth Lab
                  </Link>
                  <p className="text-sm text-[#5e5a52]">
                    Credenciales, Google, GitHub y rutas protegidas
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <nav className="flex flex-wrap items-center gap-2 text-sm">
                  <Link
                    href="/"
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 hover:-translate-y-0.5 hover:border-[#14532d]/30"
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 hover:-translate-y-0.5 hover:border-[#14532d]/30"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 hover:-translate-y-0.5 hover:border-[#14532d]/30"
                  >
                    Profile
                  </Link>
                </nav>

                {session?.user ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-full border border-[#14532d]/15 bg-white/80 px-3 py-2">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={userLabel}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <InitialsFallback label={userLabel} />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{userLabel}</p>
                      <p className="truncate text-xs text-[#5e5a52]">
                        {session.user.email}
                      </p>
                    </div>
                    <LogoutButton />
                  </div>
                ) : (
                  <Link
                    href="/signIn"
                    className="rounded-full bg-[#14532d] px-5 py-2.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0f3f23]"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </div>
            </header>

            <main className="flex-1 py-8">{children}</main>

            <footer className="pb-3 text-center text-sm text-[#5e5a52]">
              Laboratorio construido con Next.js, NextAuth.js y tres métodos de autenticación.
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
