# Student Management System (SMS) - Authentication Guidelines

**Target System:** Private College/University SMS  
**Tech Stack:** TypeScript, Node.js, React, Expo  
**Date:** June 2026  
**Version:** 1.0

---

## 1. SUPER ADMIN IMPLEMENTATION

### Recommended Approach: Secure Bootstrap via Seed Script

**DO NOT:**

- ❌ Implement super admin directly via raw SQL query
- ❌ Use plain manual DB insertion
- ❌ Hardcode credentials in source code

**DO:**

- ✅ Create a seed script (`seed-admin.ts`) that runs once on first deployment
- ✅ Use environment variables for credentials (`INIT_SUPER_ADMIN_EMAIL`, `INIT_SUPER_ADMIN_PASSWORD`)
- ✅ Call your normal `createUser()` service (ensures password hashing, validation)
- ✅ Mark database as seeded to prevent re-running

### Example Implementation (TypeScript/Node.js)

```typescript
// seed-admin.ts
import { createUser } from './auth.service';
import { env } from './env';

if (!env.DB_SEEDED) {
  const email = env.INIT_SUPER_ADMIN_EMAIL;
  const password = env.INIT_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'INIT_SUPER_ADMIN_EMAIL and INIT_SUPER_ADMIN_PASSWORD required',
    );
  }

  await createUser({
    email,
    password,
    role: 'super_admin',
  });

  await db.query('UPDATE config SET value = true WHERE key = "DB_SEEDED"');
}
```

### Additional Security for Super Admin

- Enforce MFA/2FA (TOTP) for super admin accounts
- Give super admin a separate account/email (e.g., `alice-admin@example.com`)
- Limit super admin count to 1-3 users maximum
- Prevent deletion or modification by other admins

---

## 2. STUDENT AND TEACHER AUTHENTICATION

### Recommended Approach: Token-Based Authentication (JWT) + Verification Tokens

**DO:**

- ✅ Use JWT tokens for student/teacher login and API access
- ✅ Use one-time verification tokens for account activation
- ✅ Combine admin-created accounts with user-set passwords
- ✅ Hash all passwords with bcrypt (never plain text)
- ✅ Set token expiry (JWT: 24h, verification: 48h)
- ✅ Require HTTPS for all authentication endpoints

**DO NOT:**

- ❌ Use JWT alone for account creation (no email verification)
- ❌ Use raw verification tokens for login/session
- ❌ Store plain passwords in database or emails
- ❌ Use localStorage for sensitive token storage (use secure storage)

---

## 3. ACCOUNT CREATION WORKFLOW (Private College/SMS)

### Recommended 3-Step Secure Process

**STEP 1: Registration via Form**

- Student/Teacher submits info (name, email, ID, department, role)
- Data stored in `registration_submissions` table (status: pending)
- Use custom React form (NOT Google Forms for private systems)

**STEP 2: Admin Account Creation**

- Admin reviews submission in admin panel
- Admin clicks "Create Account"
- System creates account with `setPasswordToken` (password: null)
- System sends email with "Set Password" link (48h expiry token)
- Admin verification flag set: `isVerified = true`

**STEP 3: User Sets Password + Logs In**

- User clicks email link → `/set-password?token=xxx`
- User sets their own private password
- System hashes password with bcrypt
- Token deleted after use
- User logs in → receives JWT token → accesses SMS

---

## 4. FORM OPTIONS COMPARISON

| Option                       | Pros                                                                      | Cons                                           | Recommendation               |
| ---------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------- |
| Custom React Form (Your SMS) | Full control, validates email, no 3rd party data leak, integrates with DB | Need to build + host                           | ✅ BEST for private colleges |
| Typeform                     | Beautiful UI, email validation                                            | Paid for advanced features                     | Good for quick setup         |
| Airtable Form                | Free, auto-creates DB, exports to CSV                                     | Less professional UI                           | Good for MVP                 |
| Google Forms                 | Free, easy                                                                | No validation, exposes data, hard to integrate | ❌ AVOID for private systems |

---

## 5. SECURITY CHECKLIST

| Requirement        | Implementation                                                |
| ------------------ | ------------------------------------------------------------- |
| Password Hashing   | bcrypt (12 rounds) — never plain text                         |
| One-Time Token     | Random hex token, 48h expiry, deleted after use               |
| Email Verification | Admin verifies identity manually (no public self-reg)         |
| JWT for Login      | Stateless, 24h expiry + refresh token pattern                 |
| Role-Based Access  | `role: 'student' \| 'teacher' \| 'admin'` in JWT + middleware |
| Audit Trail        | Log `createdBy` (admin ID) for every account                  |
| HTTPS Only         | Never send tokens over non-HTTPS                              |
| Rate Limiting      | Limit login/register to 5 requests/min per IP                 |

---

## 6. TECHNICAL IMPLEMENTATION (TypeScript/Node.js)

### Key API Endpoints

**POST /api/register-submission**

- User submits registration form
- Store in `registration_submissions` (status: pending)

**POST /admin/create-user-from-submission**

- Admin creates account from submission
- Generate `setPasswordToken` (48h expiry)
- Send email with set-password link
- Mark submission as processed

**GET /set-password?token=xxx**

- User sets password on first login
- Validate token + expiry
- Hash password with bcrypt
- Delete token

**POST /login**

- User logs in with email + password
- Validate credentials
- Check `isVerified = true`
- Return JWT token (24h expiry)

---

## 7. WHY THIS APPROACH IS BETTER

### Original Plan (Admin creates with initial password)

- ❌ Plain password in DB/email (security risk)
- ❌ Password exposed in transit
- ❌ User doesn't have private password

### Recommended Plan (Admin creates, user sets password)

- ✅ No plain password in DB/email
- ✅ User sets their own private password
- ✅ Admin still controls who gets accounts
- ✅ Production-ready security (tokens, hashing, JWT)

---

## 8. SUMMARY

| Component             | Recommendation                                                 |
| --------------------- | -------------------------------------------------------------- |
| **Super Admin**       | Use secure seed script with env vars (NOT raw SQL)             |
| **Students/Teachers** | JWT for login + one-time verification token for activation     |
| **Account Creation**  | Custom React form → Admin creates account → User sets password |
| **Security**          | bcrypt hashing, token expiry, HTTPS, rate limiting, audit logs |

---

## How to Convert This to PDF

**Option 1: Browser (Easy)**

1. Copy this entire document
2. Paste into Google Docs or a text editor
3. Save/Export as PDF

**Option 2: VS Code + Markdown PDF**

1. Install "Markdown PDF" extension in VS Code
2. Save this as `SMS_Authentication_Guidelines.md`
3. Right-click → "Markdown PDF: Export (pdf)"

**Option 3: Online Converter**

1. Use https://markdowntopdf.com
2. Paste content → Download PDF

**Option 4: Google Docs**

1. Copy this content
2. Paste into Google Docs
3. File → Download → PDF Document (.pdf)

---

**Document End**
