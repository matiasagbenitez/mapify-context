import axios from "axios";

const featureApi = axios.create({
    baseURL: "https://api.mapbox.com/search/geocode/v6",
    params: {
        limit: 1,
        language: "es",
        access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    },
});

export default featureApi;