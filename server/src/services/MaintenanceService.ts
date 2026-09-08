import { MaintenanceRecord, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class MaintenanceService {
  public static initializeMaintenanceRecords(): void {
    const initialRecords: MaintenanceRecord[] = [
      {
        id: 'WO-MTR-2026-01',
        equipmentId: 'eq-m1',
        stationId: 'maitri',
        equipmentName: 'Priyadarshini Lake Water Pump House',
        serviceType: 'ROUTINE_PREVENTIVE',
        lastServiceDate: '2026-01-15',
        nextServiceDate: '2026-07-15',
        status: 'NORMAL',
        technician: 'K. Sharma (Mechanical Lead)',
        healthBeforePercent: 86,
        healthAfterPercent: 94,
        notes: 'Flushed pump impeller intake manifold. Replaced mechanical seal and verified anti-freeze heat trace.'
      },
      {
        id: 'WO-MTR-2026-02',
        equipmentId: 'gen-m1',
        stationId: 'maitri',
        equipmentName: 'Primary Diesel Gen #1 (Kirloskar 125kVA)',
        serviceType: 'ROUTINE_PREVENTIVE',
        lastServiceDate: '2026-02-01',
        nextServiceDate: '2026-03-15',
        status: 'DUE_SOON',
        technician: 'R. Patel (Power Systems)',
        healthBeforePercent: 91,
        healthAfterPercent: 95,
        notes: 'Oil filter replaced. Scheduled for 5,000-hour injector nozzle calibration.'
      },
      {
        id: 'WO-BHR-2026-01',
        equipmentId: 'gen-b1',
        stationId: 'bharati',
        equipmentName: 'MAN 200kW CHP Co-Gen Unit #1',
        serviceType: 'ROUTINE_PREVENTIVE',
        lastServiceDate: '2026-02-10',
        nextServiceDate: '2026-08-10',
        status: 'NORMAL',
        technician: 'A. Nair (Thermal Specialist)',
        healthBeforePercent: 88,
        healthAfterPercent: 96,
        notes: 'Cleaned plate heat exchanger for HVAC heat recovery. Combustion gas analyzer confirmed 96% thermal efficiency.'
      },
      {
        id: 'WO-BHR-2026-02',
        equipmentId: 'eq-b2',
        stationId: 'bharati',
        equipmentName: 'Seawater Intake Pump & Desalination RO Plant',
        serviceType: 'ROUTINE_PREVENTIVE',
        lastServiceDate: '2026-01-20',
        nextServiceDate: '2026-07-20',
        status: 'NORMAL',
        technician: 'V. Sundaram (Life Support)',
        healthBeforePercent: 89,
        healthAfterPercent: 94,
        notes: 'Acid cleaned RO membrane cylinders. Intake de-icing thermal jacket tested at 2.4°C seawater ambient.'
      },
      {
        id: 'WO-MTR-2026-03',
        equipmentId: 'eq-m3',
        stationId: 'maitri',
        equipmentName: 'Broadband Seismometer BB01 Vault',
        serviceType: 'CALIBRATION',
        lastServiceDate: '2025-11-20',
        nextServiceDate: '2026-11-20',
        status: 'NORMAL',
        technician: 'Dr. M. Banerjee (Geophysicist)',
        healthBeforePercent: 95,
        healthAfterPercent: 98,
        notes: 'Zero baseline leveling verified. GPS atomic clock time stamp synchronization recalibrated.'
      }
    ];

    inMemoryDb.maintenanceRecords = initialRecords;
    console.log('🔧 MaintenanceService: Loaded 5 verified station work orders and equipment records.');
  }

  public static getRecords(stationId?: StationId): MaintenanceRecord[] {
    if (stationId) {
      return inMemoryDb.maintenanceRecords.filter(r => r.stationId === stationId);
    }
    return inMemoryDb.maintenanceRecords;
  }

  public static addRecord(record: Omit<MaintenanceRecord, 'id'>): MaintenanceRecord {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `WO-${record.stationId.toUpperCase()}-${Date.now().toString().slice(-6)}`
    };
    inMemoryDb.maintenanceRecords.unshift(newRecord);
    return newRecord;
  }
}
