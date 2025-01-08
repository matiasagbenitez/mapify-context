import { createContext } from "react";
import { Map } from "mapbox-gl";

export interface MapContextProps {
    isMapReady: boolean;
    map?: Map;
    style: string;
    setMap: (map: Map) => void;
    getRoutesBetweenPlaces: (origin: [number, number], destination: [number, number]) => Promise<void>;
    removeRoute: () => void;
    toggleStyle: () => void;
}

export const MapContext = createContext<MapContextProps>({} as MapContextProps);