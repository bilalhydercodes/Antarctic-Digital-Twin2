import { EnvironmentData, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { RealWeatherService } from './RealWeatherService.js';

export class EnvironmentSimulationService {
  public static useRealWeatherMode = true;

  public static async updateEnvironment(stationId: StationId, speedMultiplier: number): Promise<EnvironmentData> {
    const env = inMemoryDb.environment.get(stationId);
    if (!env) throw new Error(`Environment for ${stationId} missing`);

    // If Real Weather Mode is enabled and no active blizzard/scenario is forced
    if (this.useRealWeatherMode && inMemoryDb.simulationState.activeScenario === 'normal') {
      const realData = await RealWeatherService.fetchRealAntarcticWeather(stationId);
      if (realData) {
        env.temperature = realData.temperature;
        env.feelsLike = realData.feelsLike;
        env.humidity = realData.humidity;
        env.pressure = realData.pressure;
        env.windSpeed = realData.windSpeed;
        env.windDirection = realData.windDirection;
        env.visibility = realData.visibility;
        env.snowfallRate = realData.snowfallRate;
        env.solarRadiation = realData.solarRadiation;
        env.timestamp = new Date().toISOString();
        return env;
      }
    }

    // Fallback or Scenario weather dynamics
    const tempNoise = (Math.random() - 0.49) * 0.08 * speedMultiplier;
    env.temperature = Number((env.temperature + tempNoise).toFixed(1));
    env.feelsLike = Number((env.temperature - (env.windSpeed * 0.26)).toFixed(1));

    const windNoise = Math.round((Math.random() - 0.48) * 1.8 * speedMultiplier);
    env.windSpeed = Math.max(4, Math.min(125, env.windSpeed + windNoise));

    const pressureNoise = (Math.random() - 0.5) * 0.4 * speedMultiplier;
    env.pressure = Number((env.pressure + pressureNoise).toFixed(1));

    env.timestamp = new Date().toISOString();
    return env;
  }
}
