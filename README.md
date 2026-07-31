# Pepticost Admin

Admin panel for the Pepticost backend — auth + full CRUD for Peptides, Vendors,
Blog, FAQ and Disclaimer pages (the public "user" browsing endpoints from the
Postman collection are intentionally not included here).

**Stack:** React + Vite + TypeScript + Tailwind CSS v4 + Ant Design v5 + Redux
Toolkit / RTK Query.

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL
npm run dev
```

Open http://localhost:5173. You'll land on `/login`; only accounts with role
`ADMIN` or `SUPER_ADMIN` are allowed in (`USER` role logins are rejected in
the UI even if the request succeeds).

## Environment

`.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Point this at wherever your `pepticost-website-backend` is running. Every
request path in the app (`/auth/login`, `/peptides`, `/vendor`, `/blog`,
`/faq`, `/disclaimer`, `/user/profile`, ...) matches the Postman collection
exactly and is appended to this base URL.

## Auth token header

The Postman collection's `login` request sets `role`/`accessToken` from the
response, and other requests attach it via **Bearer auth**. This app follows
that convention and sends:

```
Authorization: Bearer <accessToken>
```

on every authenticated request (see `src/api/baseApi.ts`). If your backend
actually expects the raw token **without** the `Bearer ` prefix (a couple of
requests in the collection have a hardcoded raw-token header instead), just
remove the prefix in that one file.

On any `401` response the app automatically logs the admin out and redirects
to `/login`.

## Password reset flow

The collection reuses `/auth/verify-otp` for both email verification and
password-reset OTP confirmation, and `/auth/reset-password` expects the
token from that response as an `Authorization` header. The `Reset password`
page (`/reset-password`) implements this as two steps:

1. Enter email + one-time code -> calls `verify-otp`, receives a token.
2. Enter new password -> calls `reset-password` with that token attached.

## Project structure

```
src/
  api/baseApi.ts          RTK Query base (auth header, 401 handling)
  app/                     Redux store + typed hooks
  features/<resource>/     RTK Query endpoints per resource
  components/layout/       Admin shell (sidebar + header)
  components/common/       Shared bits (ProtectedRoute, PageHeader)
  pages/<resource>/        One folder per section, list page + form modal
  types/index.ts           Shared TypeScript types
```

## Sections

| Section     | Endpoints covered                                                        |
|-------------|---------------------------------------------------------------------------|
| Auth        | login, forgot-password, verify-otp, reset-password, change-password, get/update profile |
| Peptides    | list, create, update, delete                                              |
| Vendors     | list (search + peptide filter), create, update, delete, CSV bulk upload   |
| Blog        | list, create, update, delete (multipart, image + tags)                    |
| FAQ         | list, create, update, delete                                              |
| Disclaimer  | get/update by type (terms / privacy / about)                              |

## Build

```bash
npm run build
```

Type-checks with `tsc -b` then produces a production build in `dist/` via Vite.
