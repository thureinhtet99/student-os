# 🎓 eSchool — School Management SaaS

A complete, beautifully designed **School Management System** built with **React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v3**, following the [shadcn/ui](https://ui.shadcn.com/blocks) design system. Includes full **role-based access control** (Admin · Teacher · Student · Parent), real-time-ready **Firebase** integration, and a **mock data mode** that works out of the box.

> Designed for every stakeholder: administrators, teachers, students, and parents — across desktop, tablet, and mobile.

---

## ✨ Features

### 👤 Authentication & RBAC
- Four roles, each with a tailored navigation and home page
- Email/password sign-in (via Firebase Auth when configured)
- One-click **demo logins** for every role
- Persistent session, automatic route guards

### 🏫 Admin
- Real-time dashboard with attendance trends, performance breakdowns, and enrollment charts
- Full **student records** management (add, search, filter by class)
- **Teacher performance** module with star ratings, performance badges, and progress bars
- **Class & section** management with live rosters
- **Fees** module: invoices, status, collection rate, mark-as-paid
- **Performance** module: top performers, subject radar, teacher comparison
- **Exams** schedule
- **Messages** (inbox + compose)
- **Attendance reporting** with auto-recompute of each student's attendance %
- **Settings**, **Help center** with FAQ

### 🧑‍🏫 Teacher
- Personal dashboard with classes, students, GPA, rating
- Mark attendance by class and date (present / absent / late / excused)
- **Gradebook** — add assessments, view per-student averages
- Weekly **schedule** (5-day timetable)
- Class **performance** analytics
- Inbox + compose messages

### 🎒 Student
- Personal dashboard with attendance, GPA, fees, recent grades
- Full **student record** view: profile, guardian, academics
- Attendance history with monthly stacked-bar breakdown
- **Grades** with subject radar chart and full assessment log
- Personal **timetable**
- **Fees** with status pie chart
- Inbox + compose

### 👨‍👩‍👧 Parent
- Dashboard that links to **all your children** in one click
- Monitor attendance, grades, fees, and timetable per child
- Send messages to teachers and admin
- Settings with notification preferences and security

### 🎨 UI / UX
- Built on shadcn design tokens (CSS variables, light + dark)
- Hand-rolled shadcn primitives (Radix UI + cva + tailwind-merge) — `Button`, `Card`, `Table`, `Dialog`, `DropdownMenu`, `Select`, `Tabs`, `Avatar`, `Badge`, `Progress`, `Popover`, `Tooltip`, `ScrollArea`, `Checkbox`, `Label`, `Input`, `Textarea`, `Separator`
- Responsive: desktop sidebar → mobile drawer with overlay
- Lucide icons throughout
- Recharts (area, bar, line, pie, radar)
- Class-based Tailwind dark mode with localStorage persistence

---

## 🏃 Quick start

```bash
# 1. Install
pnpm install   # or npm install / yarn install

# 2. Run the dev server
pnpm dev       # http://localhost:5173

# 3. Build for production
pnpm build     # → dist/

# 4. Preview the production build
pnpm preview
```

> The app ships with a fully working **mock data mode** powered by `localStorage`. You can run the app, add students, mark attendance, send messages — and the data persists across reloads. No configuration needed.

---

## 🔑 Demo accounts

On the login page, click any of the four **demo tiles** to instantly sign in as that role.

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@eschool.io` | `demo` |
| Teacher | `sarah.wilson@eschool.io` | `demo` |
| Student | `emma.thompson@eschool.io` | `demo` |
| Parent | `sarah.thompson@parent.io` | `demo` |

You can also use the email/password form with any of the seeded accounts.

---

## 🔥 Optional: enable real Firebase

The data layer auto-detects `VITE_USE_FIREBASE=true` in your environment. When enabled, **Firebase Authentication** is wired in (email/password). Firestore can be added inside `src/lib/store.ts` — the data store already has Firebase initialisation hooks.

### Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com/)
2. In **Project settings → General → Your apps**, register a Web app and copy the config.
3. In **Authentication → Sign-in method**, enable **Email/Password**.
4. Add a `.env` file in this directory:

```bash
VITE_USE_FIREBASE=true
VITE_FB_API_KEY=your-api-key
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-project-id
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=000000000000
VITE_FB_APP_ID=1:000000000000:web:abcdef
```

5. Restart the dev server.

The mock store will continue to work as a development fallback. To fully back the data with Firestore, expand the methods in `src/lib/store.ts` — the architecture is already there (`fbApp`, `fbAuth`, `fbDb` placeholders are ready).

---

## 🧱 Tech stack

- **React 19** + **Vite 8** + **TypeScript 6**
- **Tailwind CSS v3** with full shadcn design tokens
- **shadcn/ui** patterns (Radix UI + cva + tailwind-merge) — all hand-rolled, no CLI required
- **react-router-dom v7** with role-based nested routes
- **Firebase v12** (Auth + Firestore) — opt-in via env var
- **Recharts** for charts
- **lucide-react** for icons
- **clsx** + **tailwind-merge** + **class-variance-authority** for class composition

---

## 📁 Project structure

```
src/
├── components/
│   ├── ui/              # Hand-rolled shadcn primitives (17 components)
│   ├── AppLayout.tsx    # Sidebar + topbar + outlet
│   └── MetricCard.tsx   # Reusable metric tile + Panel wrapper
├── lib/
│   ├── types.ts         # Domain models
│   ├── seed.ts          # Demo data
│   ├── store.ts         # Unified data store (mock + Firebase)
│   ├── auth-context.tsx # AuthProvider / useAuth
│   ├── theme.tsx        # ThemeProvider (light/dark)
│   ├── nav.ts           # Role-based sidebar config
│   └── utils.ts         # cn, formatDate, initials, ...
├── pages/
│   ├── LoginPage.tsx
│   ├── admin/           # 11 pages
│   ├── teacher/         #  7 pages
│   ├── student/         #  7 pages
│   └── parent/          #  7 pages
├── App.tsx              # Router + AuthGate + role routes
├── main.tsx
└── index.css            # Tailwind + shadcn CSS variables
```

---

## 🚀 Deployment

The `dist/` folder is a static build. Deploy it anywhere:

### Vercel
```bash
pnpm dlx vercel
```

### Netlify
```bash
pnpm dlx netlify deploy --prod --dir=dist
```

### Firebase Hosting
```bash
npm i -g firebase-tools
firebase init hosting   # public dir → dist, single-page app → yes
firebase deploy
```

### GitHub Pages
Use a `vite.config.ts` `base: '/<repo>/'` and any static hosting workflow.

Remember to set `VITE_USE_FIREBASE=true` and your Firebase env vars in your hosting provider's environment settings.

---

## 🔄 Resetting mock data

Sign in as **Admin → Settings → Reset mock data**. This clears the `localStorage` and re-seeds the app with fresh demo data.

---

## 📜 License

MIT
