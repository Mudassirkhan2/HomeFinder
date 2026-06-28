# HomeFinder — Project Guide for Claude

## Project Overview

HomeFinder is a property listing web app targeting the **Indian real estate market** (currency: ₹). Users can list, browse, search, and save properties for rent or sale. Inspired by Airbnb and MagicBricks.

**Frontend stack:** React 18 · Vite · Tailwind CSS 3 · Framer Motion · Swiper · React Router DOM 6 · axios  
**Backend stack:** Node.js · Express 5 · MongoDB (Mongoose 8) · Cloudinary (images) · JWT (httpOnly cookies)

**Frontend root:** `HomeFinder/` (Vite project) — entry: `src/main.jsx` → `src/App.jsx`  
**Backend root:** `homefinder-api/` — entry: `src/index.js`, runs on port 5000

---

## File Structure

```
HomeFinder/src/
  pages/            # Full route pages (one file per route)
  components/       # Reusable UI components
  hooks/            # Custom hooks (prefixed with `use`)
  utils/            # Pure helper functions (no React)
  context/          # React context providers
  assets/           # Static images / SVGs
  index.css         # Global styles + Tailwind directives

homefinder-api/src/
  models/           # Mongoose models (User, Listing, Review, SavedListing)
  routes/           # Express routers (auth, listings, reviews, saved)
  middleware/       # auth.js (JWT protect), upload.js (Multer + Cloudinary)
  utils/            # cloudinary.js config
  index.js          # App entry — connects MongoDB, starts server
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component files | PascalCase | `ListingItem.jsx` |
| Hook files | camelCase | `useAuthStatus.jsx` |
| Util files | camelCase | `geocode.js` |
| Route paths | kebab-case | `/create-listing` |
| MongoDB fields | camelCase | `regularprice`, `imgUrls` |
| CSS classes | Tailwind utility tokens only | see DLS section |

---

## Design Language System (DLS)

The palette is defined as semantic tokens in `tailwind.config.js`. **Never use hardcoded hex colors or Tailwind palette shades directly in components.** Use the semantic tokens below.

> **Design source:** Synced from FLN Design System. Primary = indigo, accent = orange, font = Plus Jakarta Sans.

### Color Tokens

| Token | Light mode | Dark mode |
|-------|-----------|-----------|
| `bg-surface` | white | — |
| `bg-surface-secondary` | slate-50 | `dark:bg-dark-bg` (slate-900) |
| `bg-dark-surface` | — | slate-800 |
| `border-surface-border` | `#d8dbe7` | `dark:border-dark-border` (slate-700) |
| `text-content-primary` | `#0f172a` (slate-900) | white |
| `text-content-secondary` | slate-500 | slate-400 |
| `text-content-muted` | `#a6abc1` | slate-500 |
| `bg-primary` / `text-primary` | `#4f46e5` (indigo-600) | `#818cf8` (indigo-400) |
| `hover:bg-primary-hover` | `#4338ca` (indigo-700) | — |
| `bg-primary-light` | `#eef2ff` (indigo-50) | — |
| `bg-accent` / `text-accent` | `#f97316` (orange-500) | — |
| `hover:bg-accent-hover` | `#ea580c` (orange-600) | — |

### Typography

- **Body font:** Plus Jakarta Sans (system-ui fallback) — applied via `font-sans` in Tailwind config
- **Logo font:** `font-RampartOne`
- **Condensed headings:** `font-BarlowCondensed`
- **Price display:** `font-Bellefair`

### Button Variants

```jsx
// Primary
<button className="bg-primary hover:bg-primary-hover text-white rounded-lg px-6 py-3 font-semibold shadow-sm transition duration-150">

// Secondary
<button className="border border-surface-border text-content-primary hover:bg-surface-secondary rounded-lg px-6 py-3 font-semibold transition duration-150">

// Ghost / Destructive (e.g. delete)
<button className="text-red-500 hover:text-red-700 transition duration-150">
```

### Input Variant

```jsx
<input className="w-full border border-surface-border rounded-lg px-4 py-2 text-content-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:border-dark-border dark:text-white" />
```

---

## API Patterns

All frontend API calls go through `src/utils/api.js` (axios instance with `baseURL: VITE_API_URL` and `withCredentials: true`).

Auth state lives in `src/context/AuthContext.jsx`. Use `useAuth()` to access `{ user, checkingStatus, login, register, logout, updateProfile, updatePassword }`.

