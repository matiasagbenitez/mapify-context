import { useContext, useLayoutEffect, useRef } from "react";
import { MapContext, PlacesContext } from "../context";
import { LoadingSpinner } from "./spinner/LoadingSpinner";
import { Map } from "mapbox-gl";

export const MapView = () => {
  const { isLoading, userLocation } = useContext(PlacesContext);
  const { setMap } = useContext(MapContext);
  const mapDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!userLocation || !mapDiv.current) return;

    const map = new Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 12,
    });

    if (map) setMap(map);
  }, [userLocation]);

  if (isLoading) {
    return (
      <div className="text-center my-3">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div
        ref={mapDiv}
        style={{
          backgroundColor: "lightgray",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />
    </>
  );
};
