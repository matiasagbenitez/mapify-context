import { Feature } from "../../interfaces";
import { PlacesState } from "./PlacesProvider";

type PlacesAction =
    { type: "SET_USER_LOCATION"; payload: [number, number]; } |
    { type: "SET_USER_FEATURE"; payload: Feature; } |
    { type: "SET_LOADING_PLACES"; } |
    { type: "SET_PLACES"; payload: Feature[]; } |

    { type: "ADD_DESTINATION"; payload: Feature; } |
    { type: "REMOVE_DESTINATION"; payload: Feature; } |
    { type: "REPLACE_DESTINATION"; payload: { oldDestination: Feature; newDestination: Feature; } } |
    { type: "RESET_DESTINATIONS"; };

export const placesReducer = (state: PlacesState, action: PlacesAction): PlacesState => {

    switch (action.type) {
        case "SET_USER_LOCATION":
            return {
                ...state,
                userLocation: action.payload,
                isLoading: false,
            };

        case "SET_USER_FEATURE":
            return {
                ...state,
                userFeature: action.payload,
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

        case "ADD_DESTINATION":
            return {
                ...state,
                destinations: [...state.destinations, action.payload],
            };

        case "REMOVE_DESTINATION":
            return {
                ...state,
                destinations: state.destinations.filter((destination) => destination !== action.payload),
            };

        case "REPLACE_DESTINATION":
            return {
                ...state,
                destinations: state.destinations.map((destination) => {
                    if (destination.id === action.payload.oldDestination.id) {
                        return action.payload.newDestination;
                    }
                    return destination;
                }),
            };

        case "RESET_DESTINATIONS":
            return {
                ...state,
                destinations: [],
            };

        default:
            return state;
    }

}