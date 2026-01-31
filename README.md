# Spotter Frontend

React + TypeScript frontend for the Spotter ELD Trip Planner application. A modern, responsive web application for planning HOS-compliant truck routes.

## 🚛 Features

- **Trip Planning Form** - Simple 4-field input for trip details
- **Interactive Route Map** - Leaflet.js map with route visualization and stop markers
- **Planned Stops List** - Timeline view of all stops organized by day
- **ELD Log Sheets** - Visual SVG-based daily log sheets with continuous duty status line
- **Trip Summary** - Distance, duration, stops, and cycle hours overview

## 🎨 Screenshots

The application features a modern dark theme inspired by Spotter.ai with:
- Dark teal color scheme
- Animated logo with red dots
- Interactive map with teal route line
- Color-coded ELD log graphs

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Leaflet.js + React-Leaflet
- Axios
- Lucide React (icons)

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/syedmustafan/spotter-frontend.git
cd spotter-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

The frontend proxies API requests to the backend. Configure the proxy in `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

For production, set the `VITE_API_URL` environment variable.

## 📁 Project Structure

```
spotter-frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── public/
│   └── spotter-icon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts
    └── components/
        ├── TripForm.tsx      # Trip input form
        ├── RouteMap.tsx      # Leaflet map component
        ├── StopsList.tsx     # Stops timeline
        ├── TripSummary.tsx   # Trip statistics
        └── LogSheet.tsx      # SVG ELD log sheet
```

## 🎯 Usage

1. Enter your **Current Location** (where you are now)
2. Enter the **Pickup Location** (where to get the load)
3. Enter the **Dropoff Location** (final destination)
4. Enter **Current Cycle Hours Used** (0-70 hours already worked)
5. Click **Plan Trip**

The system will calculate an HOS-compliant route with:
- Required 30-minute breaks (after 8 hours driving)
- Required 10-hour rest stops (after 11 hours driving)
- Fuel stops (every 1,000 miles)
- Pickup and dropoff time allowances

## 📊 ELD Log Sheet

The ELD log sheet displays:
- **24-hour grid** with 15-minute increments
- **Continuous duty status line** showing:
  - 🟢 Off Duty (green)
  - 🟡 Sleeper Berth (yellow)
  - 🔵 Driving (teal)
  - 🔴 On Duty Not Driving (red)
- **Hourly totals** that sum to exactly 24 hours
- **Remarks** with location and activity notes

## 🗺️ Map Markers

| Marker | Meaning |
|--------|---------|
| 🟢 | Start point |
| 📦 | Pickup location |
| 🏁 | Dropoff location |
| ⛽ | Fuel stop |
| ☕ | 30-minute break |
| 🛏️ | 10-hour rest stop |

## 📄 License

MIT License

## 🔗 Related

- [Spotter Backend](https://github.com/syedmustafan/spotter-backend) - Django REST API backend
