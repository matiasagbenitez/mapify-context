import { MapState } from "./MapProvider";
import { Map } from "mapbox-gl";

type MapAction = { type: "SET_MAP"; payload: Map };

export const mapReducer = (state: MapState, action: MapAction): MapState => {
    switch (action.type) {
        case "SET_MAP":
            return { ...state, map: action.payload, isMapReady: true };
        default:
            return state;
    }
};