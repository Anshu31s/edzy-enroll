# Edzy - Frontend Hackathon - Task 2 (Enrollment Multi-Step Form)

A 4-step, multi-page enrollment flow for students in India built using **Next.js App Router + TypeScript**, **react-hook-form + zod**, and **shadcn/ui + TailwindCSS**.

---

## ✅ Tech Stack
- Next.js (App Router) + TypeScript
- react-hook-form + @hookform/resolvers
- zod
- shadcn/ui + Tailwind CSS

---

## ✅ Routes (Multi-Page Flow)
- `/enroll/step-1` → Student Details
- `/enroll/step-2` → Academic Details
- `/enroll/step-3` → Address & Guardian
- `/enroll/review` → Review & Submit (read-only)

Root page redirects to `/enroll/step-1`.

---

## ✅ Features Implemented

### Step 1 — Student Details
Fields:
- Full Name
- Email
- Mobile (+91 UI prefix)
- Class (9, 10, 11, 12)
- Board (CBSE, ICSE, State Board)
- Preferred Language (English, Hindi, Hinglish)

Validation:
- Mobile: `/^[6-9]\d{9}$/`
- Full name: alphabets + spaces, trimmed
- Required fields with proper length constraints

---

### Step 2 — Academic Details
Fields:
- Subjects (multi-select based on class)
- Exam Goal
- Weekly Study Hours (1–40)
- Scholarship toggle
  - Last Exam Percentage (0–100) required only if scholarship = true
  - Achievements (optional)

Validation:
- At least 2 subjects for class 9–10
- At least 3 subjects for class 11–12
- Conditional validation using `zod.superRefine`

---

### Step 3 — Address & Guardian
Fields:
- PIN Code (6 digits)
- State / UT
- City
- Address Line (10–120 chars)
- Guardian Name
- Guardian Mobile
- Preferred Payment Plan
- Payment Mode Preference

Validation:
- PIN: `/^\d{6}$/`
- Guardian mobile: `/^[6-9]\d{9}$/`

---

### Step 4 — Review & Submit
- Read-only summary of all inputs from Steps 1–3
- “Edit” buttons route back to corresponding steps
- Submit triggers final merged validation across all schemas
- Submission is simulated with a 1 second delay
- Success message shown after submit
- Payload logged to console + shown as collapsible JSON

---

## ✅ Form State Persistence
Form data is persisted across routes using:
- React Context at `/app/enroll/layout.tsx`
- Draft is autosaved to **localStorage** every **2 seconds (debounced)**

LocalStorage Key:
- `edzy_enroll_draft_v1`

---

## ✅ Route Guards (Prevent Step Skipping)
- Step 2 requires Step 1 completion
- Step 3 requires Step 1 + Step 2 completion
- Review requires Step 1 + Step 2 + Step 3 completion

If a user opens a later step directly, they are redirected to the correct step.

---

## ✅ Bonus Features Implemented
- Autosave drafts to localStorage every 2 seconds (debounced)
- PIN Auto-Fill (mock): autofill City/State from small client-side map
- Subject Catalog by Class (dynamic list changes with selected class)
- Zod `superRefine` cross-field rule:
  - Class 12 + Competitive Prep → enforce ≥ 3 subjects

---

## 📁 Folder Structure
app/
  page.tsx
  enroll/
    layout.tsx
    step-1/
      page.tsx
    step-2/
      page.tsx
    step-3/
      page.tsx
    review/
      page.tsx

components/
  enroll/
    ProgressHeader.tsx
    SubjectMultiSelect.tsx
  form/
    FormSection.tsx
    RHFTextField.tsx
    RHFSelect.tsx

lib/
  enrollment-store.tsx
  subject-catalog.ts
  pin-map.ts

schemas/
  step1.schema.ts
  step2.schema.ts
  step3.schema.ts
  enrollment.schema.ts


---

## ✅ Setup Instructions
```bash
npm install
npm run dev
