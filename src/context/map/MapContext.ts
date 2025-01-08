import { createContext } from "react";
import { Map } from "mapbox-gl";

export interface MapContextProps {
    isMapReady: boolean;
    map?: Map;
    setMap: (map: Map) => void;
}

export const MapContext = createContext<MapContextProps>({} as MapContextProps);