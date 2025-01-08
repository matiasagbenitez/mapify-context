import { useContext } from "react";
import { MapContext, PlacesContext } from "../context";

export const ButtonsToolbar = () => {
  const { map, isMapReady, toggleStyle, style } = useContext(MapContext);
  const { userLocation } = useContext(PlacesContext);

  const goHome = () => {
    if (!isMapReady || !userLocation || !map) return;
    map.flyTo({ zoom: 12, center: userLocation, pitch: 0, bearing: 0 });
  };

  const resetPosition = () => {
    if (!isMapReady || !map) return;
    map.flyTo({ pitch: 0, bearing: 0 });
  };

  const onZoomIn = () => {
    if (!isMapReady || !map) return;
    map.zoomIn();
  };

  const onZoomOut = () => {
    if (!isMapReady || !map) return;
    map.zoomOut();
  };

  const toggleMapStyle = () => {
    if (!isMapReady || !map) return;
    toggleStyle();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        zIndex: 999,
      }}
    >
      <div className="d-flex flex-column gap-2">
        <div className="btn-group-vertical" role="group">
          <button
            title="Go home"
            className="btn btn-light btn-sm fw-bold"
            onClick={goHome}
          >
            <i className="bi bi-house-door fs-6"></i>
          </button>

          <button
            title="Reset position"
            className="btn btn-light btn-sm fw-bold fs-6"
            onClick={resetPosition}
          >
            <i className="bi bi-compass fs-6"></i>
          </button>
        </div>

        <div className="btn-group-vertical" role="group">
          <button
            title="Zoom in"
            className="btn btn-light btn-sm fw-bold fs-6"
            onClick={onZoomIn}
          >
            <i className="bi bi-zoom-in"></i>
          </button>
          <button
            title="Zoom out"
            className="btn btn-light btn-sm fw-bold fs-6"
            onClick={onZoomOut}
          >
            <i className="bi bi-zoom-out"></i>
          </button>
        </div>

        <button
          title="Toggle map style"
          className="btn btn-light btn-sm fw-bold fs-6"
          onClick={toggleMapStyle}
        >
          {style === "mapbox://styles/mapbox/streets-v11" ? (
            <i className="bi bi-globe-americas"></i>
          ) : (
            <i className="bi bi-map"></i>
          )}
        </button>
      </div>
    </div>
  );
};
