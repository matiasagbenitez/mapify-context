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
                  className="btn btn-transparent btn-sm"
                  onClick={() => onDirectionsClick(place)}
                >
                  <svg
                    fill={activeId === place.id ? "#fff" : "#0D6EFD"}
                    height="25"
                    width="25"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 217.205 217.205"
                  >
                    <g>
                      <path
                        d="M215.008,103.299L113.906,2.196c-2.929-2.928-7.678-2.928-10.606,0L2.197,103.299c-2.929,2.93-2.929,7.678,0,10.607
              l101.103,101.103c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l101.103-101.103
              C217.938,110.976,217.938,106.228,215.008,103.299z M108.603,199.098l-90.496-90.496l90.496-90.496l90.496,90.496L108.603,199.098z
              "
                      />
                      <path
                        d="M121.998,81.07h-21.298c-11.633,0-21.098,9.465-21.098,21.099v39.406c0,4.143,3.358,7.5,7.5,7.5c4.142,0,7.5-3.357,7.5-7.5
              v-39.406c0-3.363,2.735-6.099,6.098-6.099h21.298l-6.217,6.216c-2.929,2.929-2.929,7.678-0.001,10.606
              c1.465,1.465,3.384,2.197,5.304,2.197c1.919,0,3.839-0.732,5.303-2.196l19.021-19.02c1.406-1.406,2.197-3.314,2.197-5.304
              c0-1.989-0.79-3.897-2.197-5.304l-18.942-18.94c-2.93-2.928-7.678-2.929-10.607,0.001c-2.929,2.929-2.928,7.678,0.001,10.606
              L121.998,81.07z"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
