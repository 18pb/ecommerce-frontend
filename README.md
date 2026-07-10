# ITJOBXS Client E-Commerce Dashboard — Frontend

A role-based e-commerce dashboard built with React, featuring JWT authentication, dynamic admin/user views, and real-time product catalog management. Built as part of a client project for ITJOBXS.

## Features

- 🔐 **JWT-based Authentication** — Secure login/signup flow with token stored in `localStorage` and auto-attached to API requests via Axios interceptors
- 👥 **Role-Based Access Control** — Dynamic UI rendering for **Admin** and **User** roles from a single codebase
  - Admins get a product management console (create, publish, delete)
  - Users get a live shopping view with order-trigger actions
- 🛒 **Live Product Catalog** — Real-time fetch of products from the backend, displayed in a responsive grid with stock and pricing info
- 🛠️ **Admin Console** — Form-driven product creation (name, price, stock, category, description) with instant catalog refresh
- 🎨 **Responsive UI** — Built with Tailwind CSS, mobile-friendly layout with clean card-based design

## Tech Stack

- **React** (functional components + hooks)
- **Axios** for API communication
- **Tailwind CSS** for styling
- **JWT** for stateless authentication

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
- **No token** → renders the login/signup gateway (`Render Layer 1`)
- **Valid token** → renders the full dashboard (`Render Layer 2`), fetching products and adapting the UI based on the user's role
- Axios is configured with a request interceptor that automatically attaches the `Authorization: Bearer <token>` header to every secured API call
- Signup allows the user to register as either a standard **User** or an **Admin**, which determines what actions they can perform on the dashboard

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/18pb/itjobxs-ecommerce-frontend.git
   cd itjobxs-ecommerce-frontend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Make sure the [backend](https://github.com/18pb/itjobxs-ecommerce-backend) is running on `http://localhost:5050` (or update the `baseURL` in `App.jsx` accordingly)

## Related Repo

- Backend: [itjobxs-ecommerce-backend](https://github.com/18pb/itjobxs-ecommerce-backend)

## Author

Built by [Prasidh Bhardwaj](https://github.com/18pb) as part of an internship engagement with ITJOBXS.
