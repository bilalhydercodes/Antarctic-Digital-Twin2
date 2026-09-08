import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { NavTab } from '../../types';
import { Maitri3DCanvas } from './Maitri3DCanvas';
import { Bharati3DCanvas } from './Bharati3DCanvas';

interface Station3DCanvasProps {
  onNavigate?: (tab: NavTab) => void;
}

export const Station3DCanvas: React.FC<Station3DCanvasProps> = ({ onNavigate }) => {
  const { activeStationId } = useSimulation();

  return activeStationId === 'maitri' ? (
    <Maitri3DCanvas onNavigate={onNavigate} />
  ) : (
    <Bharati3DCanvas onNavigate={onNavigate} />
  );
};

export default Station3DCanvas;
