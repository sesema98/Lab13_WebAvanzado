import type { NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { authenticateCredentialsUser } from "@/lib/user-store";

const authProviders: Provider[] = [
  CredentialsProvider({
    name: "Credenciales",
    credentials: {
      email: {
        label: "Correo",
        type: "email",
        placeholder: "tu-correo@ejemplo.com",
      },
      password: {
        label: "Contraseña",
        type: "password",
      },
    },
    async authorize(credentials) {
      return authenticateCredentialsUser({
        email: credentials?.email,
        password: credentials?.password,
      });
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  authProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  authProviders.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers: authProviders,
  pages: {
    signIn: "/signIn",
    error: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.provider = account?.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.provider = token.provider;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
