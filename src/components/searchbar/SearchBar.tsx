import { useContext, useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import { PlacesContext } from "../../context";
import { SearchResults } from "../searchresults/SearchResults";
import { Directions } from "../directions/Directions";

export const SearchBar = () => {
  const debounceRef = useRef<number>();
  const [resultsVisible, setResultsVisible] = useState(false);
  const { searchPlacesByQuery, places } = useContext(PlacesContext);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"searchbar" | "directions">("searchbar");

  const onQueryChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery); // Actualiza el estado con el nuevo valor del input

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      searchPlacesByQuery(newQuery);
    }, 500);
  };

  useEffect(() => {
    if (places.length > 0) {
      setResultsVisible(true);
    }
  }, [places]);

  const onReset = () => {
    setQuery(""); // Limpia el valor del input
    searchPlacesByQuery(""); // Restablece la búsqueda
  };

  return (
    <>
      <div className={styles.searchContainer}>
        {view === "searchbar" ? (
          <>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-transparent border-0 px-1"
                disabled
                hidden={places.length > 0}
              >
                <i className="bi bi-search"></i>
              </button>
              <input
                type="text"
                value={query} // Asocia el valor del input al estado
                onChange={onQueryChanged}
                placeholder="Ingresa una ciudad o lugar"
                className={styles.searchInput}
                style={{ width: "100%" }}
              />

              <button
                title="Clean results"
                className="btn btn-sm btn-transparent border-0 px-1"
                onClick={onReset}
                hidden={places.length === 0}
              >
                <i className="bi bi-x-lg text-secondary"></i>
              </button>
              <button
                className="btn btn-sm btn-light border"
                onClick={() => setResultsVisible(!resultsVisible)}
                hidden={places.length === 0}
              >
                <i className="bi bi-list text-secondary"></i>
              </button>
            </div>

            {resultsVisible && <SearchResults setView={setView} onReset={onReset} />}
          </>
        ) : (
          <Directions setView={setView} />
        )}
      </div>
    </>
  );
};
