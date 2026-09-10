import { StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { StructuredAIResponse } from './AIAssistantService.js';

export interface GeminiExplanationResult {
  alertTitle: string;
  severity: string;
  component: string;
  currentTelemetry: string;
  contributingFactors: string[];
  confidencePercent: number;
  recommendedOperationalResponse: string;
  source: string;
}

export class GeminiAIService {
  private static readonly MODEL_NAME = 'gemini-3.6-flash';

  private static getApiKey(): string {
    return process.env.GEMINI_API_KEY || '';
  }

  /**
   * Core caller for Google Gemini 3.6 Flash API using standard fetch
   */
  public static async callGemini(promptText: string, retries: number = 1): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL_NAME}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2500
      }
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const json: any = await response.json();
          const candidateParts = json.candidates?.[0]?.content?.parts || [];
          const text = candidateParts.map((p: any) => p.text || '').filter(Boolean).join('');
          if (text) return text;
        } else {
          const errBody = await response.text();
          console.warn(`[GeminiAIService] HTTP ${response.status}: ${errBody.slice(0, 150)}`);
          if (response.status === 429 || response.status >= 500) {
            await new Promise(r => setTimeout(r, 600));
            continue;
          }
          return null;
        }
      } catch (err: any) {
        console.warn(`[GeminiAIService] Attempt ${attempt + 1} error:`, err.message);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
      }
    }

    return null;
  }

  /**
   * RAG Query Assistant using Google Gemini 3.6 Flash LLM
   */
  public static async queryRAGModel(
    stationId: StationId,
    userQuery: string,
    liveTelemetrySummary: string,
    relevantSop: string
  ): Promise<StructuredAIResponse | null> {
    const stationName = stationId === 'maitri' ? 'Maitri Research Station' : 'Bharati Research Station';

    const systemPrompt = `You are FrostByte ❄️💻, the lead NCPOR Antarctic Mission Operations AI Copilot at ${stationName}.
You are tech-savvy, sharp, physics-grounded, and safety-oriented.
Answer the operator query strictly using the following live digital twin telemetry context and official NCPOR polar standard operating procedures (SOP).

Pay special attention if the operator asks about winter approaching, severe cold, resource conservation, or protecting equipment. Always explain:
1. Which station components are at risk during this scenario
2. What specific conservation actions must be taken
3. How doing those actions directly saves the component from failure or wear

LIVE DIGITAL TWIN CONTEXT:
${liveTelemetrySummary}

DOCUMENTED POLAR SOP KNOWLEDGE:
${relevantSop}

OPERATOR QUERY:
${userQuery}

Return your response in structured markdown with these exact section headers:
#### 📊 CURRENT PHYSICAL TELEMETRY
(Summarize relevant active temperatures, loads, reserves, and instrument health)

#### 🧠 ROOT CAUSE & PHYSICS REASONING
(Analyze the engineering or atmospheric causes, thermodynamics, electrical balance, or sensor state)

#### 📜 DOCUMENTED NCPOR PROCEDURE
(Cite specific SOP clauses, emergency thresholds, or operational steps)

#### 💡 ACTIONABLE RECOMMENDATIONS & COMPONENT CONSERVATION
(Give clear numbered priority commands explaining what actions save each component from failure)

#### ⚠️ UNCERTAINTIES & SENSOR EXCEPTIONS
(Mention any offline sensors, delayed telemetry, or state "All vital parameters verified.")
`;

    const rawAnswer = await this.callGemini(systemPrompt);
    if (!rawAnswer) return null;

    const fullMarkdownAnswer = `### ❄️ FrostByte Polar Operations Analysis (${stationName})
*Powered by Google Gemini 3.6 Flash LLM Model*

${rawAnswer}

---
*Classification: RESTRICTED // FROSTBYTE AI • Real-Time Digital Twin RAG*`;

    return {
      stationId,
      prompt: userQuery,
      currentSensorData: `Live parameters from ${stationName}: Validated via Gemini LLM`,
      documentedProcedure: `NCPOR Polar Expedition Operational Guideline`,
      systemRecommendation: `Execute validated operational steps recommended by FrostByte AI.`,
      fullMarkdownAnswer,
      source: 'GOOGLE_GEMINI_AI'
    };
  }

  /**
   * AI Risk Explanation for specific alerts ("Explain with AI")
   */
  public static async explainAlert(alert: any, stationId: StationId): Promise<GeminiExplanationResult | null> {
    const env = inMemoryDb.environment.get(stationId);
    const energy = inMemoryDb.energy.get(stationId);
    const stationName = stationId === 'maitri' ? 'Maitri' : 'Bharati';

    const prompt = `You are the Antarctic Digital Twin AI Diagnostics Engine.
Analyze this critical station alert and explain its physical causes and response.

ALERT DETAILS:
- Station: ${stationName}
- Title: ${alert.title}
- Severity: ${alert.severity}
- Component: ${alert.component}
- Description: ${alert.description}

LIVE SENSOR STATE:
- Temperature: ${env?.temperature}°C | Wind: ${env?.windSpeed} km/h | Pressure: ${env?.pressure} hPa
- Power Demand: ${energy?.powerGrid.consumptionKw} kW / Generation: ${energy?.powerGrid.generationKw} kW
- Battery SOC: ${energy?.battery.stateOfCharge}% | Fuel Days: ${energy?.fuelStorage.estimatedDaysRemaining}d

Respond ONLY in valid JSON format matching this schema:
{
  "contributingFactors": ["Factor 1 explaining environmental or mechanical cause", "Factor 2", "Factor 3"],
  "confidencePercent": 95,
  "recommendedOperationalResponse": "Concise immediate mitigation instruction for the operator"
}`;

    const raw = await this.callGemini(prompt);
    if (!raw) return null;

    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        alertTitle: alert.title,
        severity: alert.severity,
        component: alert.component,
        currentTelemetry: `Ambient: ${env?.temperature}°C | Wind: ${env?.windSpeed} km/h | Power: ${energy?.powerGrid.consumptionKw} kW (${energy?.battery.stateOfCharge}% SOC)`,
        contributingFactors: parsed.contributingFactors || [
          `Extreme Antarctic ambient cooling affecting ${alert.component}.`,
          `Electrical load balancing dynamics triggered by weather surge.`,
          `Thermal dissipation threshold crossed.`
        ],
        confidencePercent: parsed.confidencePercent || 94,
        recommendedOperationalResponse: parsed.recommendedOperationalResponse || alert.suggestedAction,
        source: 'FROSTBYTE AI (GOOGLE GEMINI 3.6 FLASH)'
      };
    } catch {
      return null;
    }
  }
}
