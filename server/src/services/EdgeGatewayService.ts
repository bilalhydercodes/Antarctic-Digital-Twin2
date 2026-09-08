import { StationId, EdgeGatewayTelemetry, SatelliteDegradationConfig, SatelliteLinkMode, TelemetryPriority } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class EdgeGatewayService {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
  }

  public static initializeEdgeGateways(): void {
    const stations: StationId[] = ['maitri', 'bharati'];
    const now = new Date().toISOString();

    stations.forEach(stId => {
      const gateway: EdgeGatewayTelemetry = {
        stationId: stId,
        gatewayStatus: 'ONLINE',
        cpuLoadPercent: 24.5,
        memoryUsagePercent: 38.2,
        localBufferQueueSize: 0,
        maxBufferCapacity: 5000,
        packetsReceivedTotal: 1420,
        packetsSentTotal: 1420,
        packetsDroppedTotal: 0,
        compressionRatioPercent: 88.4,
        lastSatelliteSyncTimestamp: now,
        bandwidthUsageKbps: 42.0,
        activeDegradation: {
          mode: 'LOCAL',
          latencyMs: 45,
          packetLossPercent: 0.1,
          bandwidthKbps: 1024,
          jitterMs: 5,
          outageDurationSec: 0
        },
        priorityTransmissionStats: {
          p0TransmitPercent: 100,
          p1TransmitPercent: 100,
          p2TransmitPercent: 100,
          p3TransmitPercent: 100,
          p4TransmitPercent: 100
        }
      };

      inMemoryDb.edgeGateways.set(stId, gateway);
    });

    console.log('🛰️ EdgeGatewayService: Antarctic Edge Gateways initialized for Maitri and Bharati.');
  }

  public static updateGatewayTick(stationId: StationId): void {
    const gateway = inMemoryDb.edgeGateways.get(stationId);
    if (!gateway) return;

    const mode = gateway.activeDegradation.mode;

    // Simulate edge gateway CPU/Memory fluctuations
    gateway.cpuLoadPercent = Math.round(20 + Math.random() * 15);
    gateway.memoryUsagePercent = Math.round(35 + Math.random() * 8);

    if (mode === 'OFFLINE') {
      gateway.gatewayStatus = 'BUFFERING';
      gateway.localBufferQueueSize = Math.min(gateway.maxBufferCapacity, gateway.localBufferQueueSize + 4);
      gateway.packetsReceivedTotal += 4;
      gateway.priorityTransmissionStats = {
        p0TransmitPercent: 0,
        p1TransmitPercent: 0,
        p2TransmitPercent: 0,
        p3TransmitPercent: 0,
        p4TransmitPercent: 0
      };
      gateway.bandwidthUsageKbps = 0;
    } else if (mode === 'VSAT' || mode === 'DEGRADED' || mode === 'LOW_BANDWIDTH') {
      gateway.gatewayStatus = 'DEGRADED';
      gateway.packetsReceivedTotal += 4;
      gateway.packetsSentTotal += 3;
      gateway.packetsDroppedTotal += Math.random() > 0.6 ? 1 : 0;
      gateway.localBufferQueueSize = Math.max(0, gateway.localBufferQueueSize - 1);
      gateway.lastSatelliteSyncTimestamp = new Date().toISOString();

      // Priority-based transmission under degradation
      gateway.priorityTransmissionStats = {
        p0TransmitPercent: 100,
        p1TransmitPercent: 98,
        p2TransmitPercent: 72,
        p3TransmitPercent: 35,
        p4TransmitPercent: 15
      };
      gateway.bandwidthUsageKbps = mode === 'VSAT' ? 64 : 128;
    } else {
      // Local mode
      gateway.gatewayStatus = 'ONLINE';
      gateway.packetsReceivedTotal += 4;
      gateway.packetsSentTotal += 4;
      if (gateway.localBufferQueueSize > 0) {
        gateway.localBufferQueueSize = Math.max(0, gateway.localBufferQueueSize - 5);
      }
      gateway.lastSatelliteSyncTimestamp = new Date().toISOString();
      gateway.priorityTransmissionStats = {
        p0TransmitPercent: 100,
        p1TransmitPercent: 100,
        p2TransmitPercent: 100,
        p3TransmitPercent: 100,
        p4TransmitPercent: 100
      };
      gateway.bandwidthUsageKbps = 512;
    }

    if (this.ioServer) {
      this.ioServer.emit('edgeGatewayUpdated', gateway);
    }
  }

  public static configureSatelliteLink(stationId: StationId, config: Partial<SatelliteDegradationConfig>): EdgeGatewayTelemetry {
    const gateway = inMemoryDb.edgeGateways.get(stationId);
    if (!gateway) throw new Error(`Gateway for station ${stationId} not found.`);

    gateway.activeDegradation = {
      ...gateway.activeDegradation,
      ...config
    };

    if (config.mode === 'VSAT') {
      gateway.activeDegradation.latencyMs = 820;
      gateway.activeDegradation.packetLossPercent = 3.2;
      gateway.activeDegradation.bandwidthKbps = 64;
      gateway.activeDegradation.jitterMs = 140;
    } else if (config.mode === 'DEGRADED') {
      gateway.activeDegradation.latencyMs = 650;
      gateway.activeDegradation.packetLossPercent = 6.5;
      gateway.activeDegradation.bandwidthKbps = 96;
      gateway.activeDegradation.jitterMs = 95;
    } else if (config.mode === 'LOW_BANDWIDTH') {
      gateway.activeDegradation.latencyMs = 450;
      gateway.activeDegradation.packetLossPercent = 1.5;
      gateway.activeDegradation.bandwidthKbps = 128;
      gateway.activeDegradation.jitterMs = 40;
    } else if (config.mode === 'OFFLINE') {
      gateway.activeDegradation.latencyMs = 9999;
      gateway.activeDegradation.packetLossPercent = 100;
      gateway.activeDegradation.bandwidthKbps = 0;
      gateway.activeDegradation.jitterMs = 0;
    } else {
      // Local
      gateway.activeDegradation.latencyMs = 45;
      gateway.activeDegradation.packetLossPercent = 0.1;
      gateway.activeDegradation.bandwidthKbps = 1024;
      gateway.activeDegradation.jitterMs = 5;
    }

    if (this.ioServer) {
      this.ioServer.emit('edgeGatewayUpdated', gateway);
    }

    return gateway;
  }
}
