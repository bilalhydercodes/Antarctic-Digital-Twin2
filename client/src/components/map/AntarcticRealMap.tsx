import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Maximize2, Minimize2, Map as MapIcon, Layers, Compass, Crosshair } from 'lucide-react';

interface AntarcticRealMapProps {
  onSelectStation?: (stationId: 'maitri' | 'bharati') => void;
  heightClass?: string;
}

export const AntarcticRealMap: React.FC<AntarcticRealMapProps> = ({
  onSelectStation,
  heightClass = 'h-[320px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const [activeLayer, setActiveLayer] = useState<'map' | 'satellite'>('satellite');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({
    lat: '70.76°S',
    lng: '11.73°E'
  });

  // Real Station Data
  const STATIONS = [
    {
      id: 'maitri' as const,
      name: 'MAITRI STATION',
      region: 'Schirmacher Oasis',
      status: 'Operational',
      lat: -70.76,
      lng: 11.73,
      latStr: '70.76°S',
      lngStr: '11.73°E',
      elevation: '117m ASL',
      color: '#2563eb' // Blue
    },
    {
      id: 'bharati' as const,
      name: 'BHARATI STATION',
      region: 'Larsemann Hills',
      status: 'Operational',
      lat: -69.40,
      lng: 76.32,
      latStr: '69.40°S',
      lngStr: '76.32°E',
      elevation: '35m ASL',
      color: '#059669' // Emerald
    }
  ];

  // Tile Providers
  const TILE_LAYERS = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 17
    },
    map: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    // Initialize Leaflet Map focused on East Antarctica containing Maitri & Bharati
    const map = L.map(mapContainerRef.current, {
      center: [-70.1, 44.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add Base Tile Layer (ESRI World Imagery Satellite by default)
    const initialLayer = L.tileLayer(TILE_LAYERS[activeLayer].url, {
      maxZoom: TILE_LAYERS[activeLayer].maxZoom,
      attribution: TILE_LAYERS[activeLayer].attribution
    }).addTo(map);

    tileLayerRef.current = initialLayer;

    // Custom Station Pin Generator
    const createCustomIcon = (station: typeof STATIONS[0]) => {
      const isMaitri = station.id === 'maitri';
      const pinColor = isMaitri ? '#1d4ed8' : '#047857';
      const badgeBg = isMaitri ? '#dbeafe' : '#d1fae5';
      const badgeColor = isMaitri ? '#1e40af' : '#065f46';

      return L.divIcon({
        className: 'custom-station-pin',
        iconSize: [110, 42],
        iconAnchor: [55, 38],
        popupAnchor: [0, -36],
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; user-select: none;">
            <div style="
              display: flex; 
              align-items: center; 
              gap: 4px; 
              background: #ffffff; 
              border: 1.5px solid ${pinColor}; 
              border-radius: 4px; 
              padding: 2px 6px; 
              box-shadow: 0 2px 5px rgba(0,0,0,0.25);
              font-family: 'Inter', system-ui, sans-serif;
            ">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${pinColor}; box-shadow: 0 0 4px ${pinColor};"></span>
              <span style="font-size: 10px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px; white-space: nowrap;">${station.name.replace(' STATION', '')}</span>
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 5px solid transparent; 
              border-right: 5px solid transparent; 
              border-top: 6px solid ${pinColor};
              margin-top: -1px;
            "></div>
            <div style="width: 4px; height: 4px; background: #ffffff; border: 1.5px solid ${pinColor}; border-radius: 50%; margin-top: 1px;"></div>
          </div>
        `
      });
    };

    // Add Markers and Popups
    STATIONS.forEach((station) => {
      const marker = L.marker([station.lat, station.lng], {
        icon: createCustomIcon(station),
        title: station.name
      }).addTo(map);

      // Clean Government GIS Popup Template
      const popupHtml = `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 2px 4px; min-width: 140px; color: #0f172a;">
          <div style="font-size: 11px; font-weight: 800; color: #102a43; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 4px; letter-spacing: 0.2px;">
            ${station.name}
          </div>
          <div style="font-size: 10px; color: #475569; font-weight: 600;">
            ${station.region}
          </div>
          <div style="margin: 4px 0 3px 0;">
            <span style="
              display: inline-block; 
              padding: 1px 5px; 
              font-size: 9px; 
              font-weight: 700; 
              font-family: 'Inter', system-ui, sans-serif; 
              background: #ecfdf5; 
              color: #047857; 
              border: 1px solid #a7f3d0; 
              border-radius: 3px;
            ">
              ${station.status}
            </span>
          </div>
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 10px; font-weight: 600; color: #334155;">
            ${station.latStr}, ${station.lngStr}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -10],
        closeButton: true
      });

      marker.on('click', () => {
        if (onSelectStation) {
          onSelectStation(station.id);
        }
      });
    });

    // Add Real Orbit / Satellite Track Line (RISAT-2B polar orbital trajectory across Antarctica)
    const satTrackCoordinates: [number, number][] = [
      [-62.0, 5.0],
      [-66.5, 9.2],
      [-70.76, 11.73], // Maitri pass
      [-75.0, 16.0],
      [-80.0, 25.0],
      [-84.0, 45.0],
      [-82.0, 65.0],
      [-74.0, 72.0],
      [-69.40, 76.32], // Bharati pass
      [-64.0, 80.0]
    ];

    L.polyline(satTrackCoordinates, {
      color: '#06b6d4', // Cyan
      weight: 1.5,
      dashArray: '4, 4',
      opacity: 0.85
    }).addTo(map);

    // Add Station UAV Patrol Perimeters
    // Maitri UAV route
    const maitriUAVTrack: [number, number][] = [
      [-70.74, 11.68],
      [-70.74, 11.78],
      [-70.78, 11.78],
      [-70.78, 11.68],
      [-70.74, 11.68]
    ];

    L.polyline(maitriUAVTrack, {
      color: '#10b981', // Emerald
      weight: 1.5,
      dashArray: '3, 3',
      opacity: 0.85
    }).addTo(map);

    // Bharati UAV route
    const bharatiUAVTrack: [number, number][] = [
      [-69.38, 76.28],
      [-69.38, 76.36],
      [-69.42, 76.36],
      [-69.42, 76.28],
      [-69.38, 76.28]
    ];

    L.polyline(bharatiUAVTrack, {
      color: '#10b981',
      weight: 1.5,
      dashArray: '3, 3',
      opacity: 0.85
    }).addTo(map);

    // Track Cursor Coordinates on Mouse Move
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = Math.abs(e.latlng.lat).toFixed(2) + (e.latlng.lat < 0 ? '°S' : '°N');
      const lng = Math.abs(e.latlng.lng).toFixed(2) + (e.latlng.lng < 0 ? '°W' : '°E');
      setCursorCoords({ lat, lng });
    });

    // Clean up on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layer when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(TILE_LAYERS[activeLayer].url, {
      maxZoom: TILE_LAYERS[activeLayer].maxZoom,
      attribution: TILE_LAYERS[activeLayer].attribution
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [activeLayer]);

  // Handle Fullscreen Toggle
  const handleToggleFullscreen = () => {
    if (!cardContainerRef.current) return;

    if (!document.fullscreenElement) {
      cardContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }

    // Trigger Leaflet resize calculation
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      // Fit both stations in view
      mapInstanceRef.current.fitBounds([
        [-70.76, 11.73],
        [-69.40, 76.32]
      ], { padding: [40, 40] });
    }
  };

  return (
    <div 
      ref={cardContainerRef}
      className={`bg-white border border-[#cbd5e1] rounded-xs p-2.5 flex flex-col justify-between font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 rounded-none h-screen' : ''
      }`}
    >
      {/* ─── CARD HEADER / TOP BAR ─── */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
        <div className="text-xs font-bold text-[#102a43] uppercase tracking-tight flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-700" />
          <span>ANTARCTIC STATION LOCATION</span>
        </div>

        {/* Top Right Controls: Map, Satellite, Fullscreen */}
        <div className="flex items-center space-x-1 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveLayer('map')}
            className={`px-2 py-0.5 rounded-xs border transition ${
              activeLayer === 'map' 
                ? 'bg-[#102a43] text-white border-[#102a43]' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-2 py-0.5 rounded-xs border transition ${
              activeLayer === 'satellite' 
                ? 'bg-[#102a43] text-white border-[#102a43]' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen GIS Map'}
            className="p-1 border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xs transition"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* ─── MAP CANVAS & OVERLAYS ─── */}
      <div className={`relative w-full rounded-xs overflow-hidden border border-slate-300 bg-[#071322] ${isFullscreen ? 'flex-1 h-[calc(100vh-80px)]' : heightClass}`}>
        
        {/* Leaflet DOM Mounting Node */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Standard Map Controls Overlay (+ / - / Reset) */}
        <div className="absolute top-2 left-2 z-[400] flex flex-col space-y-1 bg-white border border-slate-300 rounded-xs shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-6 h-6 flex items-center justify-center text-slate-800 hover:bg-slate-100 border-b border-slate-200 font-bold text-xs"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-6 h-6 flex items-center justify-center text-slate-800 hover:bg-slate-100 border-b border-slate-200 font-bold text-xs"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Fit Antarctic Research Stations"
            className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 text-[10px]"
          >
            <Crosshair className="w-3 h-3" />
          </button>
        </div>

        {/* Live Active GIS Coordinates Indicator */}
        <div className="absolute top-2 right-2 z-[400] bg-slate-900/90 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-xs font-mono text-[9px] shadow-sm flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>CURSOR: {cursorCoords.lat}, {cursorCoords.lng}</span>
        </div>

        {/* ─── BOTTOM GIS LEGEND STRIP ─── */}
        <div className="absolute bottom-1 inset-x-1 z-[400] flex items-center justify-between bg-slate-950/90 text-slate-300 px-2 py-0.5 text-[9px] font-mono border border-slate-800 rounded-xs">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <strong className="text-slate-200 font-semibold">Maitri</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <strong className="text-slate-200 font-semibold">Bharati</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-cyan-400"></span>
              <span>Satellite Track</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-emerald-400"></span>
              <span>UAV Patrol</span>
            </span>
          </div>

          <div className="text-[8px] text-slate-400">
            WGS-84 / Polar Stereographic
          </div>
        </div>
      </div>
    </div>
  );
};
export default AntarcticRealMap;
