import { useState, useEffect } from "react";
export function useMovies(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callBack?.();
      const controller = new AbortController();
      async function fetchMovies() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=5ed7a2df&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw Error("Failed to fetch data");
          }
          const data = await res.json();
          // console.log(data);
          if (data.Response === "False") throw new Error("Movie Not Found");
          // console.log(data.Search);
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
