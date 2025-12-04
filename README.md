# 🌍 Countries Search

A modern web application to explore detailed information about countries from around the world. Built with Vue 3, TypeScript, and frontend development best practices.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=flat&logo=vitest&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Description

Interactive application that allows you to explore information about more than 250 countries worldwide. Features advanced search, favorites system, country comparison, global statistics with interactive charts, and support for multiple languages with dark mode.

**Key Features:**
- 🔍 Advanced search and filters (name, capital, region, language, currency)
- ⭐ Favorites system with local persistence
- 🔄 Compare up to 4 countries simultaneously
- 📊 Global statistics with visualizations
- 🌓 Dark mode with persistence
- 🌐 Multi-language support (Spanish/English)
- 📱 Responsive design
- ✅ 170 unit and integration tests

## 🛠 Technologies Used

### Core
- **Vue 3** - Progressive framework with Composition API
- **TypeScript** - Static typing for JavaScript
- **Vite** - Ultra-fast build tool
- **Pinia** - Official Vue state management
- **Vue Router** - Routing system

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Modern icons
- **Chart.js** - Interactive charts

### Testing & Quality
- **Vitest** - Testing framework
- **Vue Test Utils** - Vue component testing
- **Happy DOM** - DOM environment for tests

### Others
- **Vue I18n** - Internationalization
- **Axios** - HTTP client
- **REST Countries API** - Public data API

## 📁 Project Structure

```
countries-search/
├── src/
│   ├── core/                      # Global configuration and types
│   │   ├── config/                # Centralized configuration
│   │   ├── constants/             # Constants (API, routes)
│   │   └── types/                 # TypeScript types
│   │
│   ├── shared/                    # Shared code
│   │   ├── components/            # Reusable components
│   │   │   ├── ui/                # Base components (Button, Input, Badge, Card)
│   │   │   └── ...                # ErrorBoundary, Toast, LoadingSpinner
│   │   ├── composables/           # Reusable hooks
│   │   │   ├── useLocalStorage.ts # Reactive LocalStorage
│   │   │   └── useErrorHandler.ts # Error handling
│   │   └── services/              # Global services
│   │       ├── api.service.ts     # REST Countries API
│   │       ├── http-client.ts     # HTTP client with cache/retry
│   │       ├── notifications.service.ts
│   │       └── theme.service.ts
│   │
│   ├── features/                  # Feature modules
│   │   ├── countries/             # Dashboard and country details
│   │   ├── favorites/             # Favorites system
│   │   ├── comparison/            # Country comparison
│   │   └── statistics/            # Statistics and charts
│   │
│   ├── layouts/                   # Layouts (Navbar)
│   ├── i18n/                      # Translations (es, en)
│   ├── router/                    # Route configuration
│   ├── tests/                     # Test setup
│   ├── App.vue
│   └── main.ts
│
├── vitest.config.ts               # Vitest configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🚀 How to Clone and Run

### Prerequisites
- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/countries-search.git
cd countries-search

# 2. Install dependencies
pnpm install
# or with npm
npm install

# 3. Start development server
pnpm dev
# or with npm
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Available Scripts

```bash
# Development
pnpm dev              # Development server

# Build
pnpm build            # Production build
pnpm preview          # Preview build

# Testing
pnpm test             # Tests in watch mode
pnpm test:run         # Run all tests
pnpm test:ui          # Vitest UI interface
pnpm test:coverage    # Coverage report
```

---

<div align="center">
  <p>Made with ❤️ using Vue 3, TypeScript and Vite</p>
  <p><strong>⭐ If you found this project useful or interesting, give it a star on GitHub! ⭐</strong></p>
</div>
