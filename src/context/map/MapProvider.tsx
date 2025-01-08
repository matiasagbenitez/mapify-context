import { useContext, useEffect, useReducer } from "react";
import {
  LngLatBounds,
  Map,
  Marker,
  Popup,
  SourceSpecification,
} from "mapbox-gl";

import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";
import { PlacesContext } from "../places/PlacesContext";
import { directionsApi } from "../../apis";
import { DirectionsResponse } from "../../interfaces";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
  markers: Marker[];
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  markers: [],
};

interface ChildProps {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: ChildProps) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

  const { places } = useContext(PlacesContext);

  useEffect(() => {
    state.markers.forEach((marker) => marker.remove());
    const newMarkers: Marker[] = [];
    for (const place of places) {
      const marker = new Marker({ color: "#0D6EFD" })
        .setLngLat([place.center[0], place.center[1]])
        .setPopup(new Popup().setHTML(`<b>${place.place_name_es}</b>`));
      newMarkers.push(marker);
      marker.addTo(state.map!);
    }
    dispatch({ type: "SET_MARKERS", payload: newMarkers });
  }, [places]);

  const setMap = (map: Map) => {
    new Marker({ color: "#DC3545" })
      .setLngLat(map.getCenter())
      .setPopup(new Popup().setHTML(`<b>Your current location</b>`))
      .addTo(map);
    dispatch({ type: "SET_MAP", payload: map });
  };

  const getRoutesBetweenPlaces = async (
    origin: [number, number],
    destination: [number, number]
  ) => {
    const url = `/${origin.join(",")};${destination.join(",")}`;
    const response = await directionsApi.get<DirectionsResponse>(url);

    const { distance, duration, geometry } = response.data.routes[0];
    let kms = distance / 1000;
    kms = Math.round(kms * 100) / 100;

    const minutes = Math.floor(duration / 60);
    console.log(`Distance: ${kms} km, Duration: ${minutes} minutes`);

    const { coordinates } = geometry;
    const bounds = new LngLatBounds(origin, origin);

    for (const coord of coordinates) {
      const newCoord: [number, number] = [coord[0], coord[1]];
      bounds.extend(newCoord);
    }

    // Acomoda el mapa para que se vean los dos puntos
    state.map!.fitBounds(bounds, { padding: 100 });

    // Dibuja la ruta
    const sourceData: SourceSpecification = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        ],
      },
    };

    // Eliminar polylines si ya existen
    if (state.map!.getSource("route")) {
      state.map!.removeLayer("route");
      state.map!.removeSource("route");
    }

    state.map!.addSource("route", sourceData);
    state.map!.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0D6EFD",
        "line-width": 8,
      },
    });
  };

  return (
    <MapContext.Provider value={{ ...state, setMap, getRoutesBetweenPlaces }}>
      {children}
    </MapContext.Provider>
  );
};
