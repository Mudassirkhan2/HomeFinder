# HomeFinder — Project Guide for Claude

## Project Overview

HomeFinder is a property listing web app targeting the **Indian real estate market** (currency: ₹). Users can list, browse, search, and save properties for rent or sale. Inspired by Airbnb and MagicBricks.

**Stack:** React 18 · Vite · Firebase 9 (Auth / Firestore / Storage) · Tailwind CSS 3 · Framer Motion · Swiper · React Router DOM 6

**Project root:** `HomeFinder/` (Vite project)  
**Entry:** `src/main.jsx` → `src/App.jsx`

---

## File Structure

```
src/
  pages/          # Full route pages (one file per route)
  components/     # Reusable UI components
  hooks/          # Custom hooks (prefixed with `use`)
  utils/          # Pure helper functions (no React)
  assets/         # Static images / SVGs
  firebase.js     # Firebase app + db + auth exports
  index.css       # Global styles + Tailwind directives
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component files | PascalCase | `ListingItem.jsx` |
| Hook files | camelCase | `useAuthStatus.jsx` |
| Util files | camelCase | `geocode.js` |
| Route paths | kebab-case | `/create-listing` |
| Firestore fields | camelCase | `regularprice`, `imgUrls` |
| CSS classes | Tailwind utility tokens only | see DLS section |

---

## Design Language System (DLS)

The palette is defined as semantic tokens in `tailwind.config.js`. **Never use hardcoded hex colors or Tailwind palette shades directly in components.** Use the semantic tokens below.

> **Design source:** Synced from FLN Design System (`claude.ai/design/p/4fb260ae-0e31-45d8-af52-4adff0067449`). Primary = indigo, accent = orange, font = Plus Jakarta Sans.

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

- **Body font:** Plus Jakarta Sans (system-ui fallback) — from FLN design system, applied via `font-sans` in Tailwind config
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

## Firebase Patterns

- **Always** use `serverTimestamp()` for `timeStamp` / `createdAt` fields.
- **Always** set `userRef: auth.currentUser.uid` on user-owned documents.
- Images: max **6 images**, max **2 MB each**. Upload to `images/` in Firebase Storage with filename `${uid}-${imageName}-${uuidv4()}`.
- Firestore reads: prefer `getDocs` for lists, `getDoc` for single docs.
- Firestore writes: use `addDoc` (auto-ID) for new docs, `setDoc` with merge for upserts, `updateDoc` for partial updates.
- Subcollections pattern: `users/{uid}/savedListings/{listingId}`, `listings/{id}/reviews/{uid}`.
- Do not use `onSnapshot` (real-time listeners) unless the feature genuinely needs live updates — prefer one-shot `getDocs`.

### Listing Document Shape

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
  imgUrls: string[],
  userRef: string,       // uid
  timeStamp: Timestamp,
  avgRating: number,     // denormalized, updated on review write
  reviewCount: number,   // denormalized
}
```

---

## Component Conventions

- **No prop drilling beyond 2 levels.** Lift state or use a hook.
- `useAuthStatus` hook (`src/hooks/useAuthStatus.jsx`) returns `{ loggedIn, checkingStatus }` — use it to gate auth-only UI.
- `useSavedListings` hook (`src/hooks/useSavedListings.jsx`) returns `{ savedIds, toggleSave, loading }`.
- Wrap page-level sections in `<motion.div>` from Framer Motion for entrance animations. Standard pattern:
  ```jsx
  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
  ```
- Show `<Spinner />` while async data is loading.
- Show `<toast.error()>` / `<toast.success()>` for user feedback — never `alert()`.
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
- **No `limit(4)` without a "Load More" button** — paginate with `startAfter`
- **No Google Maps** — use Leaflet + OpenStreetMap (free, no billing)
- **No mocking Firebase** in tests — use the real Firestore emulator

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
| `react-leaflet` + `leaflet` | Map on listing detail | Geocode via Nominatim (free) |
| `swiper` | Image carousels | Use `SwiperCore.use([Autoplay, Navigation, Pagination])` |
| `framer-motion` | Animations | Page entrances, list items |
| `react-toastify` | Notifications | Theme: dark, position: bottom-center |
| `react-moment` | Date formatting | Use `<Moment fromNow>` for relative times |
| `uuid` | Unique filenames for storage | `v4 as uuidv4` |
