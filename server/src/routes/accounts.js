import { Router } from 'express';
import { readDB, writeDB, uid } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const db = readDB();
    res.json(db.accounts.filter((a) => a.userId === req.userId));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

    const db = readDB();
    const record = { id: uid('acc'), userId: req.userId, name: name.trim() };
    db.accounts.push(record);
    writeDB(db);
    res.status(201).json(record);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { name } = req.body || {};
    const db = readDB();
    const idx = db.accounts.findIndex((a) => a.id === req.params.id && a.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Account not found' });

    db.accounts[idx] = { ...db.accounts[idx], name: name ?? db.accounts[idx].name };
    writeDB(db);
    res.json(db.accounts[idx]);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const before = db.accounts.length;
    db.accounts = db.accounts.filter((a) => !(a.id === req.params.id && a.userId === req.userId));
    if (db.accounts.length === before) {
      return res.status(404).json({ message: 'Account not found' });
    }
    writeDB(db);
    res.json({ success: true });
  })
);

export default router;
