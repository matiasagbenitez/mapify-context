import { Feature } from "../../interfaces";
import { PlacesState } from "./PlacesProvider";

type PlacesAction =
    { type: "SET_USER_LOCATION"; payload: [number, number]; } |
    { type: "SET_LOADING_PLACES"; } |
    { type: "SET_PLACES"; payload: Feature[]; } |
    { type: "RESET_PLACES"; };

export const placesReducer = (state: PlacesState, action: PlacesAction): PlacesState => {

    switch (action.type) {
        case "SET_USER_LOCATION":
            return {
                ...state,
                userLocation: action.payload,
                isLoading: false,
            };

        case "SET_LOADING_PLACES":
            return {
                ...state,
                isLoadingPlaces: true,
                places: [],
            };

        case "SET_PLACES":
            return {
                ...state,
                isLoadingPlaces: false,
                places: action.payload,
            };

        case "RESET_PLACES":
            return {
                ...state,
                isLoadingPlaces: false,
                places: [],
            };

        default:
            return state;
    }

}