import { useEffect, useReducer } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";
import { featureApi, searchApi } from "../../apis";
import { PlacesResponse, Feature } from "../../interfaces";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
  userFeature?: Feature;

  isLoadingPlaces: boolean;
  places: Feature[];

  destinations: Feature[];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  userFeature: undefined,
  isLoadingPlaces: false,
  places: [],
  destinations: [],
};

interface ChildProps {
  children: JSX.Element | JSX.Element[];
}

export const PlacesProvider = ({ children }: ChildProps) => {
  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  // FETCH USER LOCATION
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

  // FETCH USER FEATURE
  useEffect(() => {
    const fetchUserFeature = async () => {
      if (!state.userLocation) return;
      const { data } = await featureApi.get<PlacesResponse>(`/reverse`, {
        params: {
          latitude: state.userLocation[1],
          longitude: state.userLocation[0],
        },
      });
      let feature = data.features[0];
      feature.place_name_es = "Tu ubicación";

      dispatch({
        type: "SET_USER_FEATURE",
        payload: feature,
      });
    };
    fetchUserFeature();
  }, [state.userLocation]);

  // SEARCH PLACES BY QUERY
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
    return response.data!.features;
  };

  // INIT DESTINATIONS
  const initDestinations = (place: Feature) => {
    dispatch({ type: "RESET_DESTINATIONS" });
    if (!state.userFeature) return;
    dispatch({ type: "ADD_DESTINATION", payload: state.userFeature! });
    dispatch({ type: "ADD_DESTINATION", payload: place });
  };

  // REPLACE DESTINATION
  const replaceDestination = (
    oldDestination: Feature,
    newDestination: Feature
  ) => {
    dispatch({
      type: "REPLACE_DESTINATION",
      payload: { oldDestination, newDestination },
    });
  };

  const resetDestinations = () => {
    dispatch({ type: "RESET_DESTINATIONS" });
  }

  return (
    <PlacesContext.Provider
      value={{
        ...state,
        searchPlacesByQuery,
        initDestinations,
        replaceDestination,
        resetDestinations,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};
