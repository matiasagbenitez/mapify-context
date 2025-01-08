import { useContext, useRef } from "react";
import styles from "./SearchBar.module.css";
import { PlacesContext } from "../../context";
import { SearchResults } from "../searchresults/SearchResults";

export const SearchBar = () => {
  const debounceRef = useRef<number>();
  const { searchPlacesByQuery } = useContext(PlacesContext);

  const onQueryChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      console.log("Searching for", event.target.value);
      searchPlacesByQuery(event.target.value);
    }, 500);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        onChange={onQueryChanged}
        placeholder="Search for a location..."
        className={styles.searchInput}
        style={{ width: "100%" }}
      />

      <SearchResults />
    </div>
  );
};
