import express, { Request, Response } from 'express';
import { createListing, demoListings } from '../data/demoStore';

const router = express.Router();

// GET all listings
router.get('/', (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const listings = status ? demoListings.filter((listing) => listing.status === status) : demoListings;
  res.status(200).json({ success: true, listings });
});

// GET listing by ID
router.get('/:id', (req: Request, res: Response) => {
  const listing = demoListings.find((item) => item.id === Number(req.params.id));
  if (!listing) {
    res.status(404).json({ success: false, message: 'Listing not found' });
    return;
  }
  listing.views += 1;
  res.status(200).json({ success: true, listing });
});

// POST new listing
router.post('/', (req: Request, res: Response) => {
  const listing = createListing(req.body);
  res.status(201).json({ success: true, listing });
});

// PUT update listing
router.put('/:id', (req: Request, res: Response) => {
  const listing = demoListings.find((item) => item.id === Number(req.params.id));
  if (!listing) {
    res.status(404).json({ success: false, message: 'Listing not found' });
    return;
  }
  Object.assign(listing, req.body, { id: listing.id });
  res.status(200).json({ success: true, listing });
});

// DELETE listing
router.delete('/:id', (req: Request, res: Response) => {
  const index = demoListings.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Listing not found' });
    return;
  }
  const [listing] = demoListings.splice(index, 1);
  res.status(200).json({ success: true, listing });
});

export default router;
