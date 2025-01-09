import { useContext, useRef, useState } from "react";
import { Feature, PlacesResponse } from "../../interfaces";
import { MapContext, PlacesContext } from "../../context";
import { searchApi } from "../../apis";

interface DirectionInputProps {
  destination: Feature;
  index: number;
}

export const DirectionInput = ({ destination, index }: DirectionInputProps) => {
  const debounceRef = useRef<number>();
  const [query, setQuery] = useState(destination.place_name_es);
  const { userLocation } = useContext(PlacesContext);
  const { replaceDestinationLocal } = useContext(MapContext);
  const [tempPlaces, setTempPlaces] = useState<Feature[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const onQueryChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery); // Actualiza el estado con el nuevo valor del input

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      searchPlacesByQuery(newQuery);
    }, 500);
  };

  const searchPlacesByQuery = async (query: string) => {
    if (query.trim() === "") {
      setTempPlaces([]);
      setIsDropdownVisible(false);
      return;
    }
    if (!userLocation) throw new Error("User location is not set");
    const response = await searchApi<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: `${userLocation[1]},${userLocation[0]}`,
      },
    });
    setTempPlaces(response.data.features);
    setIsDropdownVisible(true);
  };

  const onPlaceSelected = (place: Feature) => {
    setQuery(place.place_name_es);
    setIsDropdownVisible(false); // Cierra el dropdown al seleccionar un lugar
    replaceDestinationLocal(destination, place); // Reemplaza el destino actual por el lugar seleccionado
  };

  return (
    <div>
      <div className="input-group input-group-sm">
        <div className="input-group-text">
          {index === 0 ? (
            <i className="bi bi-geo-alt  text-secondary"></i>
          ) : (
            <i className="bi bi-flag  text-secondary"></i>
          )}
        </div>
        <input
          type="text"
          className="form-control form-control-sm"
          value={query}
          onChange={onQueryChanged}
          onFocus={() => setIsDropdownVisible(true)}
        />
      </div>

      {isDropdownVisible && tempPlaces.length > 0 && (
        <ul className="list-group position-absolute w-100 mt-1 shadow">
          {tempPlaces.map((place) => (
            <li
              key={place.id}
              className="list-group-item list-group-action"
              onClick={() => onPlaceSelected(place)}
              style={{ cursor: "pointer" }}
            >
              {place.place_name_es}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
