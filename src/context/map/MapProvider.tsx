import { useReducer } from "react";
import { Map, Marker, Popup } from "mapbox-gl";

import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
};

interface ChildProps {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: ChildProps) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

  const setMap = (map: Map) => {
      new Marker({ color: "#DC3545" })
        .setLngLat(map.getCenter())
        .setPopup(new Popup().setHTML(`<b>Tu ubicación actual</b>`))
        .addTo(map);
    dispatch({ type: "SET_MAP", payload: map });
  };

  return (
    <MapContext.Provider value={{ ...state, setMap }}>
      {children}
    </MapContext.Provider>
  );
};
