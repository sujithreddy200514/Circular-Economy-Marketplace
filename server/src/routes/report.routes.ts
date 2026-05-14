import express, { Request, Response } from 'express';
import { demoListings, demoTransactions, demoUsers, getImpactSummary } from '../data/demoStore';

const router = express.Router();

// GET all reports
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    reports: [
      {
        id: 'impact-summary',
        name: 'Environmental Impact Summary',
        generatedAt: new Date().toISOString(),
        data: getImpactSummary()
      }
    ]
  });
});

// GET report by ID
router.get('/:id', (req: Request, res: Response) => {
  if (req.params.id !== 'impact-summary') {
    res.status(404).json({ success: false, message: 'Report not found' });
    return;
  }
  res.status(200).json({
    success: true,
    report: {
      id: 'impact-summary',
      name: 'Environmental Impact Summary',
      totals: getImpactSummary(),
      transactions: demoTransactions.length,
      activeListings: demoListings.filter((listing) => listing.status === 'active').length,
      users: demoUsers.length
    }
  });
});

// POST new report
router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ success: true, report: { ...req.body, createdAt: new Date().toISOString() } });
});

export default router; 
