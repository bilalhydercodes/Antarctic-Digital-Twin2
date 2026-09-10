import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { StationId } from '../../types';
import { Globe, MapPin, ExternalLink, ShieldCheck, Layers, Map as MapIcon } from 'lucide-react';

interface Antarctic2DMapProps {
  onOpenDigitalTwin: (stationId: StationId) => void;
}

export const Antarctic2DMap: React.FC<Antarctic2DMapProps> = ({ onOpenDigitalTwin }) => {
  const { activeStationId, setActiveStationId, environment, energy } = useSimulation();
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('satellite');

  const stationCoords: Record<StationId, { lat: number; lng: number; name: string; mapUrl: string }> = {
    maitri: { 
      lat: -70.7664, 
      lng: 11.7329, 
      name: 'Maitri Research Station',
      mapUrl: 'https://maps.google.com/maps?q=-70.7664,11.7329&z=12&t=k&output=embed'
    },
    bharati: { 
      lat: -69.4075, 
      lng: 76.1908, 
      name: 'Bharati Station & Digital Lab',
      mapUrl: 'https://maps.google.com/maps?q=-69.4075,76.1908&z=12&t=k&output=embed'
    }
  };

  const activeCoords = stationCoords[activeStationId];

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-700" />
              <span>REGIONAL ANTARCTIC SATELLITE MAP</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-sans text-xs font-bold border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>REAL GOOGLE SATELLITE IMAGERY ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Ministry of Earth Sciences (MoES) • Real Coordinates for Schirmacher Oasis & Larsemann Hills
          </p>
        </div>

        {/* Map View Switcher */}
        <div className="flex items-center space-x-1 bg-[#f8f7f4] p-1 rounded-xl border border-[#e5e3dc] text-xs font-semibold">
          <button
            onClick={() => setMapMode('satellite')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              mapMode === 'satellite' ? 'bg-blue-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>REAL GOOGLE SATELLITE</span>
          </button>
          <button
            onClick={() => setMapMode('vector')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              mapMode === 'vector' ? 'bg-blue-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>CONTINENTAL OVERVIEW</span>
          </button>
        </div>
      </div>

      {/* MAP DISPLAY AREA */}
      <div className="bg-white p-4 rounded-2xl border border-[#e5e3dc] shadow-polar relative">
        {mapMode === 'satellite' ? (
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-[#e5e3dc]">
            <iframe
              title={`Google Satellite Map for ${activeCoords.name}`}
              src={activeCoords.mapUrl}
              className="w-full h-full border-0 filter contrast-110"
              loading="lazy"
            ></iframe>

            {/* Overlay Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#e5e3dc] shadow-lg font-sans">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{activeCoords.name.toUpperCase()}</span>
              </div>
              <div className="text-xs text-blue-700 font-semibold mt-1">
                COORDINATES: {activeCoords.lat}°S, {activeCoords.lng}°E
              </div>
              <div className="text-xs text-stone-500 mt-1 font-medium">
                Live Met: {environment?.temperature}°C • Wind {environment?.windSpeed} km/h
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => onOpenDigitalTwin(activeStationId)}
                className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-md transition"
              >
                OPEN 3D DIGITAL TWIN
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-[500px] bg-[#f8f7f4] rounded-xl border border-[#e5e3dc] overflow-hidden flex items-center justify-center p-4">
            <svg className="w-full h-full text-stone-300 max-w-4xl" viewBox="0 0 800 600" fill="none" stroke="currentColor">
              <path 
                d="M 400 120 C 520 110 650 180 680 300 C 700 420 600 520 450 530 C 300 540 150 480 120 360 C 100 240 250 140 400 120 Z" 
                fill="#ffffff" 
                stroke="#cbd5e1" 
                strokeWidth="3"
              />
            </svg>

            {/* MAITRI PIN */}
            <div className="absolute top-[28%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 group z-20">
              <button
                onClick={() => {
                  setActiveStationId('maitri');
                  onOpenDigitalTwin('maitri');
                }}
                className="relative flex flex-col items-center group-hover:scale-105 transition-transform"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 shadow-md flex items-center justify-center text-white ring-4 ring-blue-100">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="mt-2 bg-white border border-[#e5e3dc] px-3 py-1.5 rounded-xl shadow-lg text-center font-sans">
                  <div className="text-xs font-bold text-stone-900 flex items-center space-x-1">
                    <span>MAITRI STATION</span>
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">70°45'S, 11°44'E • ~50m</div>
                </div>
              </button>
            </div>

            {/* BHARATI PIN */}
            <div className="absolute top-[32%] right-[24%] transform translate-x-1/2 -translate-y-1/2 group z-20">
              <button
                onClick={() => {
                  setActiveStationId('bharati');
                  onOpenDigitalTwin('bharati');
                }}
                className="relative flex flex-col items-center group-hover:scale-105 transition-transform"
              >
                <div className="w-6 h-6 rounded-full bg-sky-600 shadow-md flex items-center justify-center text-white ring-4 ring-sky-100">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="mt-2 bg-white border border-[#e5e3dc] px-3 py-1.5 rounded-xl shadow-lg text-center font-sans">
                  <div className="text-xs font-bold text-stone-900 flex items-center space-x-1">
                    <span>BHARATI STATION</span>
                    <ExternalLink className="w-3 h-3 text-sky-600" />
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">69°24'S, 76°11'E • 35m</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
