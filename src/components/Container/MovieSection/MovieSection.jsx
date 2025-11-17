import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MovieSection.css";
import "../../../assets/style/base.css";

function MovieSection() {
  const [movies, setMovies] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const moviesPerPage = 5;
  const navigate = useNavigate();
  const API_KEY = 'ab5d2273d38ebf6426d9efe334ecd2ff';
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);

      const [genreRes, movieRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
          params: { api_key: API_KEY, language: "vi-VN" },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/now_playing`, {
          params: { api_key: API_KEY, language: "vi-VN", page: 1 },
        }),
      ]);

      const genres = genreRes.data.genres;

      const moviesWithGenres = movieRes.data.results.map((movie) => {
        const movieGenres = movie.genre_ids
          .map((id) => genres.find((g) => g.id === id)?.name)
          .filter(Boolean)
          .slice(0, 2)
          .map((g) => g.replace(/Phim/g, "").trim())
          .join(", ");

        return {
          ...movie,
          genre: movieGenres || "Chưa có thể loại",
          poster: movie.poster_path
            ? `${IMAGE_BASE}${movie.poster_path}`
            : "/path/to/default-image.jpg",
          summary: movie.overview || "Không có tóm tắt",
          trailer: null,
        };
      });

      setMovies(moviesWithGenres);
    } catch (err) {
      console.error(err);
      setError("Không thể tải phim. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const fetchTrailer = useCallback(
    async (movieId) => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          { params: { api_key: API_KEY, language: "en-US" } }
        );
        const trailer = res.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [API_KEY]
  );

  const handlePlayTrailer = useCallback(
    async (movieId, e) => {
      e.stopPropagation();
      const trailerUrl = await fetchTrailer(movieId);
      setMovies((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, trailer: trailerUrl } : m))
      );
      setActiveTrailer(movieId);
    },
    [fetchTrailer]
  );

  const renderAgeLimit = (vote) => {
    if (vote >= 8) return "P";
    if (vote >= 7) return "13+";
    if (vote >= 6) return "16+";
    return "18+";
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

  const currentMovies = useMemo(
    () => movies.slice(indexOfFirstMovie, indexOfLastMovie),
    [movies, indexOfFirstMovie, indexOfLastMovie]
  );

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="movie movie-section">
      <div className="grid">
        <h2 className="movie__heading movie-section__heading">
          Phim đang chiếu
        </h2>

        {/* Nút chuyển trang */}
        {currentPage < totalPages && (
          <div
            className="movie-switch-page movie-next js-next"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <i className="fa-solid fa-angle-right"></i>
          </div>
        )}
        {currentPage > 1 && (
          <div
            style={{ display: 'block' }}
            className="movie-switch-page movie-return js-return"
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <i className="fa-solid fa-angle-left"></i>
          </div>
        )}

        {movies.length > 0 && (
          <div className="movie-page js-movie-active active">
            <div className="grid__row">
              <div className="grid_col-5">
                {currentMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="movie-content js-movie-content"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="movie-card">
                      <div className="movie-items">
                        <div
                          className={`movie-condition age-limit age-${renderAgeLimit(
                            movie.vote_average
                          )}`}
                        >
                          {renderAgeLimit(movie.vote_average)}
                        </div>

                        <img
                          className="movie-img"
                          src={movie.poster}
                          alt={movie.title}
                        />

                        <div
                          className="btn-play movie-play"
                          onClick={(e) => handlePlayTrailer(movie.id, e)}
                          aria-label="Phát trailer"
                        >
                          <i className="fa-solid fa-play"></i>
                        </div>
                      </div>

                      <div className="movie-info movie-section__info">
                        <span className="movie-number">
                          {index + 1 + (currentPage - 1) * moviesPerPage}
                        </span>
                        <h3 className="movie-info-heading movie-section__info-heading">
                          {movie.title}
                        </h3>
                        <p className="movie-info-text movie-section__info-text">
                          {movie.genre}
                        </p>
                        <p className="movie-rating">
                          <i className="fa-solid fa-star"></i>{" "}
                          {movie.vote_average.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* Trailer */}
                    {activeTrailer === movie.id && (
                        <div
                          className="search-overley trailer-movie js-overlay"
                          style={{ display: 'block' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            return setActiveTrailer(null)
                          }}
                        >
                          <div
                            className="list-scrollbar trailer-movie-content"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <iframe
                              className="js-iframe"
                              width="693"
                              height="390"
                              src={movie.trailer}
                              title={movie.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            ></iframe>
                            <div className="trailer-movie-info">
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="trailer-movie-img"
                              />
                              <div className="trailer-movie-summary">
                                <h3 className="trailer-movie-heading">
                                  {movie.title}
                                </h3>
                                <p className="trailer-movie-text">
                                  {movie.summary || 'Không có tóm tắt'}
                                </p>
                                <div className="trailer-movie-buttons">
                                  <button className="btn">Đặt vé</button>
                                  <button
                                    className="btn btn-close js-close"
                                    onClick={() => setActiveTrailer(null)}
                                  >
                                    Đóng
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieSection;
