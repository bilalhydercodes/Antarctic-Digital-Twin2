import React from 'react';
import { AntarcticRealMap } from './AntarcticRealMap';
import { StationId } from '../../types';

interface Antarctic2DMapProps {
  onOpenDigitalTwin?: (stationId: StationId) => void;
  heightClass?: string;
}

export const Antarctic2DMap: React.FC<Antarctic2DMapProps> = ({ 
  onOpenDigitalTwin,
  heightClass = 'h-[500px]'
}) => {
  return (
    <div className="w-full h-full font-sans">
      <AntarcticRealMap 
        onSelectStation={(id) => onOpenDigitalTwin && onOpenDigitalTwin(id)}
        heightClass={heightClass}
      />
    </div>
  );
};

export default Antarctic2DMap;
