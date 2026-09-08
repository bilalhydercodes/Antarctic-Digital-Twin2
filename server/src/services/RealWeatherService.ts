import { EnvironmentData, StationId } from '../types/index.js';
import { systemLogger } from '../utils/logger.js';

export interface RealWeatherResponse {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  snowfallRate: number;
  solarRadiation: number;
  isRealData: boolean;
}

export class RealWeatherService {
  private static cache: Map<StationId, { data: RealWeatherResponse; timestamp: number }> = new Map();

  // Maitri: -70.7664, 11.7329
  // Bharati: -69.4075, 76.1908
  private static stationCoords: Record<StationId, { lat: number; lng: number }> = {
    maitri: { lat: -70.7664, lng: 11.7329 },
    bharati: { lat: -69.4075, lng: 76.1908 }
  };

  public static async fetchRealAntarcticWeather(stationId: StationId): Promise<RealWeatherResponse | null> {
    const cached = this.cache.get(stationId);
    const now = Date.now();

    // 3 minute cache window to avoid API rate limits
    if (cached && (now - cached.timestamp < 180000)) {
      return cached.data;
    }

    const { lat, lng } = this.stationCoords[stationId];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m,snowfall,shortwave_radiation`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather API HTTP ${res.status}`);
      const json: any = await res.json();
      const current = json.current;

      const windDeg = current.wind_direction_10m || 0;
      const windDirStr = this.degreesToCompass(windDeg);

      const realData: RealWeatherResponse = {
        temperature: Number((current.temperature_2m ?? -24.5).toFixed(1)),
        feelsLike: Number((current.apparent_temperature ?? -32.0).toFixed(1)),
        humidity: Math.round(current.relative_humidity_2m ?? 65),
        pressure: Number((current.surface_pressure ?? 985.0).toFixed(1)),
        windSpeed: Math.round(current.wind_speed_10m ?? 28),
        windDirection: windDirStr,
        visibility: current.snowfall > 0 ? 3.5 : 15.0,
        snowfallRate: Number((current.snowfall ?? 0).toFixed(1)),
        solarRadiation: Math.round(current.shortwave_radiation ?? 200),
        isRealData: true
      };

      this.cache.set(stationId, { data: realData, timestamp: now });
      systemLogger.log('SIMULATION_STARTED', stationId, `Fetched REAL Live Weather for ${stationId.toUpperCase()}: ${realData.temperature}°C, Wind ${realData.windSpeed} km/h`);
      
      return realData;
    } catch (err: any) {
      console.log(`🟡 Real weather fetch failed for ${stationId}, fallback to simulation:`, err.message);
      return null;
    }
  }

  private static degreesToCompass(deg: number): string {
    const val = Math.floor((deg / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[val % 16];
  }
}
