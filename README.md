# ❄️ Antarctic Digital Twin & Station Simulation Platform
### Ministry of Earth Sciences (MoES) & NCPOR • Problem Statement: 26060

Comprehensive, high-fidelity **Digital Twin & Mission Operations Platform** for India's Antarctic Research Stations: **Maitri** (Est. 1988) and **Bharati** (Est. 2012).

---

## 🌟 Key Features

- **Interactive 3D Digital Twin**: Real-time 3D interactive station visualization (React Three Fiber / Three.js).
- **Live Real Satellite Weather**: Real Open-Meteo Antarctic weather feeds + automated fallbacks.
- **Smart Microgrid & Energy Simulation**: Hybrid power grid (generators, solar PV, wind turbines, battery storage, and CHP co-generation).
- **Edge Gateway & Offline Sync**: Store-and-forward satellite uplink degradation simulator (VSAT, low bandwidth, compression ratio).
- **Automated Incident Response & Audio Alarms**: Automated load shedding, priority life-support preservation, and voice alert system.
- **AI Mission Copilot**: LLaMA & Gemini-powered Antarctic operations assistant and "What-If" scenario simulator.
- **MongoDB Atlas Persistence**: Cloud telemetry persistence with instant in-memory fallback.

---

## 🚀 Quick Start

### 1. Install Dependencies & Start Local Dev
```bash
# Install root, client, and server dependencies
npm install

# Start both backend and frontend concurrently
npm run dev
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Endpoint**: [http://localhost:5000/health](http://localhost:5000/health)

---

## ☁️ Deployment

### Deploy to Vercel (Frontend)
This repository includes a root `vercel.json` and automated build pipeline:
1. Import this repository into [Vercel](https://vercel.com).
2. Keep default settings (`Framework: Vite`, `Output Directory: client/dist`).
3. Click **Deploy**.

### Deploy to Render / Railway (Backend)
1. Deploy the `server` directory as a Node.js Web Service on [Render](https://render.com) using the included `render.yaml` or `Dockerfile`.
2. Set Environment Variables on Render:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
3. Add the Render URL to your Vercel Project Settings:
   - `VITE_API_URL`
   - `VITE_SOCKET_URL`
