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
import { DirectionsResponse, Feature } from "../../interfaces";
import { getDuration } from "../../helpers";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
  style: string;
  markers: Marker[];
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  style: "mapbox://styles/mapbox/streets-v11",
  markers: [],
};

interface ChildProps {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: ChildProps) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

  const { places, replaceDestination, destinations } = useContext(PlacesContext);

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

  useEffect(() => {
    // Si no hay lugares, eliminar polylines
    if (places.length === 0) {
      removeRoute();
    }
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

    if (response.data.code !== "Ok") return;

    const { distance, duration, geometry } = response.data.routes[0];
    let kms = distance / 1000;
    kms = Math.round(kms * 100) / 100;

    const minutes = Math.floor(duration / 60);

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
    removeRoute();

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

    // Añadir un popup con la información de la ruta
    new Popup()
      .addClassName("popupRoute")
      .setLngLat(destination)
      .setHTML(
        `<b>Distance:</b> ${kms} km<br><b>Duration:</b> ${getDuration(minutes)}`
      )
      .addTo(state.map!);
  };

  const toggleStyle = () => {
    const newStyle =
      state.style === "mapbox://styles/mapbox/streets-v11"
        ? "mapbox://styles/mapbox/satellite-streets-v11"
        : "mapbox://styles/mapbox/streets-v11";
        state.map!.setStyle(newStyle);
    dispatch({ type: "SET_STYLE", payload: newStyle });
  };

  const removeRoute = () => {
    if (!state.map) return;
    if (state.map!.getLayer("route")) {
      state.map!.removeLayer("route");
      state.map!.removeSource("route");
      const popup = document.querySelector(".popupRoute");
      if (popup) {
        popup.remove();
      }
    }
  };

  const replaceDestinationLocal = (
    oldDestination: Feature,
    newDestination: Feature
  ) => {
    removeRoute();
    replaceDestination(oldDestination, newDestination);
    const place1 = destinations.find((place) => place.id === oldDestination.id);
    const place2 = destinations.find((place) => place.id === newDestination.id);
    if (!place1 || !place2) return;
    const coords1 = place1.geometry.coordinates as [number, number];
    const coords2 = place2.geometry.coordinates as [number, number];
    getRoutesBetweenPlaces(coords1, coords2);
  }

  useEffect(() => {
    if (destinations.length === 2) {
      const place1 = destinations[0];
      const place2 = destinations[1];
      const coords1 = place1.geometry.coordinates as [number, number];
      const coords2 = place2.geometry.coordinates as [number, number];
      getRoutesBetweenPlaces(coords1, coords2);
    }
  }, [destinations]);

  return (
    <MapContext.Provider
      value={{
        ...state,
        setMap,
        getRoutesBetweenPlaces,
        removeRoute,
        toggleStyle,
        replaceDestinationLocal,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
