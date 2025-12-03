# 🌍 Countries Search

Una aplicación web moderna para explorar información detallada sobre países de todo el mundo. Construida con Vue 3, TypeScript y las mejores prácticas de desarrollo frontend.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=flat&logo=vitest&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Descripción

Aplicación interactiva que permite explorar información de más de 250 países del mundo. Incluye búsqueda avanzada, sistema de favoritos, comparación de países, estadísticas globales con gráficos interactivos, y soporte para múltiples idiomas con modo oscuro.

**Características principales:**
- 🔍 Búsqueda y filtros avanzados (nombre, capital, región, idioma, moneda)
- ⭐ Sistema de favoritos con persistencia local
- 🔄 Comparación de hasta 4 países simultáneamente
- 📊 Estadísticas globales con visualizaciones
- 🌓 Dark mode con persistencia
- 🌐 Multiidioma (Español/Inglés)
- 📱 Diseño responsive
- ✅ 170 tests unitarios y de integración

## 🛠 Tecnologías Usadas

### Core
- **Vue 3** - Framework progresivo con Composition API
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Build tool ultrarrápido
- **Pinia** - State management oficial de Vue
- **Vue Router** - Sistema de enrutamiento

### UI & Styling
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide Icons** - Iconos modernos
- **Chart.js** - Gráficos interactivos

### Testing & Quality
- **Vitest** - Framework de testing
- **Vue Test Utils** - Testing de componentes Vue
- **Happy DOM** - Entorno DOM para tests

### Otros
- **Vue I18n** - Internacionalización
- **Axios** - Cliente HTTP
- **REST Countries API** - API pública de datos

## 📁 Estructura del Proyecto

```
countries-search/
├── src/
│   ├── core/                      # Configuración y tipos globales
│   │   ├── config/                # Configuración centralizada
│   │   ├── constants/             # Constantes (API, rutas)
│   │   └── types/                 # Tipos TypeScript
│   │
│   ├── shared/                    # Código compartido
│   │   ├── components/            # Componentes reutilizables
│   │   │   ├── ui/                # Base components (Button, Input, Badge, Card)
│   │   │   └── ...                # ErrorBoundary, Toast, LoadingSpinner
│   │   ├── composables/           # Hooks reutilizables
│   │   │   ├── useLocalStorage.ts # LocalStorage reactivo
│   │   │   └── useErrorHandler.ts # Manejo de errores
│   │   └── services/              # Servicios globales
│   │       ├── api.service.ts     # API REST Countries
│   │       ├── http-client.ts     # Cliente HTTP con cache/retry
│   │       ├── notifications.service.ts
│   │       └── theme.service.ts
│   │
│   ├── features/                  # Módulos por funcionalidad
│   │   ├── countries/             # Dashboard y detalle de países
│   │   ├── favorites/             # Sistema de favoritos
│   │   ├── comparison/            # Comparación de países
│   │   └── statistics/            # Estadísticas y gráficos
│   │
│   ├── layouts/                   # Layouts (Navbar)
│   ├── i18n/                      # Traducciones (es, en)
│   ├── router/                    # Configuración de rutas
│   ├── tests/                     # Setup de tests
│   ├── App.vue
│   └── main.ts
│
├── vitest.config.ts               # Configuración de Vitest
├── vite.config.ts                 # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind
└── tsconfig.json                  # Configuración de TypeScript
```

## 🚀 Cómo Clonar y Ejecutar

### Prerrequisitos
- Node.js >= 18.0.0
- pnpm (recomendado) o npm

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/countries-search.git
cd countries-search

# 2. Instalar dependencias
pnpm install
# o con npm
npm install

# 3. Iniciar servidor de desarrollo
pnpm dev
# o con npm
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo

# Build
pnpm build            # Build para producción
pnpm preview          # Preview del build

# Testing
pnpm test             # Tests en modo watch
pnpm test:run         # Ejecutar todos los tests
pnpm test:ui          # Interfaz UI de Vitest
pnpm test:coverage    # Reporte de cobertura
```

---

<div align="center">
  <p>Hecho con ❤️ usando Vue 3, TypeScript y Vite</p>
  <p><strong>⭐ Si este proyecto te resultó útil o interesante, ¡regálale una estrella en GitHub! ⭐</strong></p>
</div>
