# Software Design Specification

Project: Circular Economy Marketplace  
Version: 1.0  
Date: April 2026  
Prepared for: Academic project review  
Prepared by: CircularEco project team

## 1. Introduction

### 1.1 Purpose

This Software Design Specification (SDS) describes the design of the Circular Economy Marketplace application. The platform helps customers list reusable waste, scrap, by-products, and surplus materials so supply chain companies can discover, contact, and purchase them. It also allows companies to browse recovered materials, view circular supply chains, track transactions, and review sustainability impact.

The document is intended for project evaluation, development reference, and future maintenance.

### 1.2 Scope

The application is a full-stack web system with:

- A React-based frontend for marketplace browsing, user registration, login, dashboards, material listings, supply chains, transactions, and resources.
- A Node.js and Express backend for authentication, user management, materials, listings, transactions, messages, reports, transport, and supply chain APIs.
- A PostgreSQL database schema for users, companies, materials, listings, transactions, shipments, sustainability metrics, messages, notifications, and circular supply chains.

The current implementation includes a working frontend prototype with mock data for many user-facing workflows and a backend API structure prepared for database-backed implementation.

### 1.3 Definitions

| Term | Meaning |
| --- | --- |
| Circular economy | An economic model where materials are reused, recycled, and kept in circulation instead of being discarded. |
| Customer | A user who may sell surplus waste, scrap, or reusable materials. |
| Supply chain company | A company that can buy listed materials for recycling, processing, manufacturing, or distribution. |
| Listing | A posted material offer with quantity, price, category, location, and availability. |
| Transaction | A purchase or sale record between buyer and seller. |
| Sustainability metrics | Environmental impact values such as carbon saved, water saved, and landfill avoided. |
| SDS | Software Design Specification. |

## 2. System Overview

### 2.1 Product Perspective

CircularEco is designed as a marketplace and supply chain coordination platform. It acts as an intermediary between material sellers and companies that can use recovered materials.

The system supports three main activities:

1. Buy recovered materials from the marketplace.
2. Sell surplus materials to supply chain companies.
3. Build and monitor circular supply chains.

### 2.2 Product Functions

The major functions are:

- User registration and login.
- Marketplace browsing with material categories, prices in INR, and Hyderabad-based locations.
- Material detail viewing.
- Selling flow through material listing creation.
- Dashboard summary with impact, listings, and recent transactions.
- My Listings management for seller-side material offers.
- Transaction viewing and filtering.
- Supply chain listing and supply chain detail viewing.
- Resource pages including support, policies, FAQ, terms, and sitemap.

### 2.3 User Classes

| User class | Description | Main actions |
| --- | --- | --- |
| Guest user | User who has not logged in. | View home, about, marketplace, supply chains, and resource pages. |
| Customer or company user | Registered user with company role. | Buy materials, sell materials, manage listings, view dashboard, track transactions. |
| Transporter | Logistics-oriented user role reserved for transport workflows. | View transport-related modules when implemented. |
| Admin | Administrative role reserved for platform management. | Manage users, statistics, and moderation when implemented. |

## 3. Architecture Design

### 3.1 Architecture Style

The system follows a client-server architecture:

- Frontend: Single Page Application (SPA) built with React, TypeScript, Vite, styled-components, React Router, and Framer Motion.
- Backend: REST API built with Express and TypeScript.
- Database: PostgreSQL relational schema.

### 3.2 High-Level Architecture

```text
User Browser
    |
    v
React/Vite Frontend
    |
    v
Axios API Client
    |
    v
Express REST API
    |
    v
PostgreSQL Database
```

### 3.3 Frontend Structure

Important frontend directories:

| Path | Purpose |
| --- | --- |
| `client/src/pages` | Page-level screens such as Home, Marketplace, Dashboard, Transactions, Supply Chains, Login, Register, and About. |
| `client/src/components/common` | Reusable UI controls such as Button, Card, Modal, Input, Badge, and Select. |
| `client/src/components/layout` | Layout, Navbar, and Footer. |
| `client/src/contexts` | Authentication context and user state. |
| `client/src/utils` | API helper and navigation helpers. |
| `client/src/theme` and `client/src/styles` | Theme and global styling. |

### 3.4 Backend Structure

Important backend directories:

