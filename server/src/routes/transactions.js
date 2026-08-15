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
    const list = db.transactions
      .filter((t) => t.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { type, title, amount, categoryId, accountId, date, note } = req.body || {};
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    if (!(Number(amount) > 0)) return res.status(400).json({ message: 'Amount must be positive' });
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const db = readDB();
    const record = {
      id: uid('txn'),
      userId: req.userId,
      type: type === 'income' ? 'income' : 'expense',
      title: title.trim(),
      amount: Number(amount),
      categoryId: categoryId || '',
      accountId: accountId || '',
      date,
      note: note || '',
      createdAt: new Date().toISOString(),
    };

    db.transactions.push(record);
    writeDB(db);
    res.status(201).json(record);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const idx = db.transactions.findIndex((t) => t.id === req.params.id && t.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Transaction not found' });

    const patch = { ...req.body };
    if (patch.amount !== undefined) patch.amount = Number(patch.amount);
    delete patch.id;
    delete patch.userId;

    db.transactions[idx] = { ...db.transactions[idx], ...patch };
    writeDB(db);
    res.json(db.transactions[idx]);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = readDB();
    const before = db.transactions.length;
    db.transactions = db.transactions.filter(
      (t) => !(t.id === req.params.id && t.userId === req.userId)
    );
    if (db.transactions.length === before) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    writeDB(db);
    res.json({ success: true });
  })
);

export default router;
