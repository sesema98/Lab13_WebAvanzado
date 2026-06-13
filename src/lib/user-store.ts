import "server-only";

import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { AUTH_POLICY } from "@/lib/auth-policy";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  failedLoginAttempts: number;
  lockUntil: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserStore = {
  users: StoredUser[];
};

type CredentialsAuthInput = {
  email?: string;
  password?: string;
};

type RegisterUserInput = {
  name?: string;
  email?: string;
  password?: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const usersFile = path.join(dataDirectory, "users.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildMinutesMessage(until: Date) {
  const remainingMilliseconds = until.getTime() - Date.now();
  const remainingMinutes = Math.max(
    1,
    Math.ceil(remainingMilliseconds / (60 * 1000)),
  );

  return `Tu cuenta está bloqueada temporalmente. Intenta nuevamente en ${remainingMinutes} minuto${remainingMinutes === 1 ? "" : "s"}.`;
}

async function ensureUserStore() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(usersFile);
  } catch {
    const initialStore: UserStore = { users: [] };
    await fs.writeFile(usersFile, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

async function readUserStore(): Promise<UserStore> {
  await ensureUserStore();

  const rawContent = await fs.readFile(usersFile, "utf8");

  if (!rawContent.trim()) {
    return { users: [] };
  }

  const parsedContent = JSON.parse(rawContent) as Partial<UserStore>;

  return {
    users: Array.isArray(parsedContent.users) ? parsedContent.users : [],
  };
}

async function writeUserStore(store: UserStore) {
  await ensureUserStore();
  await fs.writeFile(usersFile, JSON.stringify(store, null, 2), "utf8");
}

function sanitizeCredentialsUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function registerCredentialsUser({
  name,
  email,
  password,
}: RegisterUserInput) {
  const trimmedName = name?.trim() ?? "";
  const normalizedEmail = email ? normalizeEmail(email) : "";
  const normalizedPassword = password?.trim() ?? "";

  if (!trimmedName) {
    throw new Error("Ingresa un nombre para registrar la cuenta.");
  }

  if (!normalizedEmail) {
    throw new Error("Ingresa un correo válido.");
  }

  if (!normalizedPassword) {
    throw new Error("Ingresa una contraseña.");
  }

  if (normalizedPassword.length < AUTH_POLICY.minPasswordLength) {
    throw new Error(
      `La contraseña debe tener al menos ${AUTH_POLICY.minPasswordLength} caracteres.`,
    );
  }

  const store = await readUserStore();
  const existingUser = store.users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error("Ya existe una cuenta registrada con ese correo.");
  }

  const timestamp = new Date().toISOString();
  const passwordHash = await bcrypt.hash(
    normalizedPassword,
    AUTH_POLICY.saltRounds,
  );

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
    failedLoginAttempts: 0,
    lockUntil: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.users.push(newUser);
  await writeUserStore(store);

  return sanitizeCredentialsUser(newUser);
}

export async function authenticateCredentialsUser({
  email,
  password,
}: CredentialsAuthInput) {
  const normalizedEmail = email ? normalizeEmail(email) : "";
  const normalizedPassword = password?.trim() ?? "";

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error("Completa el correo y la contraseña.");
  }

  const store = await readUserStore();
  const userIndex = store.users.findIndex((entry) => entry.email === normalizedEmail);

  if (userIndex === -1) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  const user = store.users[userIndex];

  if (user.lockUntil) {
    const lockUntilDate = new Date(user.lockUntil);

    if (lockUntilDate.getTime() > Date.now()) {
      throw new Error(buildMinutesMessage(lockUntilDate));
    }

    user.lockUntil = null;
    user.failedLoginAttempts = 0;
    user.updatedAt = new Date().toISOString();
    store.users[userIndex] = user;
    await writeUserStore(store);
  }

  const isPasswordValid = await bcrypt.compare(
    normalizedPassword,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const now = new Date();
    const remainingAttempts = AUTH_POLICY.maxFailedAttempts - failedLoginAttempts;

    user.failedLoginAttempts = failedLoginAttempts;
    user.updatedAt = now.toISOString();

    if (failedLoginAttempts >= AUTH_POLICY.maxFailedAttempts) {
      const lockUntilDate = new Date(
        now.getTime() + AUTH_POLICY.lockMinutes * 60 * 1000,
      );

      user.lockUntil = lockUntilDate.toISOString();
      store.users[userIndex] = user;
      await writeUserStore(store);

      throw new Error(
        `Demasiados intentos fallidos. Tu cuenta fue bloqueada por ${AUTH_POLICY.lockMinutes} minutos.`,
      );
    }

    store.users[userIndex] = user;
    await writeUserStore(store);

    throw new Error(
      `Correo o contraseña incorrectos. Te quedan ${remainingAttempts} intento${remainingAttempts === 1 ? "" : "s"} antes del bloqueo.`,
    );
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.updatedAt = new Date().toISOString();
  store.users[userIndex] = user;
  await writeUserStore(store);

  return sanitizeCredentialsUser(user);
}
