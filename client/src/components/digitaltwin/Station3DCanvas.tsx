import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Maitri3DCanvas } from './Maitri3DCanvas';
import { Bharati3DCanvas } from './Bharati3DCanvas';

export const Station3DCanvas: React.FC = () => {
  const { activeStationId } = useSimulation();

  return activeStationId === 'maitri' ? <Maitri3DCanvas /> : <Bharati3DCanvas />;
};

export default Station3DCanvas;
