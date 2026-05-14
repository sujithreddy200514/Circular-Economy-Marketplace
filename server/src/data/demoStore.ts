type Role = 'company' | 'transporter' | 'admin';
type TransactionStatus = 'pending' | 'approved' | 'completed' | 'cancelled';
type PaymentMethod = 'wallet' | 'cod';
type SupplyChainStatus = 'active' | 'planning';

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  companyName: string;
  walletBalance: number;
  password: string;
  verified: boolean;
}

export interface DemoListing {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  sellerId: number;
  sellerName: string;
  status: 'active' | 'pending' | 'sold' | 'rejected';
  listingType: 'sell' | 'rent' | 'donate' | 'recycle';
  certification?: string;
  createdAt: string;
  views: number;
  inquiries: number;
}

export interface DemoTransaction {
  id: string;
  listingId: number;
  buyerId: number;
  sellerId: number;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'cash_on_delivery' | 'refunded';
  status: TransactionStatus;
  createdAt: string;
  impact: {
    co2SavedKg: number;
    wasteReducedKg: number;
    landfillAvoidedKg: number;
  };
}

export interface DemoSupplyChain {
  id: number;
  name: string;
  description: string;
  participants: number;
  materials: string[];
  carbonSaved: string;
  status: SupplyChainStatus;
  location: string;
  admin: string;
  createdAt: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

export const demoUsers: DemoUser[] = [
  {
    id: 1,
    name: 'Demo User',
    email: 'user@recircle.test',
    role: 'company',
    companyName: 'ReCircle Buyer Co.',
    walletBalance: 50000,
    password: 'password123',
    verified: true
  },
  {
    id: 2,
    name: 'EcoPlastics Seller',
    email: 'seller@recircle.test',
    role: 'company',
    companyName: 'EcoPlastics Inc.',
    walletBalance: 125000,
    password: 'password123',
    verified: true
  },
  {
    id: 3,
    name: 'Admin',
    email: 'admin@recircle.test',
    role: 'admin',
    companyName: 'ReCircle Admin',
    walletBalance: 0,
    password: 'admin12345',
    verified: true
  }
];

export const demoListings: DemoListing[] = [
  {
    id: 1,
    title: 'Recycled Plastic Pellets',
    description: 'High-quality recycled HDPE pellets suitable for injection molding.',
    category: 'Plastics',
    subcategory: 'HDPE',
    quantity: 500,
    unit: 'kg',
    price: 100,
    location: 'Hyderabad, Telangana',
    sellerId: 2,
    sellerName: 'EcoPlastics Inc.',
    status: 'active',
    listingType: 'sell',
    certification: 'ISO 14001',
    createdAt: today(),
    views: 142,
    inquiries: 7
  },
  {
    id: 2,
    title: 'Reusable Event Furniture',
    description: 'Foldable tables and chairs available for short-term rental.',
    category: 'Furniture',
    subcategory: 'Rental',
    quantity: 80,
    unit: 'piece',
    price: 35,
    location: 'Hyderabad, Telangana',
    sellerId: 2,
    sellerName: 'EcoPlastics Inc.',
    status: 'active',
    listingType: 'rent',
    createdAt: today(),
    views: 64,
    inquiries: 3
  },
  {
    id: 3,
    title: 'Cotton Fabric Remnants',
    description: 'Clean fabric remnants available for donation to reuse groups.',
    category: 'Textiles',
    subcategory: 'Cotton',
    quantity: 150,
    unit: 'kg',
    price: 0,
    location: 'Hyderabad, Telangana',
    sellerId: 2,
    sellerName: 'EcoPlastics Inc.',
    status: 'active',
    listingType: 'donate',
    createdAt: today(),
    views: 88,
    inquiries: 5
  }
];

export const demoSupplyChains: DemoSupplyChain[] = [
  {
    id: 1,
    name: 'Plastic Recycling Loop',
    description: 'Closed-loop supply chain for recycled plastics from collection to manufacturing.',
    participants: 8,
    materials: ['HDPE', 'PET', 'PP'],
    carbonSaved: '2,500 tons CO2e',
    status: 'active',
    location: 'Western Europe',
    admin: 'EcoRecycle Ltd',
    createdAt: today()
  },
  {
    id: 2,
    name: 'Textile Recovery Network',
    description: 'Collaborative supply chain for textile waste recovery and reuse.',
    participants: 12,
    materials: ['Cotton', 'Polyester', 'Nylon'],
    carbonSaved: '1,800 tons CO2e',
    status: 'active',
    location: 'Global',
    admin: 'FashionForward',
    createdAt: today()
  },
  {
    id: 3,
    name: 'Construction Materials Exchange',
    description: 'Regional network for reusing and recycling construction and demolition waste.',
    participants: 15,
    materials: ['Concrete', 'Wood', 'Metal'],
    carbonSaved: '3,200 tons CO2e',
    status: 'active',
    location: 'Northeast Region',
    admin: 'BuildReclaim',
    createdAt: today()
  },
  {
    id: 4,
    name: 'Electronics Takeback System',
    description: 'Reverse logistics system for electronics recovery and component reuse.',
    participants: 6,
    materials: ['PCBs', 'Precious Metals', 'Plastics'],
    carbonSaved: '950 tons CO2e',
    status: 'planning',
    location: 'National',
    admin: 'ElectroCollect',
    createdAt: today()
  }
];

export const demoTransactions: DemoTransaction[] = [];

export const findUserById = (id: number) => demoUsers.find((user) => user.id === id);

export const findUserByEmail = (email: string) =>
  demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const createUser = (input: {
  name: string;
  email: string;
  password: string;
  role?: Role;
  companyName?: string;
}) => {
  const user: DemoUser = {
    id: nextId(demoUsers),
    name: input.name,
    email: input.email,
    role: input.role || 'company',
    companyName: input.companyName || input.name,
    walletBalance: 25000,
    password: input.password,
    verified: false
  };
  demoUsers.push(user);
  return user;
};

export const createListing = (input: Partial<DemoListing> & { sellerId?: number }) => {
  const seller = findUserById(input.sellerId || 1) || demoUsers[0];
  const listing: DemoListing = {
    id: nextId(demoListings),
    title: input.title || 'Untitled Listing',
    description: input.description || '',
    category: input.category || 'Other',
    subcategory: input.subcategory || 'General',
    quantity: Number(input.quantity || 1),
    unit: input.unit || 'kg',
    price: Number(input.price || 0),
    location: input.location || 'Hyderabad, Telangana',
    sellerId: seller.id,
    sellerName: seller.companyName,
    status: 'pending',
    listingType: input.listingType || 'sell',
    certification: input.certification,
    createdAt: today(),
    views: 0,
    inquiries: 0
  };
  demoListings.push(listing);
  return listing;
};

export const createSupplyChain = (input: Partial<DemoSupplyChain>) => {
  const materials = Array.isArray(input.materials)
    ? input.materials
    : String(input.materials || '')
        .split(',')
        .map((material) => material.trim())
        .filter(Boolean);

  const supplyChain: DemoSupplyChain = {
    id: nextId(demoSupplyChains),
    name: input.name || 'Untitled Supply Chain',
    description: input.description || '',
    participants: Number(input.participants || 1),
    materials: materials.length ? materials : ['General Materials'],
    carbonSaved: input.carbonSaved || '0 tons CO2e',
    status: input.status === 'active' ? 'active' : 'planning',
    location: input.location || 'Hyderabad, Telangana',
    admin: input.admin || 'ReCircle Admin',
    createdAt: today()
  };

  demoSupplyChains.unshift(supplyChain);
  return supplyChain;
};

const impactFor = (quantity: number, unit: string) => {
  const kg = unit === 'ton' ? quantity * 1000 : unit === 'piece' ? quantity * 2 : quantity;
  return {
    co2SavedKg: Math.round(kg * 1.8),
    wasteReducedKg: Math.round(kg),
    landfillAvoidedKg: Math.round(kg * 0.92)
  };
};

export const createTransaction = (input: {
  listingId: number;
  buyerId?: number;
  quantity?: number;
  paymentMethod?: PaymentMethod;
}) => {
  const listing = demoListings.find((item) => item.id === input.listingId);
  if (!listing || listing.status !== 'active') {
    throw new Error('Listing is not available');
  }

  const buyer = findUserById(input.buyerId || 1) || demoUsers[0];
  const quantity = Number(input.quantity || 1);
  const total = quantity * listing.price;
  const paymentMethod = input.paymentMethod || 'wallet';

  if (paymentMethod === 'wallet' && buyer.walletBalance < total) {
    throw new Error('Insufficient wallet balance. Use COD fallback.');
  }

  if (paymentMethod === 'wallet') {
    buyer.walletBalance -= total;
    const seller = findUserById(listing.sellerId);
    if (seller) seller.walletBalance += total;
  }

  listing.quantity = Math.max(0, listing.quantity - quantity);
  if (listing.quantity === 0) listing.status = 'sold';

  const transaction: DemoTransaction = {
    id: `tx-${String(demoTransactions.length + 1).padStart(3, '0')}`,
    listingId: listing.id,
    buyerId: buyer.id,
    sellerId: listing.sellerId,
    material: listing.title,
    quantity,
    unit: listing.unit,
    unitPrice: listing.price,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'cash_on_delivery',
    status: paymentMethod === 'wallet' ? 'completed' : 'pending',
    createdAt: today(),
    impact: impactFor(quantity, listing.unit)
  };

  demoTransactions.push(transaction);
  return transaction;
};

export const getImpactSummary = () =>
  demoTransactions.reduce(
    (summary, transaction) => ({
      co2SavedKg: summary.co2SavedKg + transaction.impact.co2SavedKg,
      wasteReducedKg: summary.wasteReducedKg + transaction.impact.wasteReducedKg,
      landfillAvoidedKg: summary.landfillAvoidedKg + transaction.impact.landfillAvoidedKg
    }),
    { co2SavedKg: 0, wasteReducedKg: 0, landfillAvoidedKg: 0 }
  );
