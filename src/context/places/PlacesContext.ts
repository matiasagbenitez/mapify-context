import { createContext } from "react";
import { Feature } from "../../interfaces";

interface PlacesContextProps {
    isLoading: boolean;
    userLocation?: [number, number];
    userFeature?: Feature;

    searchPlacesByQuery: (query: string) => Promise<Feature[]>;
    isLoadingPlaces: boolean;
    places: Feature[];
    destinations: Feature[];
    initDestinations: (place: Feature) => void;

    replaceDestination: (oldDestination: Feature, newDestination: Feature) => void;
    resetDestinations: () => void;
}

export const PlacesContext = createContext<PlacesContextProps>({} as PlacesContextProps);