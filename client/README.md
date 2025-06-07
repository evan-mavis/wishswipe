### Folder Structure

/client
│
├── /public # Static assets (favicon, images, robots.txt, etc.)
│
├── /src
│ ├── /api # API calls (e.g., axios requests to your backend, eBay API)
│ ├── /components # Reusable UI components (buttons, cards, modals)
│ ├── /pages # Page-level components (e.g., Home, Login, Wishlist)
│ ├── /hooks # Custom React hooks (e.g., useAuth, useFetch)
│ ├── /contexts # React context providers (e.g., AuthContext)
│ ├── /styles # Global styles, CSS/SCSS files or styled components setup
│ ├── /utils # Helper functions/utilities
│ ├── /types # TypeScript type declarations
│ ├── /assets # Images, icons, fonts (can also go inside public)
│ ├── App.tsx # Main App component
│ ├── main.tsx # ReactDOM render & app entry point
│ └── vite-env.d.ts # Vite-specific TypeScript declarations
│
├── index.html # Vite HTML template
├── tsconfig.json # TypeScript config
├── vite.config.ts # Vite config
├── package.json
└── README.md
