# Food Delivery App 🍕

Welcome to the **Food Delivery App** project, built using [Expo](https://expo.dev) and React Native.

---

## 🎨 Figma Design Links

Use the following Figma links to view the UI/UX designs, components, and user flows:
* **Figma Project (Dev Mode)**: [Figma Design Link](https://www.figma.com/design/iig3b1mWILbZRPyBOtaQBU/alipacno-%7C%7C-Custom-UI-U-design-%7C%7C-Bits-wise-%7C%7C-FO11BBB456F87--Copy-?node-id=1400-12221&m=dev)
* **Figma Project (Share Link)**: [Figma Design Link (Alternate)](https://www.figma.com/design/iig3b1mWILbZRPyBOtaQBU/alipacno-%7C%7C-Custom-UI-U-design-%7C%7C-Bits-wise-%7C%7C-FO11BBB456F87--Copy-?node-id=1400-12221&t=YAB6T9RTetL2c5BN-0)

---

## 🚀 Getting Started

Follow these steps to set up and run the development server locally:

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run start
```

In the terminal output, you will find options to run the app on:
* **Android Emulator**: Press `a` (or run `npm run android`)
* **iOS Simulator**: Press `i` (or run `npm run ios`)
* **Web Browser**: Press `w` (or run `npm run web`)
* **Expo Go**: Scan the QR code on your mobile device (sandbox environment)

### 3. Additional Scripts
* **Reset Project**: `npm run reset-project` (moves starter files to `app-example` and creates a fresh blank layout)
* **Linting**: `npm run lint`

---

## 📅 Day-by-Day Implementation Tracker

To help you build this project progressively, here is a day-by-day implementation breakdown based on the Figma design pages and screens. Use the checkboxes `[ ]` to track your progress!

### 🗺️ Phase 1: Design System & Shared Components (Days 1 - 2)
Establish the base styles and reusable elements to ensure UI consistency.
- [ ] **Day 1: Design System Tokens**
  - [ ] Configure styling colors matching the Figma `Design system` page colors (brand color, light/dark neutral backgrounds, accents).
  - [ ] Set up the typography scale (H1, H2, body, subtexts, SF Pro Display / Outfit fonts).
- [ ] **Day 2: Shared UI Components**
  - [ ] Implement custom button components (filled, unfilled, icon buttons).
  - [ ] Build standard text input fields (email, password with toggle, search bars).
  - [ ] Design reusable card layouts (restaurant card, item card, rider stat card).

### 🏍️ Phase 3: Rider App - Onboarding & Authentication (Days 3 - 5)
Implement the core entry and login flow for the Rider app.
- [ ] **Day 3: App Start & Onboarding**
  - [ ] `Start` Screen
  - [ ] `Onboarding 1` Screen
  - [ ] `Onboarding 2` Screen
  - [ ] `Onboarding 3` Screen
- [ ] **Day 4: Credentials Login & OTP Verification**
  - [ ] `Login 1` & `Login 2` (Social login alternatives)
  - [ ] `Verification` (OTP input fields with auto-focus and countdown timer)
- [ ] **Day 5: Password Recovery Flow**
  - [ ] `Forgot Password` Screen
  - [ ] `Reset Password` Screen
  - [ ] `Reset Password Success` Confirmation Screen

### 🏠 Phase 3: Rider App - Core Portal & Navigation (Days 6 - 9)
Build the primary pages that riders interact with daily.
- [ ] **Day 6: Main Home Screen**
  - [ ] Dashboard view (Online status toggle, today's earnings progress card, ongoing orders list).
- [ ] **Day 7: Orders & Active Delivery Map**
  - [ ] `Order` details sheet/screen.
  - [ ] `Delivery` execution screen (client info, delivery items, actions).
  - [ ] `Location` tracking maps and live route visualizers (`Route` screen).
- [ ] **Day 8: Shift Management & Scheduling**
  - [ ] `Shift` Planner (available shifts, booked slots, calendar view).
- [ ] **Day 9: Live Support & Communication**
  - [ ] `Chat` screen (customer-to-rider chat interface).
  - [ ] Support ticket / hotline page.

### ⚙️ Phase 4: Rider App - Profile & Settings (Days 10 - 11)
- [ ] **Day 10: Profile & Account Management**
  - [ ] Rider Profile view showing ratings, stats, and milestones.
  - [ ] `Account` settings (edit personal information, password, documents).
- [ ] **Day 11: Info & App Config**
  - [ ] `Terms` & `Privacy Policy` viewer.
  - [ ] `FAQ` screen with collapsible accordion questions.
  - [ ] `Notification` preferences dashboard.

### 🖥️ Phase 5: Admin Dashboard - Core Layout & Analytics (Days 12 - 14)
Transition to building the web-based desktop management system.
- [ ] **Day 12: Admin Dashboard Skeleton**
  - [ ] Set up layout structure (collapsible sidebar, global header, responsive grid).
  - [ ] Build key components: metrics cards (total sales, active drivers, orders count) and interactive charts.
- [ ] **Day 13: CRM & User/Staff Management**
  - [ ] `Crm Management` screen (customer database, interaction history).
  - [ ] `Add User` form screen.
  - [ ] `Staff Management` & `Role and Permissions` matrix.
- [ ] **Day 14: Drivers & Shift Dispatch Control**
  - [ ] `Drivers Page` (view all active/inactive drivers, ratings, live status).
  - [ ] Real-time deliveries dispatch screen (`Deliveries Management`).

### 📦 Phase 6: Admin Dashboard - Inventory, Marketing, & Settings (Days 15 - 18)
- [ ] **Day 15: Menu & Inventory Control**
  - [ ] `Menu` listing and editor (add/edit items, categories, pricing).
  - [ ] `Inventory Management` grid (stock levels, supplier logs, warnings).
- [ ] **Day 16: Marketing Hub**
  - [ ] `Marketing Campaign Hub` (create coupons, push notifications, banners).
- [ ] **Day 17: Logs, Messaging & Live Support**
  - [ ] `Call Logs page` / `Call Logs details page`.
  - [ ] Admin `Chat` terminal (communicating with riders/customers).
- [ ] **Day 18: System Preferences & Review**
  - [ ] `Review and Confirmation` dashboard page.
  - [ ] `Settings` configuration page.
  - [ ] `Admin Profile` edit screen.

