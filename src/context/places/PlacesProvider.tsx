import { useEffect, useReducer } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";
import { searchApi } from "../../apis";
import { PlacesResponse, Feature } from "../../interfaces";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];

  isLoadingPlaces: boolean;
  places: Feature[];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  places: [],
};

interface ChildProps {
  children: JSX.Element | JSX.Element[];
}

export const PlacesProvider = ({ children }: ChildProps) => {
  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  useEffect(() => {
    getUserLocation()
      .then((location) => {
        dispatch({ type: "SET_USER_LOCATION", payload: location });
      })
      .catch((error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      });
  }, []);

  const searchPlacesByQuery = async (query: string): Promise<Feature[]> => {
    if (query.trim() === "") {
      dispatch({ type: "SET_PLACES", payload: [] });
      return [];
    }
    if (!state.userLocation) throw new Error("User location is not set");
    const response = await searchApi<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: `${state.userLocation[1]},${state.userLocation[0]}`,
      },
    });
    dispatch({ type: "SET_PLACES", payload: response.data.features });
    return response.data.features;
  };

  return (
    <PlacesContext.Provider value={{ ...state, searchPlacesByQuery }}>
      {children}
    </PlacesContext.Provider>
  );
};
