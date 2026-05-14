import express, { Request, Response } from 'express';
import { demoListings, demoTransactions, demoUsers, getImpactSummary } from '../data/demoStore';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    summary: {
      users: demoUsers.length,
      activeListings: demoListings.filter((listing) => listing.status === 'active').length,
      pendingListings: demoListings.filter((listing) => listing.status === 'pending').length,
      transactions: demoTransactions.length,
      walletVolume: demoTransactions
        .filter((transaction) => transaction.paymentMethod === 'wallet')
        .reduce((total, transaction) => total + transaction.total, 0),
      codOrders: demoTransactions.filter((transaction) => transaction.paymentMethod === 'cod').length,
      impact: getImpactSummary()
    }
  });
});

router.get('/users', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    users: demoUsers.map(({ password, ...user }) => user)
  });
});

router.put('/listings/:id/moderate', (req: Request, res: Response) => {
  const listing = demoListings.find((item) => item.id === Number(req.params.id));
  if (!listing) {
    res.status(404).json({ success: false, message: 'Listing not found' });
    return;
  }
  listing.status = req.body.status === 'rejected' ? 'rejected' : 'active';
  res.status(200).json({ success: true, listing });
});

export default router;
