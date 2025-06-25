import { useState } from "react";

import "./App.css";
import axios from "axios";

type Movie = {
  id: string;
  primaryTitle: string;
  description: string;
  primaryImage: string;
  releaseDate: string;
  averageRating: number;
  trailer: string;
};

type Book = {
  book_id: number;
  name: string;
  author: string;
  votes: number;
  cover: string;
  url: string;
};
function App() {
  const [contenido, setContenido] = useState<Movie[] | Book[]>([]);
  const [tipoContenido, setTipoContenido] = useState<"movie" | "book" | null>(
    null
  );
  const [view, setView] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const handleFindMovie = async () => {
    setLoadingMovies(true);
    try {
      const response = await axios.get(
        "https://imdb236.p.rapidapi.com/api/imdb/top250-movies",
        {
          headers: {
            "X-Rapidapi-Key":
              "019e5a3cf3msh8be1a880347fdc3p1d6a4fjsn67dc0bdf76bb",
            "X-Rapidapi-Host": "imdb236.p.rapidapi.com",
          },
        }
      );
      if (response.status === 200) {
        setContenido(response.data);
        setTipoContenido("movie");
        setView(true);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleFindBook = async () => {
    setLoadingBooks(true);
    try {
      const response = await axios.get(
        "https://imdb236.p.rapidapi.com/nominees/romance/2020",
        {
          headers: {
            "X-Rapidapi-Key":
              "019e5a3cf3msh8be1a880347fdc3p1d6a4fjsn67dc0bdf76bb",
            "X-Rapidapi-Host": "hapi-books.p.rapidapi.com",
          },
        }
      );
      if (response.status === 200) {
        setContenido(response.data);
        setTipoContenido("book");
        setView(true);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleBack = () => {
    setContenido([]);
    setTipoContenido(null);
    setView(false);
    setLoadingMovies(false);
    setLoadingBooks(false);
  };
  return (
    <>
      <h1 className="title">Consumo de Apis con React</h1>
      <img
        className="logo"
        src="https://cdn-icons-png.flaticon.com/512/13322/13322659.png"
        alt=""
      />

      {!view && (
        <div>
          <div className="button-container">
            <h2 className="subtitle">Top 250 películas (IMDB)</h2>
            <button
              className="button"
              onClick={handleFindMovie}
              disabled={loadingMovies}
            >
              {loadingMovies ? "Cargando películas..." : "Activar API"}
            </button>
          </div>
          <div className="button-container">
            <h2 className="subtitle">Libros nominados (Hapi books)</h2>
            <button
              className="button"
              onClick={handleFindBook}
              disabled={loadingBooks}
            >
              {loadingBooks ? "Cargando Libros..." : "Activar API"}
            </button>
          </div>
        </div>
      )}

      {view && (
        <section className="section">
          <div className="back-button-container">
            <button className="button back-button" onClick={handleBack}>
              ⬅ Volver al menú
            </button>
          </div>
          {Array.isArray(contenido) && contenido.length > 0 ? (
            <div className="container-movies">
              {contenido.map((item, index) => {
                if (tipoContenido === "movie") {
                  const movie = item as Movie;
                  return (
                    <div key={movie.id} className="card movie">
                      <h2 className="cardTextPrimary">{movie.primaryTitle}</h2>
                      <div className="cardPoster-container">
                        <div className="cardRanking">{index + 1}</div>
                        <img
                          src={movie.primaryImage}
                          alt={movie.primaryTitle}
                          className="cardPoster"
                        />
                      </div>
                      <p className="cardTextSecundary">{movie.releaseDate}</p>
                      <p className="cardDescription">{movie.description}</p>
                      <a
                        href={movie.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cardTrailer"
                      >
                        Ver tráiler
                      </a>
                    </div>
                  );
                } else if (tipoContenido === "book") {
                  const book = item as Book;
                  return (
                    <div key={book.book_id} className="card movie">
                      <h2 className="cardTextPrimary">{book.name}</h2>
                      <div className="cardPoster-container">
                        <div className="cardRanking">{index + 1}</div>
                        <img
                          src={book.cover}
                          alt={book.name}
                          className="cardPoster"
                        />
                      </div>
                      <p className="cardTextSecundary">Autor: {book.author}</p>
                      <p className="cardDescription">Votos: {book.votes}</p>
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cardTrailer"
                      >
                        Ver libro
                      </a>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <p>No hay contenido</p>
          )}
        </section>
      )}
    </>
  );
}

export default App;
