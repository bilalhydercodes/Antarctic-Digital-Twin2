import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { StationId } from '../types';
import { 
  Microscope, 
  Compass, 
  MapPin, 
  Mountain, 
  Zap, 
  Droplets, 
  Radio, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Activity, 
  Flame, 
  Wind, 
  Award,
  BookOpen,
  Calendar,
  Users,
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ScientificPayload {
  id: string;
  stationId: StationId;
  name: string;
  institute: string;
  instituteFull: string;
  discipline: 'ATMOSPHERIC' | 'GEOMAGNETISM' | 'SEISMOLOGY' | 'SPACE_WEATHER' | 'OCEANOGRAPHY' | 'GLACIOLOGY' | 'SATELLITE_COMMS';
  locationOnStation: string;
  measurement: string;
  samplingInterval: string;
  primaryObjective: string;
  status: 'OPERATIONAL' | 'CALIBRATING' | 'NOMINAL';
  technicalSpecs: string;
}

export const ResearchPage: React.FC = () => {
  const { activeStationId, setActiveStationId, aws, geomagnetic, atmospheric, seismic, environment } = useSimulation();
  
  const [selectedStation, setSelectedStation] = useState<StationId | 'all'>(activeStationId);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'payloads' | 'engineering' | 'logistics' | 'institutes'>('payloads');

  const scientificPayloads: ScientificPayload[] = [
    // --- MAITRI PAYLOADS ---
    {
      id: 'PAY-MTR-01',
      stationId: 'maitri',
      name: 'Brewer Spectrophotometer Mk-IV (Ozone Column)',
      institute: 'IMD',
      instituteFull: 'India Meteorological Department, New Delhi',
      discipline: 'ATMOSPHERIC',
      locationOnStation: 'Atmospheric Physics Roof Observatory',
      measurement: 'Total Column Ozone (Dobson Units), SO2, NO2 & Solar UV-B Flux',
      samplingInterval: 'Continuous daylight scans (15-min cadence)',
      primaryObjective: 'Continuous monitoring of the Antarctic springtime ozone hole depletion and multi-decadal recovery under Montreal Protocol.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Dual monochromator with quartz optics, automated zenith drive prism, heated weatherproof enclosure.'
    },
    {
      id: 'PAY-MTR-02',
      stationId: 'maitri',
      name: 'Proton Precession Magnetometer (PPM-105)',
      institute: 'IIG',
      instituteFull: 'Indian Institute of Geomagnetism, Navi Mumbai',
      discipline: 'GEOMAGNETISM',
      locationOnStation: 'Non-Magnetic Geomagnetic Hut (Isolated Moraine)',
      measurement: 'Total Earth Magnetic Field Intensity (F-component in nT)',
      samplingInterval: '1 Hz continuous recording',
      primaryObjective: 'Tracking geomagnetic secular variations, equatorial electrojet conjugacy, and auroral electrojet indices.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Kerosene-filled proton-rich sensor coil with low-noise toroidal pickup; baseline precision ±0.1 nT.'
    },
    {
      id: 'PAY-MTR-03',
      stationId: 'maitri',
      name: 'Digital Fluxgate Magnetometer (DFM Triaxial)',
      institute: 'IIG',
      instituteFull: 'Indian Institute of Geomagnetism, Navi Mumbai',
      discipline: 'GEOMAGNETISM',
      locationOnStation: 'Geomagnetic Variometer Vault',
      measurement: 'Vector Magnetic Field Components: X (North), Y (East), Z (Vertical)',
      samplingInterval: '10 Hz sampled, 1-second vector averages',
      primaryObjective: 'Real-time observation of geomagnetic substorms, solar flare magnetic effects, and magnetospheric wave-particle dynamics.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Ring-core fluxgate sensors enclosed in thermally insulated non-magnetic ceramic chamber (±0.05°C temperature regulation).'
    },
    {
      id: 'PAY-MTR-04',
      stationId: 'maitri',
      name: 'Broadband Digital Seismograph (Guralp CMG-3T)',
      institute: 'NGRI',
      instituteFull: 'National Geophysical Research Institute, CSIR Hyderabad',
      discipline: 'SEISMOLOGY',
      locationOnStation: 'Seismic Vault (Solid Bedrock Granite Foundation)',
      measurement: '3-Component Ground Velocity (Broadband 0.01 Hz to 50 Hz)',
      samplingInterval: '100 samples/sec continuous 24-bit digitization',
      primaryObjective: 'Global seismic wave detection, Antarctic intra-plate seismicity, and East Antarctic crustal thickness tomographic inversion.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Force-balance broadband sensor locked on solid granite bedrock; GPS time-tagged via Trimble atomic sync receiver.'
    },
    {
      id: 'PAY-MTR-05',
      stationId: 'maitri',
      name: 'Continuous Geodetic GPS/GNSS Receiver',
      institute: 'NGRI / Survey of India',
      instituteFull: 'National Geophysical Research Institute & Survey of India',
      discipline: 'SEISMOLOGY',
      locationOnStation: 'Geodetic Pillar (Bedrock Benchmark MTR-01)',
      measurement: '3D Precise Geodetic Position & Ionospheric Total Electron Content (TEC)',
      samplingInterval: '30-second epoch Rinex logging + 1 Hz high-rate stream',
      primaryObjective: 'Quantifying continental plate motion (verifying ~1.5 cm/year Indian Plate northward drift relative to Antarctica).',
      status: 'OPERATIONAL',
      technicalSpecs: 'Choke-ring antenna with Dorne-Margolin element; immune to multipath snow reflection errors.'
    },
    {
      id: 'PAY-MTR-06',
      stationId: 'maitri',
      name: 'Solid-State Cosmic Noise Riometer (30 MHz)',
      institute: 'NPL',
      instituteFull: 'CSIR - National Physical Laboratory, New Delhi',
      discipline: 'SPACE_WEATHER',
      locationOnStation: 'Upper Atmosphere Riometer Antenna Yard',
      measurement: 'Relative Ionospheric Cosmic Noise Absorption (dB)',
      samplingInterval: 'Continuous real-time (0.1 Hz telemetry)',
      primaryObjective: 'Detecting solar proton events (SPE), D-region ionospheric polar cap absorption (PCA), and high-latitude radio blackouts.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Wide-beam 4-element cross-dipole array centered at 30.0 MHz; noise temperature calibrated against galactic radio background.'
    },
    {
      id: 'PAY-MTR-07',
      stationId: 'maitri',
      name: 'Atmospheric Electric Field Mill (EFM) & Maxwell Antenna',
      institute: 'IIG',
      instituteFull: 'Indian Institute of Geomagnetism, Navi Mumbai',
      discipline: 'SPACE_WEATHER',
      locationOnStation: 'Atmospheric Electricity Mast (Ice Margin)',
      measurement: 'Vertical Atmospheric Potential Gradient (V/m) & Conduction Current',
      samplingInterval: '10 Hz continuous telemetry',
      primaryObjective: 'Investigating the Global Electric Circuit (GEC), polar thunderstorm activity coupling, and auroral electric field perturbations.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Rotating shutter field mill calibrated for sub-zero blizzards with integral heating mantle.'
    },
    {
      id: 'PAY-MTR-08',
      stationId: 'maitri',
      name: 'Lake Priyadarshini Limnological Monitoring Array',
      institute: 'NCPOR / SIOM',
      instituteFull: 'National Centre for Polar and Ocean Research, Goa',
      discipline: 'GLACIOLOGY',
      locationOnStation: 'Priyadarshini Lake Freshwater Pumping Station & Pier',
      measurement: 'Water Column Temperature Profile, Dissolved Oxygen, Turbidity & Microbial Biomass',
      samplingInterval: 'Hourly automated sensor string + seasonal core extraction',
      primaryObjective: 'Paleoclimate environmental reconstruction via lake sediment varves and benthic microbial mat ecosystems.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Multiparameter submersible CTD probe tethered in deep basin (28m depth) below winter ice cover.'
    },

    // --- BHARATI PAYLOADS ---
    {
      id: 'PAY-BHR-01',
      stationId: 'bharati',
      name: 'ISRO Dual-Tracking Polar Satellite Earth Station',
      institute: 'ISRO / NRSC',
      instituteFull: 'National Remote Sensing Centre, ISRO Hyderabad',
      discipline: 'SATELLITE_COMMS',
      locationOnStation: 'Dual Aerodynamic Radome Deck (Station Roof Top)',
      measurement: 'Real-time X-Band / S-Band Remote Sensing Data Acquisition & Relay',
      samplingInterval: 'Scheduled pass tracking (12-14 polar orbits per day)',
      primaryObjective: 'Acquiring high-resolution Earth observation imagery from Indian polar satellites (Resourcesat-2, Cartosat, Oceansat-2, RISAT-1) and near real-time retransmission to NRSC Shadnagar.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Dual 7.5-meter high-gain parabolic tracking dishes protected inside heated fiberglass dielectric radomes.'
    },
    {
      id: 'PAY-BHR-02',
      stationId: 'bharati',
      name: 'Coastal AWS & Boundary Layer Sonic Anemometer',
      institute: 'IMD',
      instituteFull: 'India Meteorological Department, New Delhi',
      discipline: 'ATMOSPHERIC',
      locationOnStation: 'Coastal Promontory Meteorology Ridge',
      measurement: '3D Wind Velocity, Barometric Pressure, Relative Humidity & Solar Radiation',
      samplingInterval: 'Continuous 1-minute averaged synoptic telemetry',
      primaryObjective: 'Synoptic weather forecasting for Larsemann Hills aviation logistics and studying coastal katabatic wind interactions with Prydz Bay marine boundary layer.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Ultrasonic 3D anemometer with internal transducer heating (prevents riming up to -40°C).'
    },
    {
      id: 'PAY-BHR-03',
      stationId: 'bharati',
      name: 'Prydz Bay Physical Oceanography & Biogeochemistry Lab',
      institute: 'NCPOR',
      instituteFull: 'National Centre for Polar and Ocean Research, Goa',
      discipline: 'OCEANOGRAPHY',
      locationOnStation: 'Ground Floor Wet Marine Biology Laboratory',
      measurement: 'Sea Surface Salinity, Nutrients (Nitrate/Phosphate), Chlorophyll-a & Phytoplankton Diversity',
      samplingInterval: 'Daily automated seawater flow-through sensor + seasonal CTD casts',
      primaryObjective: 'Long-term quantification of Southern Ocean carbon sink capacity and Antarctic krill (Euphausia superba) food web dynamics under warming sea-ice regimes.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Benchtop fluorometers, spectrophotometers, and continuous underway thermosalinograph tapped into station seawater intake.'
    },
    {
      id: 'PAY-BHR-04',
      stationId: 'bharati',
      name: 'Triaxial Fluxgate Magnetometer & All-Sky Auroral Imager',
      institute: 'IIG',
      instituteFull: 'Indian Institute of Geomagnetism, Navi Mumbai',
      discipline: 'GEOMAGNETISM',
      locationOnStation: 'Larsemann Hills Non-Magnetic Sensor Hut',
      measurement: 'Magnetic H, D, Z Field Components & 557.7 nm / 630.0 nm Auroral Optical Emissions',
      samplingInterval: '1 Hz magnetic + 30-second CCD sky exposures',
      primaryObjective: 'Dual-station magnetic correlation with Maitri across a 3,000 km baseline to investigate polar cusp dynamics and substorm propagation.',
      status: 'OPERATIONAL',
      technicalSpecs: 'Cooled EMCCD camera with fish-eye lens (180° FOV) and narrow-band optical interference filter wheel.'
    }
  ];

  // Filtering
  const filteredPayloads = scientificPayloads.filter(p => {
    const matchesStation = selectedStation === 'all' || p.stationId === selectedStation;
    const matchesDiscipline = selectedDiscipline === 'ALL' || p.discipline === selectedDiscipline;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institute.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.instituteFull.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryObjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.measurement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStation && matchesDiscipline && matchesSearch;
  });

  const disciplines = [
    { id: 'ALL', label: 'All Disciplines' },
    { id: 'ATMOSPHERIC', label: 'Atmospheric & Ozone' },
    { id: 'GEOMAGNETISM', label: 'Geomagnetism' },
    { id: 'SEISMOLOGY', label: 'Seismology & GNSS' },
    { id: 'SPACE_WEATHER', label: 'Space Weather' },
    { id: 'SATELLITE_COMMS', label: 'Satellite Earth Station' },
    { id: 'OCEANOGRAPHY', label: 'Oceanography & Marine' },
    { id: 'GLACIOLOGY', label: 'Glaciology & Lakes' }
  ];

  const partnerInstitutes = [
    {
      acronym: 'NCPOR',
      name: 'National Centre for Polar and Ocean Research',
      city: 'Vasco da Gama, Goa',
      role: 'Nodal Autonomous Institution under MoES managing the Indian Antarctic Research Programme (ISEA), logistics, icebreaker charters, and overall expedition operations.',
      leadPrograms: ['Indian Scientific Expedition to Antarctica (ISEA)', 'Polar Biology & Biogeochemistry', 'Cryosphere & Glaciology', 'Station Operations Management']
    },
    {
      acronym: 'MoES',
      name: 'Ministry of Earth Sciences, Government of India',
      city: 'New Delhi',
      role: 'Apex Union Ministry providing executive governance, policy mandates, sovereign polar funding, and diplomatic representation at the Antarctic Treaty Consultative Meetings (ATCM).',
      leadPrograms: ['Antarctic Treaty System (ATS) Compliance', 'Madrid Protocol Environmental Audits', 'Deep Ocean Mission', 'National Polar Strategy']
    },
    {
      acronym: 'IMD',
      name: 'India Meteorological Department',
      city: 'New Delhi & Pune',
      role: 'Pioneering scientific institution at Maitri since 1988 maintaining ozone column observations and synoptic polar meteorological forecasting.',
      leadPrograms: ['Brewer Ozone Spectrophotometer', 'Surface Automatic Weather Stations (AWS)', 'Radiosonde Upper-Air Sounding', 'UV-B Biologically Active Radiation Monitoring']
    },
    {
      acronym: 'IIG',
      name: 'Indian Institute of Geomagnetism',
      city: 'Navi Mumbai',
      role: 'Operates continuous magnetic observatories at both Maitri and Bharati recording Earth’s dynamic geospace environment.',
      leadPrograms: ['Proton Precession Magnetometer (PPM)', 'Triaxial Digital Fluxgate (DFM)', 'Atmospheric Electric Field Mill (EFM)', 'All-Sky Auroral Imaging']
    },
    {
      acronym: 'NGRI',
      name: 'National Geophysical Research Institute (CSIR)',
      city: 'Hyderabad',
      role: 'Performs solid Earth geophysics, broadband seismology, and geodetic GPS measurements confirming continental plate kinematics.',
      leadPrograms: ['Bedrock Broadband Seismometer (Guralp CMG-3T)', 'Permanent Geodetic GPS Pillar (MTR-01)', 'Lithospheric Crustal Structure Imaging']
    },
    {
      acronym: 'ISRO / NRSC',
      name: 'National Remote Sensing Centre, Indian Space Research Organisation',
      city: 'Hyderabad & Shadnagar',
      role: 'Constructed and operates India’s high-latitude Satellite Ground Earth Station at Bharati Station with dual tracking radomes.',
      leadPrograms: ['Resourcesat-2 / 2A Telemetry', 'Cartosat Series High-Resolution Imagery', 'Oceansat-2 / 3 Ocean Color Passes', 'Direct Polar Relay to Shadnagar IMGEOS']
    },
    {
      acronym: 'NPL',
      name: 'National Physical Laboratory (CSIR)',
      city: 'New Delhi',
      role: 'Investigates ionospheric absorption, radio wave propagation, and cosmic noise interactions at high geomagnetic latitudes.',
      leadPrograms: ['30 MHz Solid-State Riometer Array', 'VLF Radio Receiver', 'Greenhouse Gas Standards Calibration']
    },
    {
      acronym: 'GSI',
      name: 'Geological Survey of India',
      city: 'Kolkata & Faridabad',
      role: 'Pioneered early geological mapping of Queen Maud Land and Schirmacher Oasis, studying granulite facies metamorphism and Gondwana connections.',
      leadPrograms: ['Bedrock Geologic Mapping', 'Moraine Sedimentology', 'Permafrost Core Thermal Profiling']
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ── 1. OFFICIAL MOES & NCPOR HEADER BANNER ── */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex items-center justify-center shrink-0 shadow-md border border-blue-800">
            <Award className="w-8 h-8 text-cyan-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 uppercase tracking-wider">
                GOVERNMENT OF INDIA • MOES
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>ATCP (1983) • MADRID PROTOCOL COMPLIANT</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                NCPOR #26060
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Official NCPOR Antarctic Research & Scientific Payloads Suite
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Official technical specifications, physical instruments, and institutional mandates of the Indian Antarctic Research Programme across <strong>Maitri Station (IN-MTR-01)</strong> and <strong>Bharati Station (IN-BHR-02)</strong>, verified against Ministry of Earth Sciences records.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#f8f7f4] hover:bg-[#edebe4] text-stone-800 font-bold text-xs border border-[#e5e3dc] transition shadow-sm"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Export Official SITREP</span>
          </button>
        </div>
      </div>

      {/* ── 2. STATION OVERVIEW CARDS (OFFICIAL PROFILES) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MAITRI CARD */}
        <div 
          onClick={() => { setSelectedStation('maitri'); setActiveStationId('maitri'); }}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative overflow-hidden ${
            selectedStation === 'maitri' || activeStationId === 'maitri'
              ? 'bg-gradient-to-br from-blue-50/90 via-white to-white border-blue-400 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white border-[#e5e3dc] hover:border-blue-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-700 text-white shadow-sm">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-black text-stone-900">MAITRI RESEARCH STATION</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    IN-MTR-01
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">
                  Schirmacher Oasis, Queen Maud Land
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Established</span>
              <strong className="text-stone-900 text-sm font-sans">Dec 1988</strong>
              <span className="text-[9px] text-stone-500 block font-sans">Op. Jan 1989</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Elevation</span>
              <strong className="text-blue-700 text-sm font-sans">~50 m ASL</strong>
              <span className="text-[9px] text-stone-500 block font-sans">Lake Moraine</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Crew Capacity</span>
              <strong className="text-stone-900 text-sm font-sans">47 Base / 72 Cap</strong>
              <span className="text-[9px] text-stone-500 block font-sans">+25 Summer Huts</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Water Supply</span>
              <strong className="text-cyan-700 text-xs font-sans">Lake Priyadarshini</strong>
              <span className="text-[9px] text-stone-500 block font-sans">Trace Heated</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#f0eee6] flex items-center justify-between text-xs text-stone-600">
            <span className="font-mono text-[11px]">70° 45' 52" S, 11° 44' 03" E (-70.7644°, 11.7342°)</span>
            <span className="font-bold text-blue-700 flex items-center gap-1">
              <span>View Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* BHARATI CARD */}
        <div 
          onClick={() => { setSelectedStation('bharati'); setActiveStationId('bharati'); }}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative overflow-hidden ${
            selectedStation === 'bharati' || activeStationId === 'bharati'
              ? 'bg-gradient-to-br from-indigo-50/90 via-white to-white border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white border-[#e5e3dc] hover:border-indigo-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-700 text-white shadow-sm">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-black text-stone-900">BHARATI RESEARCH STATION</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    IN-BHR-02
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">
                  Grovness Peninsula, Larsemann Hills
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Established</span>
              <strong className="text-stone-900 text-sm font-sans">18 Mar 2012</strong>
              <span className="text-[9px] text-stone-500 block font-sans">31st ISEA</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Elevation</span>
              <strong className="text-indigo-700 text-sm font-sans">~35 m ASL</strong>
              <span className="text-[9px] text-stone-500 block font-sans">Coastal Promontory</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Crew Capacity</span>
              <strong className="text-stone-900 text-sm font-sans">47 Main / 72 Cap</strong>
              <span className="text-[9px] text-stone-500 block font-sans">134 ISO Containers</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e3dc]">
              <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">Life-Support</span>
              <strong className="text-indigo-700 text-xs font-sans">CHP + Seawater RO</strong>
              <span className="text-[9px] text-stone-500 block font-sans">185 kW Heat Recov</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#f0eee6] flex items-center justify-between text-xs text-stone-600">
            <span className="font-mono text-[11px]">69° 24.41' S, 76° 11.72' E (-69.4070°, 76.1950°)</span>
            <span className="font-bold text-indigo-700 flex items-center gap-1">
              <span>View Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* ── 3. NAVIGATION SECTION TABS ── */}
      <div className="bg-white rounded-2xl p-2 border border-[#e5e3dc] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('payloads')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'payloads'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Microscope className="w-4 h-4" />
            <span>Scientific Payloads & Observatories ({filteredPayloads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('engineering')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'engineering'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Engineering & Life-Support Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'logistics'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Expedition Logistics & Madrid Protocol</span>
          </button>

          <button
            onClick={() => setActiveTab('institutes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'institutes'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>MoES Partner Research Institutes</span>
          </button>
        </div>

        {/* Station filter pills */}
        <div className="flex items-center space-x-1 bg-[#f8f7f4] p-1 rounded-xl border border-[#e5e3dc] text-xs font-bold">
          <button
            onClick={() => setSelectedStation('all')}
            className={`px-3 py-1 rounded-lg transition ${
              selectedStation === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Both Stations
          </button>
          <button
            onClick={() => setSelectedStation('maitri')}
            className={`px-3 py-1 rounded-lg transition ${
              selectedStation === 'maitri' ? 'bg-blue-600 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Maitri Only
          </button>
          <button
            onClick={() => setSelectedStation('bharati')}
            className={`px-3 py-1 rounded-lg transition ${
              selectedStation === 'bharati' ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Bharati Only
          </button>
        </div>
      </div>

      {/* ── TAB 1: SCIENTIFIC PAYLOADS & OBSERVATORIES ── */}
      {activeTab === 'payloads' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-4 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scientific payload, institute, or parameter..."
                className="w-full pl-10 pr-4 py-2 bg-[#f8f7f4] border border-[#e5e3dc] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {disciplines.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDiscipline(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedDiscipline === d.id
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payloads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPayloads.map(payload => {
              const isMaitri = payload.stationId === 'maitri';
              return (
                <div 
                  key={payload.id}
                  className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#eceae2]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isMaitri ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {payload.stationId.toUpperCase()} • {payload.discipline}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-stone-100 text-stone-700 font-mono">
                            {payload.id}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-stone-900 mt-2">
                          {payload.name}
                        </h3>
                        <p className="text-xs font-semibold text-blue-700 mt-0.5">
                          {payload.institute} • <span className="text-stone-500 font-normal">{payload.instituteFull}</span>
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        {payload.status}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-stone-700 mt-4">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">Physical Vault / Location</span>
                        <div className="flex items-center space-x-1.5 text-stone-800 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{payload.locationOnStation}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">Measurement Parameters</span>
                        <div className="font-mono text-stone-900 bg-[#f8f7f4] p-2 rounded-lg border border-[#e5e3dc] text-[11px]">
                          {payload.measurement}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">Primary Scientific Objective</span>
                        <p className="text-stone-600 leading-relaxed text-xs">
                          {payload.primaryObjective}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">Technical Architecture</span>
                        <p className="text-stone-500 text-[11px] font-mono bg-stone-50 p-2 rounded-lg border border-stone-200">
                          {payload.technicalSpecs}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f0eee6] flex items-center justify-between text-[11px] text-stone-500">
                    <span>Cadence: <strong>{payload.samplingInterval}</strong></span>
                    <span className="font-semibold text-blue-700">Official NCPOR Sensor Registry</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: ENGINEERING & LIFE SUPPORT ARCHITECTURE ── */}
      {activeTab === 'engineering' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-stone-900">
              Official NCPOR Engineering & Life-Support Architecture Matrix
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Direct technical comparison of power plants, water generation, heating distribution, and Madrid Protocol waste management.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-500 uppercase text-[10px]">
                  <th className="py-3 px-4 w-1/4">Subsystem Parameter</th>
                  <th className="py-3 px-4 text-blue-900 w-3/8 font-black">Maitri Research Station (IN-MTR-01)</th>
                  <th className="py-3 px-4 text-indigo-900 w-3/8 font-black">Bharati Research Station (IN-BHR-02)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceae2] font-sans">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Commissioning Date</td>
                  <td className="py-3.5 px-4 text-stone-700">December 1988 (Commissioned January 1989)</td>
                  <td className="py-3.5 px-4 text-stone-700">18 March 2012 (31st Indian Scientific Expedition)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Geographic Setting</td>
                  <td className="py-3.5 px-4 text-stone-700">Schirmacher Oasis inland ice-free rocky oasis</td>
                  <td className="py-3.5 px-4 text-stone-700">Grovness Peninsula coastal promontory, Larsemann Hills</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Official Coordinates</td>
                  <td className="py-3.5 px-4 font-mono text-stone-800">70° 45' 52" S, 11° 44' 03" E (-70.7644°, 11.7342°)</td>
                  <td className="py-3.5 px-4 font-mono text-stone-800">69° 24.41' S, 76° 11.72' E (-69.4070°, 76.1950°)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Elevation Profile</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-700">~50 m above sea level (Verified NCPOR Profile)</td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-700">~35 m above sea level</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Superstructure Design</td>
                  <td className="py-3.5 px-4 text-stone-700">Main building mounted on structural steel stilts over moraine + containerized modules</td>
                  <td className="py-3.5 px-4 text-stone-700">Aerodynamic bi-axial envelope enclosing 134 ISO containers on high-tensile steel stilts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Living Capacity</td>
                  <td className="py-3.5 px-4 text-stone-700">47 living base in main complex + 25 summer camp = <strong>72 maximum capacity</strong></td>
                  <td className="py-3.5 px-4 text-stone-700">47 berths in main complex (twin sharing) + 25 summer camp = <strong>72 maximum capacity</strong></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Power Generation Architecture</td>
                  <td className="py-3.5 px-4 text-stone-700">3 × Kirloskar Diesel GenSets (62.5–125 kVA) + 45 kW Solar PV + 35 kW Wind Turbines</td>
                  <td className="py-3.5 px-4 text-stone-700">3 × 100 kVA Combined Heat & Power (CHP) units on Jet A-1 / DMA + 2 × 60 kVA UPS</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Thermal Co-Generation</td>
                  <td className="py-3.5 px-4 text-stone-700">Hydronic diesel boilers + jacket heat recovery</td>
                  <td className="py-3.5 px-4 text-stone-700 font-semibold text-emerald-700">185 kW thermal waste-heat recovery loop (+28% overall fuel efficiency)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Potable Water Sourcing</td>
                  <td className="py-3.5 px-4 text-stone-700">Lake Priyadarshini freshwater lake submersible pump house with electrically trace-heated pipeline (+2°C to +4°C)</td>
                  <td className="py-3.5 px-4 text-stone-700">Seawater Reverse Osmosis (RO) desalination plant drawing from Prydz Bay via sub-sea heated intake pipeline</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Satellite Ground Station</td>
                  <td className="py-3.5 px-4 text-stone-700">Dedicated VSAT Ka-band link to ISRO/NRSC Hyderabad + Inmarsat / Iridium</td>
                  <td className="py-3.5 px-4 text-stone-700 font-semibold text-indigo-800">ISRO Dual-Tracking 7.5m Radome Earth Station receiving Resourcesat, Cartosat, Oceansat, RISAT</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-stone-900">Madrid Protocol Compliance</td>
                  <td className="py-3.5 px-4 text-stone-700">Bio-digestive sewage treatment; 100% solid & hazardous waste retrograded to India</td>
                  <td className="py-3.5 px-4 text-stone-700">Bioreactor wastewater plant; greywater recycled for sanitary flush; 100% solid waste retrograded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: EXPEDITION LOGISTICS & MADRID PROTOCOL ── */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-700 w-fit">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Crew Autonomy & Deployment</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Expeditions are organized annually under the <strong>Indian Scientific Expedition to Antarctica (ISEA)</strong> by NCPOR. Wintering teams comprise ~23 to 25 scientists, medical doctors, and logistics engineers deployed for 14-month continuous tours. During polar summer (November–March), occupancy expands to 72 personnel.
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500 border-t border-stone-100">
                Medical: High-latitude surgical theater & telemedicine uplink.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Maritime Supply Voyages</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Logistics support is sustained via chartered ice-class cargo vessels (e.g. <strong>MV Vasiliy Golovnin</strong>) sailing annually from Cape Town, South Africa to Queen Maud Land (India Bay fast-ice edge for Maitri) and Prydz Bay (Quilty Bay anchorage for Bharati). Heavy fuel and cargo are transferred by Kamov Ka-32 helicopters and PistenBully snow-cats.
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500 border-t border-stone-100">
                Aviation: DROMLAN intercontinental flights via ALCI Cape Town.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-stone-900">Madrid Protocol Environmental Law</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                India enforces strict adherence to the <strong>Protocol on Environmental Protection to the Antarctic Treaty (Madrid Protocol)</strong>:
                Zero disposal of toxic or non-biodegradable waste on the continent. All solid wastes, batteries, laboratory chemicals, and generator oil are segregated, containerized, and retrograded to mainland India for licensed disposal.
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500 border-t border-stone-100">
                Heritage: Dakshin Gangotri (1983-1990) protected as historical site.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 4: PARTNER RESEARCH INSTITUTES ── */}
      {activeTab === 'institutes' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-stone-900">
              National Scientific Collaborators & Institutional Consortia
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Autonomous national institutes, defense research laboratories, and university departments active in the Indian Antarctic Research Programme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerInstitutes.map(inst => (
              <div 
                key={inst.acronym}
                className="p-5 rounded-2xl bg-[#f8f7f4] border border-[#e5e3dc] space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-black text-xs tracking-wider">
                      {inst.acronym}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {inst.city}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-black text-stone-900">
                  {inst.name}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {inst.role}
                </p>

                <div className="pt-2 border-t border-[#eceae2]">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Lead Research Programs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inst.leadPrograms.map((prog, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white border border-stone-200 text-stone-700 font-medium">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
