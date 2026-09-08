import { Server as SocketIOServer, Socket } from 'socket.io';
import { simulationEngine } from '../simulation/SimulationEngine.js';
import { demoStoryRunner } from '../simulation/demoStory.js';
import { inMemoryDb } from '../models/Database.js';

export function setupSocketIO(io: SocketIOServer): void {
  simulationEngine.setSocketServer(io);
  demoStoryRunner.setSocketServer(io);

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected to Digital Twin gateway: [${socket.id}]`);

    // Emit initial full station telemetry snapshot immediately on client connection
    socket.emit('stationTelemetry', {
      maitri: {
        aws: inMemoryDb.aws.get('maitri'),
        geomagnetic: inMemoryDb.geomagnetic.get('maitri'),
        atmospheric: inMemoryDb.atmospheric.get('maitri'),
        seismic: inMemoryDb.seismic.get('maitri'),
        subsystems: inMemoryDb.subsystems.get('maitri'),
        environment: inMemoryDb.environment.get('maitri'),
        energy: inMemoryDb.energy.get('maitri'),
        equipment: inMemoryDb.equipment.get('maitri'),
        inventory: inMemoryDb.inventory.get('maitri')
      },
      bharati: {
        aws: inMemoryDb.aws.get('bharati'),
        geomagnetic: inMemoryDb.geomagnetic.get('bharati'),
        atmospheric: inMemoryDb.atmospheric.get('bharati'),
        subsystems: inMemoryDb.subsystems.get('bharati'),
        environment: inMemoryDb.environment.get('bharati'),
        energy: inMemoryDb.energy.get('bharati'),
        equipment: inMemoryDb.equipment.get('bharati'),
        inventory: inMemoryDb.inventory.get('bharati')
      },
      simulationState: inMemoryDb.simulationState,
      latestAlerts: inMemoryDb.alerts.slice(-10),
      incidents: inMemoryDb.incidents
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: [${socket.id}]`);
    });
  });
}
