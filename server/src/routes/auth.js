import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { readDB, writeDB, uid } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildDefaultCategories, buildDefaultAccounts } from '../utils/defaults.js';

const router = Router();

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, photo } = req.body || {};

    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const db = readDB();
    const emailNormalized = email.trim().toLowerCase();

    if (db.users.some((u) => u.email === emailNormalized)) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uid('user'),
      name: name.trim(),
      email: emailNormalized,
      passwordHash,
      photo: photo || null,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    db.categories.push(...buildDefaultCategories(newUser.id));
    db.accounts.push(...buildDefaultAccounts(newUser.id));
    writeDB(db);

    const token = signToken(newUser.id);
    res.status(201).json({ token, user: publicUser(newUser) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    const db = readDB();
    const emailNormalized = (email || '').trim().toLowerCase();
    const found = db.users.find((u) => u.email === emailNormalized);

    if (!found) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password || '', found.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(found.id);
    res.json({ token, user: publicUser(found) });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = readDB();
    const found = db.users.find((u) => u.id === req.userId);
    if (!found) return res.status(404).json({ message: 'User not found' });
    res.json({ user: publicUser(found) });
  })
);

router.put(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, email, photo } = req.body || {};
    const db = readDB();
    const idx = db.users.findIndex((u) => u.id === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) db.users[idx].name = name.trim();
    if (email !== undefined) db.users[idx].email = email.trim().toLowerCase();
    if (photo !== undefined) db.users[idx].photo = photo;

    writeDB(db);
    res.json({ user: publicUser(db.users[idx]) });
  })
);

router.put(
  '/password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const db = readDB();
    const idx = db.users.findIndex((u) => u.id === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword || '', db.users[idx].passwordHash);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    db.users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
    writeDB(db);
    res.json({ success: true });
  })
);

router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body || {};
    const db = readDB();
    const found = db.users.find((u) => u.email === (email || '').trim().toLowerCase());

    // Demo mode: there's no real email service wired up, so we just report
    // whether the account exists rather than actually sending a reset link.
    if (!found) return res.status(404).json({ message: 'No account found with that email.' });
    res.json({ message: 'A password reset link has been sent (demo mode).' });
  })
);

export default router;
