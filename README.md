# Northstar Finance Dashboard

A responsive frontend-only finance dashboard built with plain HTML, CSS, and JavaScript for the assignment brief.

## What it includes

- Dashboard overview with summary cards for total balance, income, and expenses
- Time-based visualization showing monthly balance trend
- Categorical spending breakdown for expense categories
- Transactions table with search, filtering, and sorting
- Simulated role-based UI with `Viewer` and `Admin`
- Currency switcher with INR and other country-aware display formats
- Financial health score card and category budget watch section
- CSV and JSON export actions for the transaction dataset
- Insights panel for highest spending category, monthly comparison, savings posture, and recurring cost pressure
- Local storage persistence for theme, role, filters, and transaction edits
- Empty states and mobile-friendly table behavior

## Role behavior

- `Viewer`: can explore data but cannot add or edit transactions
- `Admin`: can add new transactions and edit existing ones from the modal form

## Project structure

- [index.html](C:\Users\Amrita\OneDrive\文档\New project\index.html): application layout and modal markup
- [styles.css](C:\Users\Amrita\OneDrive\文档\New project\styles.css): visual system, responsive layout, charts, and table styling
- [js/app.js](C:\Users\Amrita\OneDrive\文档\New project\js\app.js): application state, rendering, charts, filters, role logic, and persistence

## Setup

1. Open [index.html]in a browser.
2. If you use VS Code, Live Server works well for local preview.

No build step or backend is required.

## Approach

The dashboard uses a lightweight state object persisted to `localStorage` so interactions feel realistic without needing a backend. Charts are rendered with simple SVG and CSS-driven bars to keep the implementation dependency-free while still showing clear visual structure.

The UI aims to feel intentional rather than generic: a Zorvyn-inspired futuristic palette, high-contrast panels, bold typography, and a focused two-column layout that collapses cleanly on smaller screens.

## Reasonable assumptions

- Transactions are stored as USD-based mock values and converted on the frontend for display in INR, EUR, GBP, AED, and SGD using static demo rates
- Mock data represents recent personal finance activity centered on March 2026
- Role switching is purely a frontend simulation for demonstration purposes