| Path | Purpose |
| --- | --- |
| `server/src/index.ts` | Express app setup, middleware, route registration, and server startup. |
| `server/src/routes` | REST route definitions. |
| `server/src/controllers` | Request handlers for implemented controller logic. |
| `server/src/middleware` | Authentication middleware. |
| `server/src/config` | Database connection setup. |
| `server/src/database/schema.sql` | PostgreSQL schema. |
| `server/src/interfaces` | TypeScript interfaces for domain models. |
| `server/src/utils` | JWT and password utilities. |

## 4. Frontend Design

### 4.1 Routing

The frontend uses `HashRouter` and defines routes in `client/src/App.tsx`.

| Route | Screen |
| --- | --- |
| `/` | Home page |
| `/about` | About page |
| `/marketplace` | Marketplace listing page |
| `/marketplace/:id` | Material detail page |
| `/supply-chains` | Supply chains page |
| `/supply-chains/:id` | Supply chain detail page |
| `/dashboard` | Protected dashboard |
| `/transactions` | Protected transactions page |
| `/orders` | Protected orders page |
| `/my-listings` | Protected seller listings page |
| `/create-listing` | Protected sell material page |
| `/edit-listing/:id` | Protected edit listing page |
| `/profile` | Protected profile page |
| `/login` | Login page |
| `/register` | Register/create account page |
| `/resources`, `/blog`, `/faq`, `/support`, `/terms`, `/privacy`, `/cookies`, `/sitemap` | Resource pages |

### 4.2 Protected Routes

Protected pages use the `ProtectedRoute` wrapper. If a user is not logged in, the user is redirected to `/login`.

Protected areas include:

- Dashboard
- Transactions
- Orders
- My Listings
- Create Listing
- Edit Listing
- Profile

### 4.3 Home Page Design

The home page introduces the platform and includes:

- Hero title about building a sustainable circular economy.
- Description explaining that users can buy recovered materials or sell surplus materials to supply chain companies in Hyderabad.
- A single `Buy/Sell` button that redirects to account creation at `/register`.
- Statistics for listed materials, companies, recycled tons, and cost savings.
- "How It Works" cards explaining selling, finding sustainable materials, supply chains, impact tracking, transport, and cost savings.
- A final `Join` CTA that also redirects to `/register`.

### 4.4 Marketplace Design

The marketplace page displays material cards with:

- Material name
- Category
- Quantity
- INR price
- Hyderabad, Telangana location
- Image
- Buy and Sell actions

Buy opens the material detail page. Sell routes to the protected create listing workflow.

### 4.5 Sell Material Flow

The sell flow is represented by `CreateListingPage`.

The user provides:

- Listing title
- Description
- Category and subcategory
- Quantity and unit
- INR price and price unit
- Location
- Certification
- Availability date

The current prototype stores listings in `localStorage`. In the full backend implementation, the listing should be saved through `/api/listings`.

### 4.6 Dashboard and Transactions

The dashboard displays:

- Total transactions
- Active listings
- Pending orders
- Carbon saved
- Waste recycled
- Revenue in INR
- Recent transactions with dates in mid-April 2026

The transactions page displays mock purchase and sale transactions with:

- Transaction ID
- Type
- Date
- Status
- Counterparty
- Material
- Quantity
- Invoice number
- Payment method
- Delivery status

## 5. Backend Design

### 5.1 Express Application

The backend server is configured in `server/src/index.ts`.

Middleware:

- `cors` for cross-origin access.
- `helmet` for security headers.
- `express.json` and `express.urlencoded` for request parsing.
- `morgan` for request logging.
- `express-rate-limit` for basic rate limiting.
- Static serving for uploads.

Default port:

- `8080`

Health check:

- `GET /health`

### 5.2 API Routes

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Register and login |
| `/api/users` | User management |
| `/api/materials` | Material catalog |
| `/api/listings` | Material listing management |
| `/api/transactions` | Transactions |
| `/api/transport` | Transport and logistics |
| `/api/supply-chains` | Circular supply chains |
| `/api/reports` | Reports |
| `/api/messages` | Messaging |

### 5.3 Authentication APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive token |

Authentication uses:

- Password hashing with bcrypt.
- JWT generation and validation.
- Auth middleware for protected backend routes.

### 5.4 Listing APIs

