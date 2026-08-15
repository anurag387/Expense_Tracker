# Expense Tracker — React (Frontend-only) Version

A personal finance dashboard built with **React 18 + Vite**, styled to match the
dark-finance dashboard design spec (with a Light mode toggle), supporting
**English + বাংলা**.

This is the **React version**: there is no separate Node/Express/MongoDB
backend. All data (accounts, transactions, categories, reminders, and the
user's own registered accounts) is stored in the browser's `localStorage`,
namespaced per user. That means:

- It runs immediately with just `npm install` — no database or server setup.
- Data persists across refreshes/restarts on the same browser.
- Data does **not** sync across devices/browsers (there's no real backend).
- Passwords are stored locally in plain text for demo purposes only — **do
  not reuse a real password when testing this app**.

If you later want the full-stack version (Node + Express + MongoDB, real
password hashing, JWT auth, image storage, etc.) the data layer in
`src/hooks/` and `src/context/AuthContext.jsx` is the part you'd swap out for
real API calls — the rest of the app (components, pages, charts) would not
need to change much, since they only talk to the hooks, not to
localStorage directly.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Features implemented

- **Auth**: Register (with profile photo upload), Login, Forgot Password
  (demo mode — no real email is sent), protected routes, Log out
- **Dashboard**: Balance / Expense / Income summary cards with month-over-
  month % change, category breakdown (progress bars + donut chart), recent
  transactions, upcoming reminders, account/month/year filters
- **Transactions**: full CRUD, All/Income/Expense tabs, search, and
  category/month/year filters
- **Categories**: full CRUD with icon + color picker, per-category spend
  totals
- **Statistics**: Bar chart (income vs expense by month), Line chart
  (spending trend), Donut chart (category breakdown), year selector
- **Reminders**: add, edit, mark complete/incomplete, delete
- **Profile**: view/edit name, email, and profile photo (JPG/PNG/WebP,
  client-side validated, stored as a data URL)
- **Settings**: Dark/Light theme toggle, English/বাংলা language toggle,
  change password
- **Theming**: CSS variables matching the design spec's color system, with
  the motion/animation rules from the spec (card hover, modal fade+scale,
  list add/delete transitions, animated chart mount, theme cross-fade, etc.)
- **Responsive**: sidebar on desktop, bottom tab bar on mobile

## Project structure

```
src/
  components/       Reusable UI: Sidebar, modals, charts, cards, rows
  context/          AuthContext, ThemeContext, LanguageContext
  hooks/            localStorage-backed data hooks (categories, accounts,
                     transactions, reminders) + generic useLocalStorageState
  i18n/              en.js / bn.js dictionaries
  pages/             One file per route (Dashboard, Transactions, ...)
  utils/             storage.js, format.js, calculations.js
  App.jsx            Route definitions
  main.jsx           App bootstrap (providers + router)
  index.css          Global theme variables + all component styles
```

## Notes on scope

Everything in the design spec's "Required Final Financial Features"
checklist is implemented (balance/income/expense totals + counts, full
transaction CRUD, category stats, all three chart types, search/filters,
account/month/year filtering), plus reminders, profile photo, and the
bn/en + dark/light systems.

Left out on purpose, since they need a real backend to make sense:
- Real email delivery for password reset
- Server-side auth (JWT, hashed passwords), rate limiting
- Multi-device data sync
- Automated tests (kept out to keep the delivered zip focused — the design
  doc's Section 71 notes this as optional "for portfolio credibility" and is
  a good next addition if you want to extend this yourself)

## Default login data

There's no seeded demo account — register a new one from the **Create
Account** page to get started. Each registered user gets their own set of
default categories (Food, Groceries, Transport, Shopping, Bills, Health,
Entertainment, Salary, Other) and accounts (Cash, Bank), which you can edit
or delete afterward.
