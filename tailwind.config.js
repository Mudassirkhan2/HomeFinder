/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        // FLN design system primary font
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // Legacy brand fonts kept for existing uses
        RampartOne: ['Rampart One', 'cursive'],
        BarlowCondensed: ['Barlow Condensed', 'sans-serif'],
        Bellefair: ['Bellefair', 'serif'],
        Barlow: ['Barlow', 'sans-serif'],
      },
      colors: {
        // ── Semantic DLS tokens (FLN design system) ──────────────
        // Use these in components — never raw hex or Tailwind shades
        primary: {
          DEFAULT: '#4f46e5',   // indigo-600  (FLN btn-primary)
          hover:   '#4338ca',   // indigo-700
          light:   '#eef2ff',   // indigo-50
          ring:    'rgba(79,70,229,0.18)',
        },
        accent: {
          DEFAULT: '#f97316',   // orange-500  (FLN btn-accent)
          hover:   '#ea580c',   // orange-600
          light:   '#fff7ed',   // orange-50
        },
        surface: {
          DEFAULT:   '#ffffff',  // white
          secondary: '#f8fafc',  // slate-50
          border:    '#d8dbe7',  // FLN border colour
        },
        content: {
          primary:   '#0f172a',  // slate-900   (FLN body colour)
          secondary: '#64748b',  // slate-500
          muted:     '#a6abc1',  // FLN placeholder colour
        },
        dark: {
          bg:      '#0f172a',   // slate-900
          surface: '#1e293b',   // slate-800
          border:  '#334155',   // slate-700
          accent:  '#818cf8',   // indigo-400 (dark-mode primary)
        },
      },
      borderRadius: {
        // FLN uses .75rem (12 px) on buttons and inputs
        DEFAULT: '0.75rem',
      },
      boxShadow: {
        // FLN btn-primary shadow
        'btn': '0 1px 2px rgba(15,18,34,.08), inset 0 -1px 0 rgba(0,0,0,.15)',
        'btn-hover': '0 8px 20px -8px rgba(79,70,229,.55), inset 0 -1px 0 rgba(0,0,0,.15)',
        // FLN card lift
        'lift': '0 18px 40px -18px rgba(15,18,34,.18), 0 6px 14px -8px rgba(15,18,34,.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
