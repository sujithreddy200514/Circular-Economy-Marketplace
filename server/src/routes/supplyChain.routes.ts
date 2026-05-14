import express, { Request, Response } from 'express';
import Joi from 'joi';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { createSupplyChain, demoSupplyChains } from '../data/demoStore';

const router = express.Router();

const supplyChainSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
  description: Joi.string().trim().min(10).required(),
  participants: Joi.number().integer().min(1).default(1),
  materials: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
  carbonSaved: Joi.string().trim().allow('').default('0 tons CO2e'),
  status: Joi.string().valid('active', 'planning').default('planning'),
  location: Joi.string().trim().allow('').default('Hyderabad, Telangana'),
  admin: Joi.string().trim().allow('').default('ReCircle Admin')
});

// GET all supply chains
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, supplyChains: demoSupplyChains });
});

// GET supply chain by ID
router.get('/:id', (req: Request, res: Response) => {
  const supplyChain = demoSupplyChains.find((chain) => chain.id === Number(req.params.id));
  if (!supplyChain) {
    res.status(404).json({ success: false, message: 'Supply chain not found' });
    return;
  }

  res.status(200).json({ success: true, supplyChain });
});

// POST new supply chain
router.post('/', authenticate, isAdmin, (req: Request, res: Response) => {
  const { error, value } = supplyChainSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const supplyChain = createSupplyChain(value);
  res.status(201).json({ success: true, supplyChain });
});

// PUT update supply chain
router.put('/:id', (req: Request, res: Response) => {
  res.status(200).json({ message: `Update supply chain ${req.params.id} - Endpoint to be implemented` });
});

export default router; 
