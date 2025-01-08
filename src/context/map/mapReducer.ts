import { MapState } from "./MapProvider";
import { Map, Marker } from "mapbox-gl";

type MapAction =
    { type: "SET_MAP"; payload: Map } |
    { type: "SET_MARKERS"; payload: Marker[] } |
    { type: "SET_STYLE"; payload: string };

export const mapReducer = (state: MapState, action: MapAction): MapState => {
    switch (action.type) {
        case "SET_MAP":
            return { ...state, map: action.payload, isMapReady: true };
        case "SET_MARKERS":
            return { ...state, markers: action.payload };
        case "SET_STYLE":
            return { ...state, style: action.payload };
        default:
            return state;
    }
};