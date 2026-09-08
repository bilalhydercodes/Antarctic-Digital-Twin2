import { StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { systemLogger } from '../utils/logger.js';
import { StructuredAIResponse } from './AIAssistantService.js';

export interface GroqAIAnalysisResponse {
  summary: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  risks: string[];
  recommendedActions: string[];
  reasoning: string;
  source: 'GROQ_AI' | 'DETERMINISTIC_FALLBACK';
}

export class GroqAIService {
  public static async queryRAGModel(
    stationId: StationId, 
    userQuery: string, 
    liveTelemetrySummary: string, 
    relevantSop: string
  ): Promise<StructuredAIResponse | null> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'gsk_demo_key_placeholder' || !apiKey.startsWith('gsk_')) {
      return null;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are the NCPOR Remote Antarctic Operations AI Copilot. You MUST answer the user question using ONLY the provided live telemetry and SOP knowledge base. Respond ONLY in valid JSON matching this schema:
{
  "currentSensorData": "Summary of active physical sensor values relevant to the question",
  "documentedProcedure": "Official NCPOR SOP steps applicable to this scenario",
  "systemRecommendation": "Actionable operational recommendations based on physical constraints",
  "unknownOrInsufficientData": "Any missing data points or unverified details (or null if fully known)"
}`
            },
            {
              role: 'user',
              content: `Station: ${stationId.toUpperCase()}\nUser Query: ${userQuery}\n\nLIVE TELEMETRY CONTEXT:\n${liveTelemetrySummary}\n\nDOCUMENTED SOP KNOWLEDGE BASE:\n${relevantSop}`
            }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data: any = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        const stationName = stationId === 'maitri' ? 'Maitri Research Station' : 'Bharati Research Station';
        const fullMarkdownAnswer = `### 🛰️ Antarctic Operational AI Copilot Analysis (${stationName})

#### 📊 CURRENT SENSOR DATA
${parsed.currentSensorData}

#### 📜 DOCUMENTED PROCEDURE
${parsed.documentedProcedure}

#### 💡 SYSTEM RECOMMENDATION
${parsed.systemRecommendation}

${parsed.unknownOrInsufficientData ? `\n#### ⚠️ UNKNOWN / INSUFFICIENT DATA\n${parsed.unknownOrInsufficientData}` : ''}
`;

        return {
          stationId,
          prompt: userQuery,
          currentSensorData: parsed.currentSensorData,
          documentedProcedure: parsed.documentedProcedure,
          systemRecommendation: parsed.systemRecommendation,
          unknownOrInsufficientData: parsed.unknownOrInsufficientData || undefined,
          fullMarkdownAnswer,
          source: 'GROQ_RAG_AI'
        };
      }
    } catch (err: any) {
      console.log('🟡 Groq API query failed, falling back to deterministic RAG engine:', err.message);
    }

    return null;
  }

  public static async analyzeStationTelemetry(stationId: StationId, userQuery?: string): Promise<GroqAIAnalysisResponse> {
    const env = inMemoryDb.environment.get(stationId);
    const energy = inMemoryDb.energy.get(stationId);
    const alerts = inMemoryDb.alerts.filter(a => a.stationId === stationId && !a.resolved);
    const stationName = stationId === 'maitri' ? 'Maitri' : 'Bharati';

    const telemetryContext = {
      station: stationName,
      temperature: env?.temperature,
      feelsLike: env?.feelsLike,
      windSpeed: env?.windSpeed,
      visibility: env?.visibility,
      totalPowerConsumptionKw: energy?.powerGrid.consumptionKw,
      totalPowerGenerationKw: energy?.powerGrid.generationKw,
      renewableContributionPercent: energy?.powerGrid.renewableContributionPercent,
      batterySOC: energy?.battery.stateOfCharge,
      batteryStatus: energy?.battery.status,
      batteryBackupHours: energy?.battery.estimatedBackupHours,
      fuelReservesLiters: energy?.fuelStorage.currentFuelLiters,
      fuelDaysRemaining: energy?.fuelStorage.estimatedDaysRemaining,
      generators: energy?.generators.map(g => ({
        name: g.name,
        loadPercent: g.loadPercent,
        temperature: g.temperature,
        healthPercent: g.healthPercent,
        failureProbability: g.failureProbability,
        status: g.status
      })),
      activeAlertsCount: alerts.length,
      activeAlerts: alerts.slice(0, 3).map(a => `${a.severity}: ${a.title}`)
    };

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && apiKey !== 'gsk_demo_key_placeholder' && apiKey.startsWith('gsk_')) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `You are the NCPOR Remote Antarctic Operations AI Engine. Respond ONLY in valid JSON matching:
{
  "summary": "High-level summary of station operational state",
  "severity": "INFO" | "WARNING" | "CRITICAL" | "EMERGENCY",
  "risks": ["Risk item 1"],
  "recommendedActions": ["Action item 1"],
  "reasoning": "Technical explanation"
}`
              },
              {
                role: 'user',
                content: `Current ${stationName} Telemetry Context: ${JSON.stringify(telemetryContext)}. Query: ${userQuery || 'Analyze risks.'}`
              }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data: any = await response.json();
          const parsed: GroqAIAnalysisResponse = JSON.parse(data.choices[0].message.content);
          parsed.source = 'GROQ_AI';
          return parsed;
        }
      } catch (err: any) {
        console.log('🟡 Groq API query failed:', err.message);
      }
    }

    // Deterministic fallback
    const highRiskGen = energy?.generators.find(g => g.temperature > 85 || g.status === 'CRITICAL' || g.status === 'OFFLINE' || g.status === 'FAILED');
    const batteryCrit = (energy?.battery.stateOfCharge || 100) < 25;
    const weatherBlizzard = (env?.windSpeed || 0) > 75 || (env?.temperature || 0) < -34;

    let severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY' = 'INFO';
    const risks: string[] = [];
    const recs: string[] = [];

    if (highRiskGen) {
      severity = 'CRITICAL';
      risks.push(`Generator Thermal Overload on ${highRiskGen.name} (${highRiskGen.temperature}°C).`);
      recs.push(`Inspect Generator cooling loop and transfer critical load to standby unit.`);
    }

    if (batteryCrit) {
      if (severity !== 'CRITICAL') severity = 'WARNING';
      risks.push(`Battery SOC depleted to ${energy?.battery.stateOfCharge}%.`);
      recs.push(`Shed non-critical scientific heating loads to conserve battery reserves.`);
    }

    if (weatherBlizzard) {
      if (severity === 'INFO') severity = 'WARNING';
      risks.push(`Katabatic Blizzard Warning: Wind ${env?.windSpeed} km/h, Temp ${env?.temperature}°C.`);
      recs.push(`Stow solar panels and restrict outdoor EVA operations.`);
    }

    if (risks.length === 0) {
      risks.push('No immediate critical risks. All primary life-support systems nominal.');
      recs.push('Maintain routine hybrid power grid regulation.');
    }

    return {
      summary: `[NCPOR Simulated Telemetry Analysis for ${stationName}] Ambient temp: ${env?.temperature}°C, Wind speed: ${env?.windSpeed} km/h. Load: ${energy?.powerGrid.consumptionKw} kW.`,
      severity,
      risks,
      recommendedActions: recs,
      reasoning: `Analysis derived from active physics engine: Ambient temp drops -> HVAC heating load increases -> Generator load adjusts.`,
      source: 'DETERMINISTIC_FALLBACK'
    };
  }
}
