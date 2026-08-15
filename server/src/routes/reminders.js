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
    const list = db.reminders
      .filter((r) => r.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, amount, dueDate, note } = req.body || {};
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });

    const db = readDB();
    const record = {
      id: uid('rem'),
      userId: req.userId,
      title: title.trim(),
      amount: amount ? Number(amount) : null,
      dueDate: dueDate || null,
      note: note || '',
      done: false,
      createdAt: new Date().toISOString(),
    };

    db.reminders.push(record);
    writeDB(db);
    res.status(201).json(record);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const idx = db.reminders.findIndex((r) => r.id === req.params.id && r.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Reminder not found' });

    const patch = { ...req.body };
    if (patch.amount !== undefined) patch.amount = patch.amount ? Number(patch.amount) : null;
    delete patch.id;
    delete patch.userId;

    db.reminders[idx] = { ...db.reminders[idx], ...patch };
    writeDB(db);
    res.json(db.reminders[idx]);
  })
);

router.post(
  '/:id/toggle',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const idx = db.reminders.findIndex((r) => r.id === req.params.id && r.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Reminder not found' });

    db.reminders[idx].done = !db.reminders[idx].done;
    writeDB(db);
    res.json(db.reminders[idx]);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const before = db.reminders.length;
    db.reminders = db.reminders.filter(
      (r) => !(r.id === req.params.id && r.userId === req.userId)
    );
    if (db.reminders.length === before) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    writeDB(db);
    res.json({ success: true });
  })
);

export default router;
