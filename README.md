# ♻️ E2Recycle — E-Waste Management Platform



**A full-stack web platform for responsible e-waste management — connecting users, recyclers, and administrators through a transparent recycling ecosystem.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [User Roles](#-user-roles)
- [System Workflows](#-system-workflows)
- [API Endpoints](#-api-endpoints)
- [Commission System](#-commission-system)
- [Security](#-security)
- [License](#-license)

---

## 🌍 Overview

**E2Recycle** is a comprehensive e-waste management platform that bridges the gap between individuals, businesses, and certified recyclers. Users can submit recycling requests for electronic devices, recyclers can accept and process them, and an admin oversees the entire operation — including a built-in **8% commission tracking system**.

> *"Transform your electronic waste into environmental impact."*

---

## ✨ Features

### 👤 For Users
- 📝 **Submit Recycling Requests** — specify product name, type, quantity, estimated price, condition, and preferred pickup date
- 📦 **Track Request Status** — monitor your request from submission through completion
- 🔒 **Secure Authentication** — JWT-based login with role-based access control
- 🏢 **Multiple User Types** — Individual, Business, Educational Institution, or Recycler

### ♻️ For Recyclers
- 📬 **View Incoming Requests** — browse all admin-approved requests available to accept
- ✅ **Accept Requests** — claim requests for processing (blocked if commission payments are outstanding)
- 💳 **Commission Payments** — submit 8% commission payments with payment reference numbers
- 📄 **PDF Export** — download request and transaction reports as PDFs

### 🛠️ For Admins
- 📊 **Full Dashboard** — view all users, requests, and transactions in one place
- ✔️ **Approve / Reject Requests** — review and approve user-submitted recycling requests
- 💰 **Confirm Payments** — verify and confirm recycler commission payments, or mark as disputed
- 📋 **Transaction History** — complete audit trail of all commission payments with admin notes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **PDF Generation** | jsPDF + html2canvas |
| **Validation** | express-validator |
| **Dev Tools** | nodemon, dotenv |

---

## 📁 Project Structure

```
E2Recycle/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema (individual, business, educational, recycler)
│   │   ├── RecyclingRequest.js  # Recycling request schema & status workflow
│   │   └── Transaction.js       # Commission transaction schema
│   ├── routes/
│   │   ├── auth.js              # Register & login endpoints
│   │   ├── recyclingRequests.js # CRUD for recycling requests
│   │   └── transactions.js      # Commission payment endpoints
│   ├── server.js                # Express app entry point
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.js        # Public landing page
│   │   │   ├── HeroSection.js        # Animated typing hero
│   │   │   ├── Navbar.js             # Navigation bar
│   │   │   ├── Footer.js             # Site footer
│   │   │   ├── LoginPage.js          # Login form
│   │   │   ├── RegisterPage.js       # Multi-step registration
│   │   │   ├── DashboardLayout.js    # Shared dashboard shell
│   │   │   ├── RecyclingRequestForm.js # Submit new request
│   │   │   ├── AcceptedRequests.js   # User's accepted requests
│   │   │   ├── IncomingRequests.js   # Recycler's available requests
│   │   │   ├── CommissionPayments.js # Recycler commission portal
│   │   │   ├── AdminDashboard.js     # Admin control panel
│   │   │   ├── AdminTransactions.js  # Admin payment management
│   │   │   ├── ApprovedRecyclers.js  # Approved recycler list
│   │   │   └── ProtectedRoute.js     # Auth-guarded routes
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gautamshah01/E2Recycle.git
   cd E2Recycle
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

In the `backend/` directory, copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Then edit `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/e2recycle

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRE=30d

# Admin Credentials
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password

# Commission Rate (%)
ADMIN_COMMISSION_RATE=8

# Admin Bank Details (shown to recyclers for commission payment)
ADMIN_BANK_NAME=Your Bank Name
ADMIN_ACCOUNT_NUMBER=your_account_number
ADMIN_IFSC_CODE=your_ifsc_code
ADMIN_ACCOUNT_HOLDER=Your Name
ADMIN_UPI_ID=your_upi_id@bank
```

### Running the App

**Start the backend server** (from `/backend`):
```bash
npm run dev       # Development (with nodemon)
# or
npm start         # Production
```
> Backend runs on `http://localhost:5000`

**Start the frontend** (from `/frontend`):
```bash
npm start
```
> Frontend runs on `http://localhost:3000`

---

## 👥 User Roles

| Role | Description |
|---|---|
| **Individual** | Household users who want to recycle personal electronics |
| **Business** | Companies recycling office equipment in bulk |
| **Educational** | Schools/colleges disposing of institutional e-waste |
| **Recycler** | Certified recyclers who accept and process requests |
| **Admin** | Platform administrators with full oversight |

---

## 🔄 System Workflows

### Recycling Request Lifecycle

```
User Submits Request
       ↓
Admin Reviews & Approves/Rejects
       ↓
Recycler Views & Accepts Request
       ↓
Commission Transaction Created (8%)
       ↓
Request Marked as Completed
       ↓
Recycler Pays Commission → Admin Confirms
```

### Commission Payment Flow

```
Request Accepted by Recycler
       ↓
8% Commission Auto-Calculated
       ↓
Recycler Submits Payment (with reference no.)
       ↓
Admin Reviews & Confirms (or Disputes)
       ↓
Recycler Unlocked to Accept New Requests
```

> ⚠️ Recyclers **cannot accept new requests** while they have outstanding unpaid commission payments.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login (user or admin) |

### Recycling Requests
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/recycling-requests` | Get all requests | ✅ |
| `POST` | `/api/recycling-requests` | Submit new request | ✅ |
| `PUT` | `/api/recycling-requests/:id/approve` | Admin approve request | ✅ Admin |
| `PUT` | `/api/recycling-requests/:id/accept` | Recycler accept request | ✅ Recycler |

### Transactions (Commission)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/transactions/recycler/pending` | Recycler's pending payments | ✅ Recycler |
| `PUT` | `/api/transactions/:id/pay` | Submit commission payment | ✅ Recycler |
| `PUT` | `/api/transactions/:id/confirm` | Admin confirm/dispute payment | ✅ Admin |

---

## 💰 Commission System

E2Recycle uses an **8% commission model**:

1. When a recycler accepts a request, a `Transaction` record is automatically created.
2. The commission is calculated as: `orderAmount × 0.08`
3. Recyclers submit payment offline (bank transfer / UPI) with a reference number.
4. Admins verify and confirm payments through the admin dashboard.
5. Confirmed payments unlock the recycler to accept future requests.

---

## 🔐 Security

- 🔑 **Password Hashing** — bcryptjs with 10 salt rounds
- 🎫 **JWT Authentication** — stateless, 24-hour expiry tokens
- 🛡️ **Protected Routes** — middleware guards all sensitive endpoints
- ✅ **Input Validation** — express-validator on all form inputs
- 🌐 **CORS** — configured for controlled cross-origin access
- 🔒 **Environment Variables** — credentials never hardcoded in source

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 [Gautam Shah](https://github.com/gautamshah01)

---

<div align="center">

Made with 💚 for a greener planet

*E2Recycle — Turning e-waste into environmental impact, one device at a time.*

</div>