The listing route is structured for:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/listings` | Get all listings |
| GET | `/api/listings/:id` | Get listing by ID |
| POST | `/api/listings` | Create a listing |
| PUT | `/api/listings/:id` | Update a listing |
| DELETE | `/api/listings/:id` | Delete a listing |

Some route handlers are currently placeholders and are ready for database implementation.

### 5.5 Material APIs

The material route is structured for:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/materials` | Get all materials |
| GET | `/api/materials/:id` | Get material by ID |
| POST | `/api/materials` | Create material |
| PUT | `/api/materials/:id` | Update material |
| DELETE | `/api/materials/:id` | Delete material |

### 5.6 Transaction APIs

The transaction route is structured for:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get transaction by ID |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |

## 6. Database Design

### 6.1 Database

Database system: PostgreSQL  
Database name: `circular_economy_marketplace`

### 6.2 Main Entities

| Entity | Purpose |
| --- | --- |
| `users` | Stores account, company, contact, role, and verification information. |
| `company_profiles` | Extends company-specific profile details. |
| `certifications` | Stores user or company sustainability certifications. |
| `material_categories` | Defines material classification hierarchy. |
| `materials` | Stores reusable material information. |
| `material_properties` | Stores material-specific property values. |
| `industrial_processes` | Stores process information for input/output material compatibility. |
| `material_listings` | Stores sellable material listings. |
| `transactions` | Stores buyer-seller material transactions. |
| `shipments` | Stores logistics and delivery details. |
| `sustainability_metrics` | Stores carbon, water, energy, and landfill impact values. |
| `messages` | Supports communication between buyers and sellers. |
| `notifications` | Stores user notifications. |
| `circular_supply_chains` | Stores high-level supply chain records. |
| `supply_chain_nodes` | Represents companies/processes inside a supply chain. |
| `supply_chain_links` | Represents material movement between supply chain nodes. |
| `reports` | Stores generated reporting results. |

### 6.3 Important Relationships

- One user can have one company profile.
- One user can create many material listings.
- One material can appear in many listings.
- One listing can create many transactions.
- One transaction connects buyer, seller, listing, shipment, and sustainability metrics.
- One circular supply chain can have many nodes and links.
- Messages may reference listings or transactions.

### 6.4 Currency and Location

The frontend demo uses:

- Currency: INR
- Primary location: Hyderabad, Telangana

The database currently has default currency values in some fields as `USD`. For production alignment, these defaults should be changed to `INR`.

## 7. Data Flow Design

### 7.1 Registration Flow

```text
User clicks Buy/Sell or Join
    |
    v
Register page
    |
    v
Submit registration form
    |
    v
POST /api/auth/register
    |
    v
Create user record
    |
    v
Return user/token
```

### 7.2 Selling Flow

```text
Customer logs in
    |
    v
Open Sell Material page
    |
    v
Enter material details
    |
    v
Create listing
    |
    v
Supply chain companies discover listing
    |
    v
Company contacts seller or purchases material
```

### 7.3 Buying Flow

```text
User opens marketplace
    |
    v
Browse/filter materials
    |
    v
Open material details
    |
    v
Buy material or contact seller
    |
    v
Transaction is created
```

### 7.4 Supply Chain Flow

```text
User opens supply chains
    |
    v
View available circular chains
    |
    v
Open chain details
    |
    v
Review companies, materials, impact, and meeting information
```

## 8. Security Design

### 8.1 Authentication

The backend supports JWT-based authentication. Passwords are hashed using bcrypt before storage.

### 8.2 Authorization

The design supports role-based users:

- `company`
- `transporter`
- `admin`

The frontend currently protects key pages by login state. The backend should enforce authorization on protected APIs before production deployment.

### 8.3 Input Validation

The backend uses Joi in implemented controllers for validation. All production APIs should validate:

- Required fields
- Email format
- Password strength
- Numeric price and quantity fields
- Valid enum values
- File upload type and size

### 8.4 API Protection

Current backend protections include:

- Helmet security headers
- CORS
- Rate limiting
- Error handling middleware

Future improvements:

- Per-route authentication
- Request body size limits
- File upload scanning
- Stronger CORS origin restrictions
- Audit logging for transactions

## 9. User Interface Design

### 9.1 Design Goals

The UI is designed to be:

- Clear for academic demonstration.
- Simple enough for first-time users.
- Focused on marketplace, supply chain, and impact concepts.
- Consistent with sustainability and circular economy branding.

