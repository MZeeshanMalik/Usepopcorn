import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useLocalStorage } from "./useLocalStorage";
import { useMovies } from "./useMovies";
import { useKey } from "./useKey";
export default function App() {
  const [query, setQuery] = useState("");
  // console.log(query);

  const [selectedId, setSelectedId] = useState("tt7640228");
  const [watched, setWatched] = useLocalStorage([], "watched");
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  function handleSelectdMovie(movieId) {
    setSelectedId(movieId);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function onDeleteWatched(id) {
    setWatched(watched.filter((movies) => movies.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NUmResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSelectdMovie={handleSelectdMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onClosehandle={handleCloseMovie}
              onAddWatched={handleAddWatched}
              onAddMovie={handleCloseMovie}
              watchedMovies={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={onDeleteWatched}
              />{" "}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Loader() {
  return <p className="loader">Loading....</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>{message}</span>
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NUmResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Main({ children }) {
  return (
    <main className="main">
      {children}
      {/* <WatchedBox /> */}
    </main>
  );
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, handleSelectdMovie }) {
  return (
    <>
      {movies.length === 0 ? (
        <p className="error">Search For New Movies</p>
      ) : (
        <ul className="list list-movies">
          {movies?.map((movie) => (
            <Movie
              movie={movie}
              handleSelectdMovie={handleSelectdMovie}
              key={movie.imdbID}
            />
          ))}
        </ul>
      )}
    </>
  );
}
function Movie({ movie, handleSelectdMovie }) {
  return (
    <li onClick={() => handleSelectdMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function SelectedMovie({
  selectedId,
  onClosehandle,
  onAddWatched,
  onAddMovie,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Realeased: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
  } = movie;
  // console.log(title, year);
  console.log(movie.imdbID);
  const watchMovie = !watchedMovies.some((obj) => obj.imdbID === movie.imdbID);
  const watchedMovieRating = watchedMovies.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime ? Number(runtime.split(" ").at(0)) : runtime,
      userRating,
    };
    // console.log(newWatchedMovie);
    onAddWatched(newWatchedMovie);
    onAddMovie();
  }
  useKey("Escape", onClosehandle);
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=5ed7a2df&i=${selectedId}`
          );
          const data = await res.json();
          setMovie(data);
        } catch (err) {
          console.error(err);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie: ${title}`;
      return function () {
        document.title = "UsePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClosehandle}>
          &larr;
        </button>
        <img src={poster} alt={movie} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span> {imdbRating} ImdbRating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {watchMovie ? (
            <>
              <StarRating
                size={15}
                maxRating={10}
                setMovieRating={setUserRating}
              />
              {userRating > 0 && (
                <>
                  <button className="btn-add" onClick={handleAdd}>
                    Add to List
                  </button>
                </>
              )}
            </>
          ) : (
            <p>You rated this movie {watchedMovieRating}</p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
      {/* {selectedId} */}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovies
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovies({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          ❌
        </button>
      </div>
    </li>
  );
}
