import { useEffect, useReducer } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
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

  return (
    <PlacesContext.Provider value={{ ...state }}>
      {children}
    </PlacesContext.Provider>
  );
};
