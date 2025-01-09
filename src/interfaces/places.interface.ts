export interface PlacesResponse {
    type: string;
    query: string[];
    features: Feature[];
    attribution: string;
}

export interface Feature {
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: Properties;
    text_es: string;
    language_es?: Language;
    place_name_es: string;
    text: string;
    language?: Language;
    place_name: string;
    bbox?: number[];
    center: number[];
    geometry: Geometry;
    context: Context[];
    matching_place_name?: string;
}

interface Context {
    id: string;
    mapbox_id: string;
    wikidata?: string;
    short_code?: string;
    text_es: string;
    language_es?: Language;
    text: string;
    language?: Language;
}

enum Language {
    Es = "es",
    Pt = "pt",
}

interface Geometry {
    type: string;
    coordinates: number[];
}

interface Properties {
    mapbox_id?: string;
    wikidata?: string;
    accuracy?: string;
}
