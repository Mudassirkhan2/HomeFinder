
<h1 align="center">HomeFinder</h1>
<h4 align="center">A property listing platform for the Indian real estate market — rent, sell, and discover homes.</h4>

---

## About HomeFinder

HomeFinder is a full-stack property marketplace targeting the Indian real estate market (prices in ₹). Property owners can list homes for rent or sale with detailed information, high-resolution images, and location maps. Buyers and renters can browse, search, filter, and save listings they're interested in.

---

## Features

- **Browse & Search** — Filter listings by type (rent/sale), property category, price range, and more
- **Listing Detail** — Image carousel, interactive Leaflet map, amenities breakdown, and WhatsApp contact
- **Create & Edit Listings** — Multi-image upload (up to 6), full property details, offer pricing
- **Saved Listings** — Bookmark properties and view them on a dedicated page
- **Reviews & Ratings** — Leave reviews on listings; average rating is shown on the listing card
- **User Profiles** — Edit name, email, and password; view and manage your own listings
- **Dark Mode** — Full dark theme support via Tailwind CSS
- **Infinite Scroll** — Listings load progressively as you scroll
- **Skeleton Loaders** — Smooth loading states across all pages
- **Forgot Password** — Reset password via email link
- **Responsive Design** — Works across mobile, tablet, and desktop

---

## Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS 3 | Styling with custom design tokens |
| Framer Motion | Page and list animations |
| Swiper.js | Image carousels |
| React Router DOM 6 | Client-side routing |
| React Leaflet + Leaflet | Interactive maps (OpenStreetMap, no billing) |
| Axios | API calls via shared instance |
| React Toastify | Toast notifications |
| React Intersection Observer | Infinite scroll / lazy loading |

### Backend
| Library | Purpose |
|---------|---------|
| Node.js + Express 5 | REST API server (port 5000) |
| MongoDB + Mongoose 8 | Database and ODM |
| Cloudinary | Image storage and auto-resize |
| JWT (httpOnly cookies) | Authentication |
| Multer | Multipart file upload handling |

---

## Run Locally

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account

### Frontend

```bash
git clone https://github.com/Mudassirkhan2/HomeFinder.git
cd HomeFinder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend

```bash
cd homefinder-api
npm install
npm run dev
```

The API runs on [http://localhost:5000](http://localhost:5000).

### Environment Variables

Create a `.env` file in `homefinder-api/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in `HomeFinder/`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Links

- Live Site: [home-finder-khan.vercel.app](https://home-finder-khan.vercel.app/)

---

## Issues & Suggestions

Feel free to open an issue on this repo or reach out via LinkedIn DM with feedback or suggestions.
