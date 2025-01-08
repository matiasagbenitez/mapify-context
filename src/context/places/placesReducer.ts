import { PlacesState } from "./PlacesProvider";

type PlacesAction = {
    type: "SET_USER_LOCATION";
    payload: [number, number];
}

export const placesReducer = (state: PlacesState, action: PlacesAction): PlacesState => {
    
    switch (action.type) {
        case "SET_USER_LOCATION":
            return {
                ...state,
                userLocation: action.payload,
                isLoading: false,
            };
    
        default:
            return state;
    }
    
}