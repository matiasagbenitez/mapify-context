import { useContext } from "react";
import { MapContext, PlacesContext } from "../context";

export const MyLocationButton = () => {
  const { map, isMapReady } = useContext(MapContext);
  const { userLocation } = useContext(PlacesContext);

  const onClick = () => {
    if (!isMapReady || !userLocation || !map) return;
    map.flyTo({ zoom: 12, center: userLocation });
  };
  
  return (
    <button
      className="btn btn-primary btn-sm fw-bold"
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        zIndex: 999,
      }}
      onClick={onClick}
    >
      My location
    </button>
  );
};
