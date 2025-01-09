import { useContext } from "react";
import { MapContext, PlacesContext } from "../../context";
import { DirectionInput } from "./DirectionInput";

interface SearchResultsProps {
  setView: (view: "searchbar" | "directions") => void;
}

export const Directions = ({ setView }: SearchResultsProps) => {
  const { removeRoute } = useContext(MapContext);
  const { destinations, resetDestinations } = useContext(PlacesContext);

  const changeView = () => {
    setView("searchbar");
    removeRoute();
    resetDestinations();
  };
  return (
    <div className="pb-2">
      <h1 className="fs-6">
        <button
          className="btn btn-sm btn-transparent border-0 px-1 text-secondary me-2"
          onClick={changeView}
        >
          <i className="bi bi-arrow-left fs-6"></i>
        </button>
        Cómo llegar
      </h1>
      {destinations.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {destinations.map((destination, index) => (
            <DirectionInput key={destination.id} index={index} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
};
