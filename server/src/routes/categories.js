import { Router } from 'express';
import { readDB, writeDB, uid } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const PALETTE = ['#16a8ff', '#43f0a7', '#ff6f86', '#ffd84d', '#8d7cff', '#ff9f5a', '#5ad1ff', '#c084fc'];

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const db = readDB();
    res.json(db.categories.filter((c) => c.userId === req.userId));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, icon, color } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

    const db = readDB();
    const mine = db.categories.filter((c) => c.userId === req.userId);
    const record = {
      id: uid('cat'),
      userId: req.userId,
      name: name.trim(),
      icon: icon || '📁',
      color: color || PALETTE[mine.length % PALETTE.length],
    };

    db.categories.push(record);
    writeDB(db);
    res.status(201).json(record);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const idx = db.categories.findIndex((c) => c.id === req.params.id && c.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Category not found' });

    const patch = { ...req.body };
    delete patch.id;
    delete patch.userId;
    // Renaming a built-in category detaches it from the translated default
    // name, same as the original localStorage behavior.
    if (patch.name) patch.key = undefined;

    db.categories[idx] = { ...db.categories[idx], ...patch };
    writeDB(db);
    res.json(db.categories[idx]);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const before = db.categories.length;
    db.categories = db.categories.filter(
      (c) => !(c.id === req.params.id && c.userId === req.userId)
    );
    if (db.categories.length === before) {
      return res.status(404).json({ message: 'Category not found' });
    }
    writeDB(db);
    res.json({ success: true });
  })
);

export default router;
