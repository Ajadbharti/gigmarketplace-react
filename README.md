# SkillBridge: Freelance Gig Marketplace (Demo)

A frontend-only freelance marketplace built with **Next.js (App Router)**, React, Tailwind CSS, Lucide React and React Hook Form.
Clients can browse gigs, place demo orders, track them and leave reviews. Freelancers can publish and manage gigs and deliver work.

> **This is a demo.** There is no backend, no database, no real authentication and no payments.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Demo accounts (password: `demo1234`)

| Role       | Email                 |
|------------|-----------------------|
| Client     | client@demo.com       |
| Client     | client2@demo.com      |
| Freelancer | freelancer@demo.com   |
| Freelancer | f2@demo.com ... f6@demo.com |

You can also register new Client or Freelancer accounts.
Use the **Reset demo data** link in the footer to restore the original seed data.

## Features

- Home page with search, categories, featured gigs, top freelancers
- `/gigs`: search (title, skill, freelancer), category / price / rating filters, sorting, load more, empty state
- `/gigs/[id]`: gig details, reviews, related gigs, Order Now
- `/freelancers/[id]`: profile, portfolio, gigs, reviews, edit profile (owner only)
- Demo auth with Client / Freelancer roles and role-based redirects
- Client dashboard: order stats, status tabs, review completed orders
- Freelancer dashboard: stats, create / edit / delete gigs, accept or decline orders, deliver work
- `/orders/[id]`: timeline, delivery details, request revision, complete order (role-restricted)
- Reviews: 1 to 5 stars, only for completed orders, one review per order

## Project structure

```
src/
  app/            Routes (App Router)
  components/     layout, gigs, freelancers, dashboard, orders, reviews, ui
  context/        AuthContext (users/session), MarketplaceContext (gigs, orders, reviews, profiles)
  data/           Seed data (categories, users, freelancers, gigs, orders, reviews)
  lib/            storage.js (LocalStorage wrapper), utils.js, useRequireRole.js
```

## Limitations (please read)

- **Mock data + LocalStorage only.** Data lives in your browser. It is not shared between users, browsers or devices, and clearing site data erases it.
- **Authentication is NOT secure.** Passwords are stored in plain text in LocalStorage. Never enter a real password. Role checks run in the browser and can be bypassed.
- **No payments.** "Orders" are simulated; no money moves.
- **No file uploads.** Images are URLs. Remote placeholder images (picsum.photos, pravatar.cc) need an internet connection; a fallback is shown if an image fails.
- **No real-time updates.** Changes made in another browser tab appear only after a refresh.
- **No messaging, notifications or email.**
- Earnings on the dashboard are calculated from completed demo orders.

## Preparing for a real backend

The UI talks only to the context actions, so a backend can replace them without rewriting pages.

| Current (demo)                         | Replace with                                   |
|----------------------------------------|------------------------------------------------|
| `AuthContext.login/register/logout`    | `POST /auth/login`, `POST /auth/register`, session cookie or JWT (hashed passwords) |
| `MarketplaceContext.addGig/updateGig/deleteGig` | `POST/PATCH/DELETE /gigs`, ownership check on server |
| `createOrder`, `updateOrderStatus`, `deliverOrder`, `requestRevision`, `completeOrder` | `POST /orders`, `PATCH /orders/:id/status` with a server-side state machine |
| `addReview`                            | `POST /orders/:id/review` (server enforces completed + one review) |
| `getGigStats`, `getFreelancerStats`    | Aggregated queries or cached counters         |
| `lib/storage.js` + `data/*.js`         | Database (e.g. PostgreSQL / MongoDB) + API client |
| Image URLs                             | Object storage (S3 / Cloudinary) with uploads |
| Demo order flow                        | Payment provider (e.g. Stripe) with escrow    |

Suggested next steps: move data fetching to Server Components or a data layer (React Query / SWR), add TypeScript types for Gig, Order, Review and User, and add server-side validation with the same rules as the forms.