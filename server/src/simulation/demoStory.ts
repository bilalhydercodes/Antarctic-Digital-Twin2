import { inMemoryDb } from '../models/Database.js';
import { simulationEngine } from './SimulationEngine.js';

export interface DemoStepInfo {
  stepIndex: number;
  totalSteps: number;
  headline: string;
  subtext: string;
  activeComponent: string;
  badge: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'AUTOMATED_RESPONSE' | 'AI_ADVICE';
}

export class DemoStoryRunner {
  private currentStep = 0;
  private timer: NodeJS.Timeout | null = null;
  private ioServer: any = null;

  public setSocketServer(io: any) {
    this.ioServer = io;
  }

  public startDemo() {
    this.currentStep = 1;
    inMemoryDb.simulationState.demoModeActive = true;
    inMemoryDb.simulationState.demoStepIndex = 1;
    
    if (this.timer) clearInterval(this.timer);
    
    // Execute step 1 immediately
    this.executeStep(1);

    // Auto-advance step every 5 seconds
    this.timer = setInterval(() => {
      this.currentStep++;
      if (this.currentStep > 14) {
        this.finishDemo();
      } else {
        this.executeStep(this.currentStep);
      }
    }, 5000);
  }

  public stopDemo() {
    inMemoryDb.simulationState.demoModeActive = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private finishDemo() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    inMemoryDb.simulationState.demoModeActive = false;
    
    const finalInfo: DemoStepInfo = {
      stepIndex: 14,
      totalSteps: 14,
      headline: "INCIDENT DETECTED → PREDICTED → RESPONDED",
      subtext: "Automated Remote Operations & Digital Twin Simulation cycle complete.",
      activeComponent: "MoES NCPOR Digital Twin Command Center",
      badge: "AI_ADVICE"
    };

    if (this.ioServer) {
      this.ioServer.emit('demoStep', finalInfo);
    }
  }

