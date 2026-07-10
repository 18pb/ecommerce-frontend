# Role-Based E-Commerce Dashboard — Frontend

A role-based e-commerce dashboard built with React, featuring JWT authentication, dynamic admin/user views, and real-time product catalog management.

🔗 **Live Demo:** [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

## Features

- 🔐 **JWT-based Authentication** — Secure login/signup flow with token stored in `localStorage` and auto-attached to API requests via Axios interceptors
- 👥 **Role-Based Access Control** — Dynamic UI rendering for **Admin** and **User** roles from a single codebase
  - Admins get a product management console (create, publish, delete)
  - Users get a live shopping view with order-trigger actions
- 🔒 **Secure-by-Default Signup** — Public registration always creates a standard **User** account; admin accounts are never self-assignable from the client
- 🛒 **Live Product Catalog** — Real-time fetch of products from the backend, displayed in a responsive grid with stock and pricing info
- 🛠️ **Admin Console** — Form-driven product creation (name, price, stock, category, description) with instant catalog refresh
- 🎨 **Responsive UI** — Built with Tailwind CSS, mobile-friendly layout with clean card-based design

## Tech Stack

- **React** (functional components + hooks)
- **Axios** for API communication
- **Tailwind CSS** for styling
- **JWT** for stateless authentication
- **Deployed on Vercel** (frontend) + **Render** (backend)

## Project Structure

```
frontend/
  src/
    App.jsx        # Main application logic (auth + dashboard)
    main.jsx        # React entry point
  public/
    favicon files
  index.html
```

## How It Works

- On load, the app checks `localStorage` for an existing JWT token
- **No token** → renders the login/signup gateway
- **Valid token** → renders the full dashboard, fetching products and adapting the UI based on the user's role
- Axios is configured with a request interceptor that automatically attaches the `Authorization: Bearer <token>` header to every secured API call
- Signup only ever creates a standard **User** account — there is no option to self-register as admin. Admin accounts are provisioned manually on the backend, which also enforces this rule server-side

## Setup (Local Development)

1. Clone the repo
   ```bash
   git clone https://github.com/18pb/ecommerce-frontend.git
   cd ecommerce-frontend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root:
   ```
   VITE_API_URL=http://localhost:5050/api
   ```
   For production, point this to the deployed backend URL instead (must include `/api`). If `VITE_API_URL` isn't set, the app falls back to the live deployed backend.
4. Run the dev server
   ```bash
   npm run dev
   ```
5. Make sure the [backend](https://github.com/18pb/ecommerce-backend) is running (locally or deployed) and `VITE_API_URL` points to it.

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com), auto-deploying from the `main` branch.
- **Backend** is deployed on [Render](https://render.com) at `https://ecommerce-backend-itj1.onrender.com`, connected to a MongoDB Atlas cluster.
- The `VITE_API_URL` environment variable is set in the Vercel project settings to point to the live backend.

## Related Repo

- Backend: [ecommerce-backend](https://github.com/18pb/ecommerce-backend)

## Author

Built by [Prasidh Bhardwaj](https://github.com/18pb)
