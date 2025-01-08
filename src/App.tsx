import { MapProvider, PlacesProvider } from "./context";
import { Home } from "./screens/Home";

export const App = () => {
  return (
    <PlacesProvider>
      <MapProvider>
        <Home />
      </MapProvider>
    </PlacesProvider>
  );
};
