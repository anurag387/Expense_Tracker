<div align="center">

# 💰 Expense Tracker

### Full-Stack Personal Finance Dashboard — React + Express

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-brightgreen?style=for-the-badge)](https://expense-tracker-beta-liard.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Languages](https://img.shields.io/badge/i18n-English%20%7C%20বাংলা-orange?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

A dark-finance dashboard — track income, expenses, and budgets with charts, categories, reminders, and bilingual (English + বাংলা) support.

**🔗 [Live Demo](https://expense-tracker-beta-liard.vercel.app)**

</div>

---

## 📖 About

A personal finance dashboard built with **React 18 + Vite** on the frontend and a **Node/Express API** on the backend, styled to match a dark-finance dashboard design spec (with a Light mode toggle), supporting **English + বাংলা**.

This is the **full-stack version**: real user accounts (hashed passwords, JWT-based login sessions) live on a small Express API, and all data (accounts, transactions, categories, reminders) is stored server-side and scoped to the logged-in user — so it now syncs across browsers/devices, instead of being stuck in one browser's `localStorage`.

> 💡 The backend uses a lightweight JSON-file "database" (`server/data/db.json`, created automatically on first run) rather than MongoDB/Postgres — there's nothing extra to install or configure, `npm install` is all it takes. If you want to swap in a real database later, `server/src/db.js` is the only file that would need to change; every route just calls `readDB()` / `writeDB()`.

---

## 📑 Table of Contents

- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Features Implemented](#-features-implemented)
- [Frontend Structure](#-project-structure-frontend)
- [Backend Structure](#-project-structure-backend)
- [API Overview](#-api-overview)
- [Notes on Scope](#-notes-on-scope)
- [Default Login Data](#-default-login-data)
- [License](#-license)

---

## 🗂 Project Structure

```
expense-tracker/
  src/            React frontend (Vite)
  server/         Express backend (JWT auth + JSON-file storage)
  package.json    Frontend package.json (+ scripts to run both together)
```

---

## 🚀 Getting Started

You need two things running: the **backend API** and the **frontend**.

### ⚡ Quick start (one command)

```bash
# from the expense-tracker/ root, first time only:
npm run install:all

# copy the example env files (defaults already match each other)
cp .env.example .env
cp server/.env.example server/.env

# then, every time you want to run the app:
npm run dev:all
```

This prints two color-coded logs (`FRONTEND` / `BACKEND`) in one terminal. Open the printed frontend URL — usually `http://localhost:5173`.

<details>
<summary><strong>🖥️ Prefer two separate terminals?</strong></summary>

```bash
# Terminal 1 — backend
cd server
npm install
cp .env.example .env
npm run dev

# Terminal 2 — frontend
npm install
cp .env.example .env
npm run dev
```

</details>

### 📦 Production build

```bash
npm run build
npm run preview
```

> The backend doesn't need a build step — `npm start` inside `server/` runs it as-is (use this instead of `npm run dev` in production, since `dev` uses `--watch` for auto-restart on file changes).

---

## 🔐 Environment Variables

**Frontend** (`.env`, see `.env.example`):

| Variable       | Purpose                                 | Default                     |
| -------------- | ---------------------------------------- | ---------------------------- |
| `VITE_API_URL` | Base URL the frontend calls for the API | `http://localhost:4000/api` |

**Backend** (`server/.env`, see `server/.env.example`):

| Variable         | Purpose                                                                            | Default                  |
| ----------------- | ----------------------------------------------------------------------------------- | -------------------------- |
| `PORT`           | Port the API listens on                                                            | `4000`                   |
| `JWT_SECRET`     | Secret used to sign login tokens — **change this** before deploying anywhere real  | *(placeholder)*           |
| `JWT_EXPIRES_IN` | How long a login session stays valid                                              | `7d`                      |
| `CLIENT_ORIGIN`  | Frontend URL, used for CORS                                                       | `http://localhost:5173`  |

> ⚠️ Neither `.env` file is committed to git (see `.gitignore`) — that's why there's a `.env.example` to copy from instead.

---

## ✨ Features Implemented

<table>
<tr>
<td valign="top" width="50%">

**🔑 Auth**
- Register (with profile photo upload), Login, Forgot Password (demo mode — no real email is sent)
- Protected routes, Log out
- Passwords hashed with bcrypt server-side, never stored/sent in plain text after registration
- Sessions are JWTs sent as `Authorization: Bearer <token>` on every API request

**📊 Dashboard**
- Balance / Expense / Income summary cards with month-over-month % change
- Category breakdown (progress bars + donut chart)
- Recent transactions, upcoming reminders
- Account / month / year filters

**💸 Transactions**
- Full CRUD
- All / Income / Expense tabs
- Search, category/month/year filters

**🏷️ Categories**
- Full CRUD with icon + color picker
- Per-category spend totals

</td>
<td valign="top" width="50%">

**📈 Statistics**
- Bar chart (income vs expense by month)
- Line chart (spending trend)
- Donut chart (category breakdown)
- Year selector

**⏰ Reminders**
- Add, edit, mark complete/incomplete, delete

**👤 Profile**
- View/edit name, email, and profile photo (JPG/PNG/WebP, client-side validated, stored as a data URL)

**⚙️ Settings**
- Dark/Light theme toggle
- English/বাংলা language toggle
- Change password

**🎨 Theming**
- CSS variables matching the design spec's color system
- Motion/animation rules (card hover, modal fade+scale, list add/delete transitions, animated chart mount, theme cross-fade)

**📱 Responsive**
- Sidebar on desktop, bottom tab bar on mobile

</td>
</tr>
</table>

---

## 🖼️ Project Structure (Frontend)

```
src/
  components/       Reusable UI: Sidebar, modals, charts, cards, rows
  context/          AuthContext (talks to the API), ThemeContext, LanguageContext
  hooks/            API-backed data hooks (categories, accounts,
                     transactions, reminders)
  i18n/             en.js / bn.js dictionaries
  pages/            One file per route (Dashboard, Transactions, ...)
  utils/            api.js (fetch wrapper), format.js, calculations.js,
                     storage.js (still used for theme/language prefs only)
  App.jsx           Route definitions
  main.jsx          App bootstrap (providers + router)
  index.css         Global theme variables + all component styles
```

---

## 🛠️ Project Structure (Backend)

```
server/
  src/
    index.js            Express app entry point
    db.js               JSON-file "database" (read/write/uid helpers)
    middleware/auth.js  JWT sign + verify middleware
    routes/
      auth.js            register, login, me, profile, password, forgot-password
      transactions.js    CRUD, scoped to the logged-in user
      categories.js      CRUD, scoped to the logged-in user
      accounts.js        CRUD, scoped to the logged-in user
      reminders.js       CRUD + toggle, scoped to the logged-in user
    utils/
      asyncHandler.js    wraps async routes so errors reach Express
      defaults.js        seeds default categories/accounts for new users
  data/
    db.json              auto-created on first run — not committed to git
```

---

## 🔌 API Overview

> All routes below (except `/auth/register`, `/auth/login`, `/auth/forgot-password`) require `Authorization: Bearer <token>`.

| Method & Path | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create an account, returns `{ token, user }` |
| `POST /api/auth/login` | Log in, returns `{ token, user }` |
| `GET /api/auth/me` | Get the current user |
| `PUT /api/auth/profile` | Update name/email/photo |
| `PUT /api/auth/password` | Change password |
| `POST /api/auth/forgot-password` | Demo password-reset check |
| `GET/POST /api/transactions`, `PUT/DELETE /api/transactions/:id` | Transaction CRUD |
| `GET/POST /api/categories`, `PUT/DELETE /api/categories/:id` | Category CRUD |
| `GET/POST /api/accounts`, `PUT/DELETE /api/accounts/:id` | Account CRUD |
| `GET/POST /api/reminders`, `PUT/DELETE /api/reminders/:id`, `POST /api/reminders/:id/toggle` | Reminder CRUD |

---

## 📌 Notes on Scope

Left out on purpose, since they're beyond what a personal-project backend typically needs:

- ❌ Real email delivery for password reset (still demo mode — reports whether the account exists, doesn't send anything)
- ❌ Refresh tokens / token revocation (JWTs just expire after `JWT_EXPIRES_IN`)
- ❌ Rate limiting
- ❌ A "real" database (Postgres/MongoDB) — the JSON-file store is fine for a personal project or portfolio piece, and swapping it in later only touches `server/src/db.js`
- ❌ Automated tests

---

## 👤 Default Login Data

There's no seeded demo account — register a new one from the **Create Account** page to get started. Each registered user gets their own set of default categories (Food, Groceries, Transport, Shopping, Bills, Health, Entertainment, Salary, Other) and accounts (Cash, Bank), which you can edit or delete afterward.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You're free to use, modify, and distribute this project, even commercially, as long as the original copyright notice is included.

---

<div align="center">

Made with ❤️ using React & Express

</div>
