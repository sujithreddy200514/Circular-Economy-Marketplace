import express, { Request, Response } from 'express';
import { createTransaction, demoTransactions, findUserById } from '../data/demoStore';

const router = express.Router();

// GET all transactions
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, transactions: demoTransactions });
});

// GET transaction by ID
router.get('/:id', (req: Request, res: Response) => {
  const transaction = demoTransactions.find((item) => item.id === req.params.id);
  if (!transaction) {
    res.status(404).json({ success: false, message: 'Transaction not found' });
    return;
  }
  res.status(200).json({ success: true, transaction });
});

// POST new transaction
router.post('/', (req: Request, res: Response) => {
  try {
    const transaction = createTransaction(req.body);
    const buyer = findUserById(transaction.buyerId);
    res.status(201).json({ success: true, transaction, walletBalance: buyer?.walletBalance });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Order failed' });
  }
});

// PUT update transaction
router.put('/:id', (req: Request, res: Response) => {
  const transaction = demoTransactions.find((item) => item.id === req.params.id);
  if (!transaction) {
    res.status(404).json({ success: false, message: 'Transaction not found' });
    return;
  }
  Object.assign(transaction, req.body, { id: transaction.id });
  res.status(200).json({ success: true, transaction });
});

export default router;
