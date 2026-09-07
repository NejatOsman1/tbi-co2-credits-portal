import { Router, type Request } from "express";
import bcrypt from "bcryptjs";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { usersContainer } from "../lib/cosmos.js";
import { signToken } from "../lib/auth.js";
import { mailEnabled, sendPasswordResetMail } from "../lib/mailer.js";
import type { User } from "../lib/types.js";

export const authRouter = Router();

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 uur

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

async function findUserByEmail(email: string): Promise<User | undefined> {
  const { resources } = await usersContainer.items
    .query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }],
    })
    .fetchAll();
  return resources[0] as User | undefined;
}

function appBaseUrl(req: Request): string {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, "");
  const proto = (req.headers["x-forwarded-proto"] as string | undefined) ?? req.protocol;
  return `${proto}://${req.get("host")}`;
}

authRouter.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Vul een geldig e-mailadres en wachtwoord (min. 8 tekens) in" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await findUserByEmail(normalizedEmail);

  if (existing) {
    res.status(409).json({ error: "Er bestaat al een account met dit e-mailadres" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await usersContainer.items.create(user);

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Vul een e-mailadres en wachtwoord in" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Ongeldig e-mailadres of wachtwoord" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

// --- Wachtwoord vergeten -----------------------------------------------------

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body ?? {};

  // Always answer the same way, so this endpoint can't be used to find out
  // which e-mail addresses have an account.
  const genericResponse = {
    message: "Als er een account bestaat met dit e-mailadres, is er een e-mail verstuurd.",
  };

  if (typeof email !== "string" || !email.trim()) {
    res.json(genericResponse);
    return;
  }

  if (!mailEnabled) {
    res.status(503).json({ error: "E-mail is niet geconfigureerd op de server" });
    return;
  }

  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user) {
    res.json(genericResponse);
    return;
  }

  const token = randomBytes(32).toString("hex");
  await usersContainer.items.upsert<User>({
    ...user,
    resetTokenHash: hashToken(token),
    resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString(),
  });

  const resetUrl = `${appBaseUrl(req)}/reset-password?token=${token}`;
  try {
    await sendPasswordResetMail(user.email, resetUrl);
  } catch (err) {
    console.error("Versturen van reset-mail mislukt", err);
    res.status(502).json({ error: "De e-mail kon niet worden verstuurd" });
    return;
  }

  res.json(genericResponse);
});

authRouter.post("/reset-password", async (req, res) => {
  const { token, password } = req.body ?? {};
  if (typeof token !== "string" || typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Vul een nieuw wachtwoord van minimaal 8 tekens in" });
    return;
  }

  const { resources } = await usersContainer.items
    .query({
      query: "SELECT * FROM c WHERE c.resetTokenHash = @hash",
      parameters: [{ name: "@hash", value: hashToken(token) }],
    })
    .fetchAll();

  const user = resources[0] as User | undefined;
  if (!user || !user.resetTokenExpiresAt || new Date(user.resetTokenExpiresAt) < new Date()) {
    res.status(400).json({ error: "Deze link is niet meer geldig. Vraag een nieuwe aan." });
    return;
  }

  const { resetTokenHash, resetTokenExpiresAt, ...rest } = user;
  await usersContainer.items.upsert<User>({
    ...rest,
    passwordHash: await bcrypt.hash(password, 10),
  });

  const authToken = signToken({ userId: user.id, email: user.email });
  res.json({ token: authToken, user: { id: user.id, email: user.email } });
});
