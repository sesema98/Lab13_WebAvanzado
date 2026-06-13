export const AUTH_POLICY = {
  lockMinutes: 15,
  maxFailedAttempts: 5,
  minPasswordLength: 8,
  saltRounds: 10,
} as const;
