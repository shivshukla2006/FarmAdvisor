

# Plan: Email OTP Authentication

## What changes

Add email-based OTP verification for both signup and login flows using Lovable Cloud's built-in auth (Supabase `signInWithOtp`).

## How it works

### 1. Enable auto-confirm for email signups
- Configure auth to auto-confirm emails since OTP replaces the email verification link flow.

### 2. New component: `OtpVerification.tsx`
- A reusable OTP input screen using the existing `InputOTP` component (already installed).
- Accepts email and mode (`signup` | `login`) as props.
- Calls `supabase.auth.verifyOtp({ email, token, type: 'email' })` on submission.
- Shows a resend button with cooldown timer.

### 3. Update `RegisterForm.tsx`
- After successful `signUp()`, instead of switching to login tab, transition to the OTP verification screen.
- Pass email to `OtpVerification` component.

### 4. Update `LoginForm.tsx`
- Add a "Sign in with OTP" toggle/link below the password login form.
- When toggled, show an email-only form that calls `supabase.auth.signInWithOtp({ email })`.
- On submit, transition to the `OtpVerification` screen.

### 5. Update `AuthContext.tsx`
- Add `signInWithOtp(email)` and `verifyOtp(email, token, type)` methods to the auth context.

### 6. Update `Auth.tsx`
- Manage OTP verification state to show the OTP screen when needed (after signup or OTP login request).

## File changes

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | Add `signInWithOtp` and `verifyOtp` methods |
| `src/components/auth/OtpVerification.tsx` | New component with 6-digit OTP input, verify, and resend |
| `src/components/auth/LoginForm.tsx` | Add "Sign in with OTP" option that sends OTP email |
| `src/components/auth/RegisterForm.tsx` | After signup, trigger OTP verification flow |
| `src/pages/Auth.tsx` | Manage OTP state, show OTP screen when active |

## Technical details

- Uses `supabase.auth.signInWithOtp({ email })` to send the OTP code.
- Uses `supabase.auth.verifyOtp({ email, token, type: 'email' })` to verify.
- The `InputOTP` component from `input-otp` is already installed and ready to use.
- No database changes or edge functions needed — this is handled entirely by the auth system.

