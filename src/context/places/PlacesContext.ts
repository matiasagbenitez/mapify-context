import { createContext } from "react";
import { Feature } from "../../interfaces";

interface PlacesContextProps {
    isLoading: boolean;
    userLocation?: [number, number];
    searchPlacesByQuery: (query: string) => Promise<Feature[]>;
    isLoadingPlaces: boolean;
    places: Feature[];
}

export const PlacesContext = createContext<PlacesContextProps>({} as PlacesContextProps);