### 9.2 Main Navigation

Primary navigation includes:

- Home
- Marketplace
- Supply Chains
- About
- Dashboard, My Listings, and Transactions after login

### 9.3 Contact Information

The platform contact details are:

- Email: `CircularEco@gmail.com`
- Phone: `+91 9493377754`
- Address: `Mahindra University, Hyderabad, Telangana 500043`

## 10. Non-Functional Requirements

### 10.1 Performance

- Frontend uses lazy-loaded pages to reduce initial load size.
- Vite provides optimized builds.
- Database indexes are defined for common query relationships.

### 10.2 Reliability

- The backend has a `/health` endpoint.
- Error handling middleware returns structured errors.
- The frontend uses error boundaries on the transactions page.

### 10.3 Maintainability

- The code is organized by pages, components, routes, controllers, interfaces, and utilities.
- TypeScript is used in both frontend and backend.
- Shared UI patterns are placed in reusable components.

### 10.4 Scalability

The design can scale by:

- Moving mock frontend data to backend APIs.
- Adding pagination and search indexes for listings.
- Using cloud PostgreSQL.
- Adding object storage for material images and certificates.
- Separating frontend hosting from backend API hosting.

## 11. Deployment Design

### 11.1 Local Development

Frontend:

```bash
cd client
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm run build
npm start
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Backend health check: `http://localhost:8080/health`

### 11.2 Environment Variables

Frontend:

- `VITE_API_URL` - API base URL.

Backend:

- `PORT`
- `DATABASE_URL`
- `DB_USER`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`
- `JWT_SECRET`
- `NODE_ENV`

### 11.3 Production Considerations

Before production deployment:

- Replace mock frontend data with API calls.
- Configure PostgreSQL and run schema migration.
- Change database currency defaults from USD to INR if the target region remains India.
- Add secure environment variables.
- Configure HTTPS.
- Fix dependency audit findings.
- Add automated tests.

## 12. Testing Strategy

### 12.1 Current Verification

The project has been verified by:

- Running frontend production builds using `npm run build`.
- Running backend TypeScript build using `npm run build`.
- Starting the local frontend at `localhost:5173`.
- Starting the backend and checking `/health`.

### 12.2 Recommended Test Cases

| Area | Test case |
| --- | --- |
| Registration | User can create account with valid data. |
| Login | User can log in with valid credentials. |
| Protected routes | Logged-out users are redirected from dashboard, listings, transactions, and profile. |
| Marketplace | User can view material cards with INR prices and Hyderabad location. |
| Buy flow | User can open material details and choose Buy Material. |
| Sell flow | Logged-in user can create a material listing. |
| My Listings | Created listings appear in seller listing management. |
| Transactions | User can view purchase and sale transactions. |
| Supply chains | User can browse and open supply chain details. |
| Contact details | Footer and support page show correct email, phone, and address. |

### 12.3 Future Automated Tests

Recommended tests:

- Unit tests for UI components.
- Unit tests for auth utilities.
- API tests for auth, listings, materials, and transactions.
- Integration tests for user registration and listing creation.
- End-to-end tests for buy/sell flows.

## 13. Limitations

Current limitations:

- Many frontend pages use mock data.
- Several backend resource routes are placeholders.
- No automated test suite is configured.
- PostgreSQL schema exists, but full API persistence is not completed for all modules.
- Some advanced workflows, such as payment, shipment tracking, messaging, and reports, are designed but not fully implemented.

## 14. Future Enhancements

Future enhancements include:

- Full database-backed listing creation and marketplace search.
- Image upload for material listings.
- Buyer-seller messaging.
- Transaction approval workflow.
- Logistics provider matching.
- Sustainability impact calculation.
- Admin dashboard.
- Email notifications.
- Payment integration.
- Report generation.
- Mobile responsiveness polish and accessibility testing.

## 15. Conclusion

The Circular Economy Marketplace provides a strong prototype for demonstrating how waste, scrap, and surplus materials can be converted into reusable resources through a digital marketplace. The design supports customers selling materials to supply chain companies, companies buying recovered materials, and participants viewing circular supply chain impact.

The current codebase is suitable as an academic prototype and can evolve into a production-ready marketplace by completing backend persistence, strengthening security, adding tests, and deploying with a managed database.
