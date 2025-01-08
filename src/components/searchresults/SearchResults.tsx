import { useContext, useState } from "react";
import { MapContext, PlacesContext } from "../../context";
import { Feature } from "../../interfaces";

export const SearchResults = () => {
  const { isLoadingPlaces, places, userLocation } = useContext(PlacesContext);
  const { map, getRoutesBetweenPlaces } = useContext(MapContext);
  const [activeId, setActiveId] = useState<string>("");

  if (isLoadingPlaces) {
    return (
      <p className="small text-center mb-0 my-2 text-muted border-top pt-2">
        Searching places...
      </p>
    );
  }

  const onPlaceClick = (place: Feature) => {
    if (map) {
      setActiveId(place.id);
      map.flyTo({
        center: [place.center[0], place.center[1]],
        zoom: 14,
      });
    }
  };

  const onDirectionsClick = (place: Feature) => {
    if (!userLocation) return;
    const destination: [number, number] = place.center as [number, number];
    if (map) {
      getRoutesBetweenPlaces(userLocation, destination);
    }
  };

  return (
    <>
      {places.length > 0 && (
        <ul className="list-group mt-2">
          {places.map((place) => (
            <li
              key={place.id}
              className={`list-group-item d-flex align-items-center ${
                activeId === place.id ? "active" : ""
              }`}
              onClick={() => onPlaceClick(place)}
            >
              <div className="flex-grow-1">
                <b>{place.text_es}</b>
                <p className="mb-0" style={{ fontSize: "0.8rem" }}>
                  {place.place_name_es}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <button
                  title="Go to"
                  className="btn btn-transparent btn-sm p-2"
                  onClick={() => onDirectionsClick(place)}
                >
                  <i
                    className={`bi bi-sign-turn-right-fill fs-5 ${
                      activeId === place.id ? "text-white" : "text-primary"
                    }`}
                  ></i>
                </button>
              </div>
            </li>
          ))}
          <li className="list-group-item text-center">
            <small className="text-muted">
              {places.length} place{places.length > 1 ? "s" : ""} found
            </small>
          </li>
        </ul>
      )}
    </>
  );
};
