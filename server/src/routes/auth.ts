import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { usersContainer } from "../lib/cosmos.js";
import { signToken } from "../lib/auth.js";
import type { User } from "../lib/types.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Vul een geldig e-mailadres en wachtwoord (min. 8 tekens) in" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { resources: existing } = await usersContainer.items
    .query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: normalizedEmail }],
    })
    .fetchAll();

  if (existing.length > 0) {
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

  const { resources } = await usersContainer.items
    .query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: normalizedEmail }],
    })
    .fetchAll();

  const user = resources[0] as User | undefined;
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Ongeldig e-mailadres of wachtwoord" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});