### Listing Document Shape (MongoDB)

```js
{
  type: 'rent' | 'sale',
  propertyType: 'house' | 'apartment' | 'villa' | 'plot' | 'pg',
  name: string,          // 10–32 chars
  bedrooms: number,
  bathrooms: number,
  area: number,          // sqft, min 100
  parking: boolean,
  furnished: boolean,
  address: string,
  description: string,
  phone: string,         // 10-digit Indian mobile (for WhatsApp)
  offer: boolean,
  regularprice: number,  // in ₹
  discountedprice: number | undefined,
  imgUrls: string[],     // Cloudinary URLs
  owner: ObjectId,       // ref User
  avgRating: number,     // denormalized, updated on review write
  reviewCount: number,   // denormalized
}
```

### Pagination Pattern

All list endpoints use cursor-based pagination with MongoDB `_id`:
- Request: `?limit=8&cursor=<lastId>`
- Response: `{ listings, hasMore, nextCursor }`
- Frontend: fetch `limit + 1`, pop last, set `hasMore` and `nextCursor`

### Image Uploads

Use `FormData` with `Content-Type: multipart/form-data`. Max 6 images, 2MB each. Cloudinary handles storage and auto-resize.

---

## Component Conventions

- **No prop drilling beyond 2 levels.** Lift state or use a hook.
- `useAuth()` from `src/context/AuthContext.jsx` — auth state for all components.
- `useAuthStatus` hook (`src/hooks/useAuthStatus.jsx`) returns `{ loggedIn, checkingStatus }` — use it to gate auth-only UI.
- `useSavedListings` hook (`src/hooks/useSavedListings.jsx`) returns `{ savedIds, toggleSave }`.
- Wrap page-level sections in `<motion.div>` from Framer Motion for entrance animations. Standard pattern:
  ```jsx
  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
  ```
- Show `<Spinner />` while async data is loading.
- Show `toast.error()` / `toast.success()` for user feedback — never `alert()`.
- Protected routes use `<PrivateRoute />` wrapping pattern in `App.jsx`.

---

## Route Map

| Path | Component | Auth required |
|------|-----------|---------------|
| `/` | `Home` | No |
| `/sign-in` | `SignIn` | No |
| `/sign-up` | `SignUP` | No |
| `/forgot-password` | `ForgotPassword` | No |
| `/offers` | `Offers` | No |
| `/category/:categoryName` | `Category` | No |
| `/category/:categoryName/:listingId` | `Listing` | No |
| `/search` | `Search` | No |
| `/profile` | `Profile` | Yes |
| `/create-listing` | `CreateListing` | Yes |
| `/edit-listing/:listingId` | `EditListing` | Yes |
| `/saved` | `Saved` | Yes |

---

## Do-Not-Do List

- **No hardcoded hex colors** in JSX — use Tailwind semantic tokens from `tailwind.config.js`
- **No inline `style={{}}` props** for colors/spacing — use Tailwind classes
- **No `window.alert()`** — use `react-toastify` toasts
- **No `console.log()` left in committed code**
- **No Firebase** — the project has fully migrated to Node.js + MongoDB + Cloudinary
- **No Google Maps** — use Leaflet + OpenStreetMap (free, no billing)
- **No skip/limit pagination** — use cursor-based pagination (`_id` as cursor) throughout

---

## Git Conventions

- **Do NOT commit without the user explicitly asking.** Always wait for "commit this" or similar instruction.
- **Do NOT push without the user explicitly asking.** Always wait for "push this" or similar instruction.
- **Never include a `Co-Authored-By: Claude` line** in any commit message — not when committing, not when suggesting commit messages, never.
- Branch naming: `feature/<short-description>`, `fix/<short-description>`
- Commit message format: `feat: add search page`, `fix: correct EMI formula`, `style: apply DLS tokens to Navbar`

---

## Third-Party Libraries

| Library | Purpose | Notes |
|---------|---------|-------|
| `axios` | API calls | Use instance from `src/utils/api.js` with `withCredentials: true` |
| `react-leaflet` + `leaflet` | Map on listing detail | Geocode via Nominatim (free) |
| `swiper` | Image carousels | v9 — no `SwiperCore.use()`, no `navigation` prop |
| `framer-motion` | Animations | Page entrances, list items |
| `react-toastify` | Notifications | Theme: dark, position: bottom-center |
| `react-intersection-observer` | Infinite scroll / lazy load | Used in Home.jsx |
