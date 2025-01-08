import { useContext } from "react";
import { PlacesContext } from "../../context";

export const SearchResults = () => {
  const { isLoadingPlaces, places } = useContext(PlacesContext);

  if (isLoadingPlaces) {
    return (
      <p className="small text-center mb-0 my-2 text-muted border-top pt-2">
        Searching places...
      </p>
    );
  }
  return (
    <>
      {places.length > 0 && (
        <ul className="list-group mt-2">
          {places.map((place) => (
            <li
              key={place.id}
              className="list-group-item list-group-item-action d-flex gap-2"
            >
              <div className="flex-grow-1">
                <b>{place.text_es}</b>
                <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                  {place.place_name_es}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <button
                  title="Fly to this location"
                  className="btn btn-transparent btn-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="25"
                    height="25" // Ajusta el alto del ícono según sea necesario
                  >
                    <rect
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                      rx="4"
                      fill="#0D6EFD"
                    />
                    <path
                      d="M10 7l5 5-5 5"
                      fill="none"
                      stroke="#FFFFFF"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