  private executeStep(step: number) {
    inMemoryDb.simulationState.demoStepIndex = step;
    let info: DemoStepInfo;

    const maitriEnv = inMemoryDb.environment.get('maitri')!;
    const maitriEnergy = inMemoryDb.energy.get('maitri')!;

    switch (step) {
      case 1:
        simulationEngine.triggerScenario('normal');
        info = {
          stepIndex: 1,
          totalSteps: 14,
          headline: "STEP 1: Normal Station Operations",
          subtext: "Maitri station operating under standard environmental telemetry (-24.5°C, wind 28 km/h).",
          activeComponent: "Main Station Command Center",
          badge: "NORMAL"
        };
        break;

      case 2:
        info = {
          stepIndex: 2,
          totalSteps: 14,
          headline: "STEP 2: Healthy Station Infrastructure",
          subtext: "All primary systems (Generators, Battery Bank, HVAC, Water filtration) report GREEN healthy status.",
          activeComponent: "3D Digital Twin Overview",
          badge: "NORMAL"
        };
        break;

      case 3:
        simulationEngine.triggerScenario('blizzard');
        info = {
          stepIndex: 3,
          totalSteps: 14,
          headline: "STEP 3: Antarctic Blizzard Warning Initiated",
          subtext: "Katabatic wind speeds rapidly surging to 84 km/h with heavy snow accumulation.",
          activeComponent: "Anemometer & Weather Suite",
          badge: "WARNING"
        };
        break;

      case 4:
        maitriEnv.temperature = -36.4;
        maitriEnv.feelsLike = -49.2;
        info = {
          stepIndex: 4,
          totalSteps: 14,
          headline: "STEP 4: Rapid Ambient Temperature Drop",
          subtext: "Temperature drops from -24.5°C down to -36.4°C. Severe cold front front active.",
          activeComponent: "Environmental Telemetry Suite",
          badge: "WARNING"
        };
        break;

      case 5:
        maitriEnergy.powerGrid.heatingLoadKw = 215; // +38%
        info = {
          stepIndex: 5,
          totalSteps: 14,
          headline: "STEP 5: Station HVAC Heating Demand Surges",
          subtext: "Hydronic boiler load increases by +38% (155 kW → 215 kW) to preserve interior living quarters at +20°C.",
          activeComponent: "Hydronic Heating Boiler A",
          badge: "WARNING"
        };
        break;

      case 6:
        maitriEnergy.powerGrid.consumptionKw = 370;
        info = {
          stepIndex: 6,
          totalSteps: 14,
          headline: "STEP 6: Total Station Power Consumption Rises",
          subtext: "Station power grid load rises from 285 kW to 370 kW. Renewable solar contribution drops to 5 kW.",
          activeComponent: "Main Power Distribution Bus",
          badge: "WARNING"
        };
        break;

      case 7:
        const gen2 = maitriEnergy.generators[1];
        if (gen2) {
          gen2.loadPercent = 88;
          gen2.powerKw = 220;
        }
        info = {
          stepIndex: 7,
          totalSteps: 14,
          headline: "STEP 7: Generator #2 Under Heavy Mechanical Stress",
          subtext: "Generator #2 load increases to 88%. Electrical current rising to 310 Amps.",
          activeComponent: "Generator Module #2",
          badge: "WARNING"
        };
        break;

      case 8:
        const g2Temp = maitriEnergy.generators[1];
        if (g2Temp) {
          g2Temp.temperature = 94;
          g2Temp.status = 'WARNING';
        }
        info = {
          stepIndex: 8,
          totalSteps: 14,
          headline: "STEP 8: Generator #2 Coolant Overheating",
          subtext: "Coolant temperature spikes to 94°C (Normal operating ceiling: 82°C). Thermal alarm triggered.",
          activeComponent: "Generator #2 Thermal Sensor",
          badge: "CRITICAL"
        };
        break;

      case 9:
        const g2Prob = maitriEnergy.generators[1];
        if (g2Prob) {
          g2Prob.failureProbability = 78.5;
          g2Prob.healthPercent = 42;
        }
        info = {
          stepIndex: 9,
          totalSteps: 14,
          headline: "STEP 9: Predictive Engine Flags High Failure Risk (78.5%)",
          subtext: "Time-series predictive trend predicts critical mechanical breakdown within 18-24 simulated hours.",
          activeComponent: "NCPOR Predictive Analytics Engine",
          badge: "CRITICAL"
        };
        break;

      case 10:
        simulationEngine.addAlert({
          stationId: 'maitri',
          severity: 'CRITICAL',
          category: 'EQUIPMENT',
          title: '🚨 PREDICTIVE ALERT: Generator #2 Impending Overheat',
          component: 'Generator #2 Caterpillar 250kW',
          description: 'Thermal rise and mechanical strain probability exceeded 78%. Immediate failover action recommended.',
          suggestedAction: 'Transfer critical station load to Generator #1 immediately.',
          acknowledged: false,
          resolved: false
        });
        info = {
          stepIndex: 10,
          totalSteps: 14,
          headline: "STEP 10: Early Warning Predictive Alert Published",
          subtext: "System broadcasts CRITICAL predictive alert to remote Indian command operators.",
          activeComponent: "Smart Alert Dispatcher",
          badge: "CRITICAL"
        };
        break;

      case 11:
        simulationEngine.triggerScenario('generator_failure');
        info = {
          stepIndex: 11,
          totalSteps: 14,
          headline: "STEP 11: Generator #2 Coolant Overheat Shutdown",
          subtext: "Generator #2 temperature hits 99°C. Engine protection breaker trips. Generator status: OFFLINE.",
          activeComponent: "Generator #2 Breaker",
          badge: "CRITICAL"
        };
        break;

      case 12:
        info = {
          stepIndex: 12,
          totalSteps: 14,
          headline: "STEP 12: 🚨 AUTOMATED CRITICAL LOAD TRANSFER EXECUTED",
          subtext: "Automated controller automatically shifts 180 kW critical load to Generator #1 within milliseconds.",
          activeComponent: "Automated Failover Switchgear",
          badge: "AUTOMATED_RESPONSE"
        };
        break;

      case 13:
        maitriEnergy.battery.stateOfCharge = 82;
        maitriEnergy.battery.status = 'DISCHARGING_FAST';
        maitriEnergy.battery.chargeDischargeRateKw = -45;
        info = {
          stepIndex: 13,
          totalSteps: 14,
          headline: "STEP 13: Battery Energy Storage Engaged",
          subtext: "Battery Bank buffers load deficit (-45 kW discharge) to ensure zero power interruption to scientific instruments.",
          activeComponent: "250kWh Battery Storage Bank",
          badge: "AUTOMATED_RESPONSE"
        };
        break;

      case 14:
        info = {
          stepIndex: 14,
          totalSteps: 14,
          headline: "STEP 14: AI Operations Assistant Recommended Action",
          subtext: "AI Assistant recommends: 'Maintain Generator #1 at 92% load and initiate automated load shedding of non-critical scientific heating loops.'",
          activeComponent: "AI Operations Assistant",
          badge: "AI_ADVICE"
        };
        break;

      default:
        info = {
          stepIndex: 1,
          totalSteps: 14,
          headline: "Demo Execution Active",
          subtext: "Simulating remote operations cycle.",
          activeComponent: "Command Center",
          badge: "NORMAL"
        };
    }

    if (this.ioServer) {
      this.ioServer.emit('demoStep', info);
    }
  }
}

export const demoStoryRunner = new DemoStoryRunner();
