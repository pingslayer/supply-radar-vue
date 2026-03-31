# 📡 Supply Radar

**Supply Radar** is a sophisticated, real-time supply chain monitoring and risk alerting dashboard. It empowers companies to track global disruptions—such as extreme weather, strikes, and port closures—and automatically evaluates how these events impact their specific warehouses, factories, and logic hubs.

---

## ✨ Features

- **📊 Management Dashboard:** High-level overview of active risk alerts and tracked supply chain locations.
- **🛰️ Global Disruption Feed:** A paginated, real-time feed of all major global disruptions, categorized by severity and type.
- **📍 Supply Chain Management:** Full CRUD (Create, Read, Update, Delete) for tracking company-specific locations with precise geospatial coordinates.
- **⚠️ Risk Alerting System:** Automated alerts for events explicitly impacting your assets, featuring color-coded risk scores (0-100).
- **🔐 Secure Authentication:** Robust login and registration flows powered by Laravel Sanctum.
- **🌗 Modern Design Language:** A premium dark-mode interface utilizing glassmorphism, responsive layouts, and smooth transitions.

---

## 🛠️ Technology Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Styling:** [Bootstrap 5](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/) (with persistent storage)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **API Client:** [Axios](https://axios-http.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd supply-radar-vue

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and configure your backend API URL:
```env
VITE_API_BASE_URL=http://supplyradar.local/api
```

### 4. Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🏗️ Production & Deployment

### Build for Production
```bash
npm run build
```

### AWS Amplify Deployment
This project includes a pre-configured `amplify.yml` for seamless deployment to AWS Amplify. During hosting setup, ensure you define the `VITE_API_BASE_URL` in the Amplify Console's environment variables.

---

## 📂 Project Structure

- `src/lib/api.js` - Axios instance with Sanctum interceptors.
- `src/stores/auth.js` - Pinia store for manages user state and tokens.
- `src/views/layouts/` - Persistent layouts (protected vs public).
- `src/views/dashboard/` - Main analytical overview.
- `src/views/locations/` - Supply chain asset management.
- `src/views/alerts/` - Targeted risk alerting feed.

---

## 📄 License
This project is licensed under the MIT License.
