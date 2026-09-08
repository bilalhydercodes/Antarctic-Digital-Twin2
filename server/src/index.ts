import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { initDatabase } from './models/Database.js';
import { seedInitialStationData } from './simulation/seedData.js';
import { SensorHealthService } from './services/SensorHealthService.js';
import { EdgeGatewayService } from './services/EdgeGatewayService.js';
import { MaintenanceService } from './services/MaintenanceService.js';
import { simulationEngine } from './simulation/SimulationEngine.js';
import { setupSocketIO } from './sockets/socketHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Antarctic Mission Operations & Digital Twin Platform',
    organization: 'Ministry of Earth Sciences (MoES) / NCPOR',
    timestamp: new Date().toISOString()
  });
});

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup Socket.IO Events
setupSocketIO(io);

// Initialize DB and start simulation engine
async function bootstrap() {
  await initDatabase();
  seedInitialStationData();
  SensorHealthService.initializeSensorRegistry();
  EdgeGatewayService.initializeEdgeGateways();
  MaintenanceService.initializeMaintenanceRecords();
  simulationEngine.start();

  server.listen(PORT, () => {
    console.log(`
=================================================================
  ❄️ ANTARCTIC MISSION OPERATIONS & DIGITAL TWIN PLATFORM ❄️
  Ministry of Earth Sciences (MoES) - NCPOR
  Problem Statement: 26060
  
  Server listening on: http://localhost:${PORT}
  Socket.IO Gateway:    ws://localhost:${PORT}
=================================================================
    `);
  });
}

bootstrap().catch(err => {
  console.error('Fatal initialization error:', err);
});
