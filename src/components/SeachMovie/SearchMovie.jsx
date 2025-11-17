import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchMovie.css";
import "../../assets/style/base.css";

const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff"; // Note: Exposing API keys in client-side code is insecure. Consider moving to environment variables or a backend proxy.
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

function SearchMovie() {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [genres, setGenres] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [trailers, setTrailers] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [genreDropdown, setGenreDropdown] = useState(false); 
  const [yearDropdown, setYearDropdown] = useState(false); 

  const navigate = useNavigate();
  const moviesPerPage = 20;
  const moviePageRef = useRef(null); 

  // === FETCH GENRES ===
  useEffect(() => {
    axios
      .get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=vi-VN`)
      .then((res) => setGenres(res.data.genres))
      .catch((err) => console.log(err));
  }, []);

  // === FETCH ALL MOVIES ===
  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      try {
        const firstPage = await axios.get(
          `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=vi-VN&page=1`
        );
        const total = Math.min(firstPage.data.total_pages, 50);

        const requests = Array.from({ length: total }, (_, i) =>
          axios.get(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=vi-VN&page=${i + 1}`
          )
        );

        const responses = await Promise.all(requests);
        const movies = responses.flatMap((res) => res.data.results);
        setAllMovies(movies);
        setFilteredMovies(movies);
      } catch (err) {
        console.error("Lỗi khi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  // === FILTER MOVIES ===
  useEffect(() => {
    const result = allMovies.filter((m) => {
      const matchTitle = m.title.toLowerCase().includes(query.toLowerCase());
      const matchGenre = genre ? m.genre_ids.includes(parseInt(genre)) : true;
      const matchYear = year ? m.release_date?.startsWith(year) : true;
      return matchTitle && matchGenre && matchYear;
    });
    setFilteredMovies(result);
    setCurrentPage(1);
  }, [query, genre, year, allMovies]);

  // === PAGINATION ===
  const indexOfLast = currentPage * moviesPerPage;
  const indexOfFirst = indexOfLast - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirst, indexOfLast);
  const totalFilteredPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalFilteredPages) {
      setCurrentPage(page);
      if (moviePageRef.current) {
        moviePageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // === FETCH TRAILER ===
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
    []
  );

  const handlePlayTrailer = useCallback(
    async (movieId, e) => {
      e.stopPropagation();
      const trailerUrl = await fetchTrailer(movieId);
      setAllMovies((prev) =>
        prev.map((m) => m.id === movieId ? { ...m, trailer: trailerUrl } : m)
      );
      setActiveTrailer(movieId);
    },
    [fetchTrailer]
  );

  // === AGE LIMIT ===
  const renderAgeLimit = (vote) => {
    if (vote >= 8) return "P";
    if (vote >= 7) return "13+";
    if (vote >= 6) return "16+";
    return "18+";
  };

  // === GET GENRE NAMES ===
  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  // === GET SELECTED GENRE/YEAR TEXT ===
  const getSelectedGenreText = () => {
    if (!genre) return "Thể loại";
    const selectedGenre = genres.find((g) => g.id === parseInt(genre));
    return selectedGenre ? selectedGenre.name : "Thể loại";
  };

  const getSelectedYearText = () => {
    if (!year) return "Năm";
    return year;
  };

  // === RENDER PAGINATION ===
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalFilteredPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    // Previous button
    pages.push(
      <li key="prev" className={`pagination-item js-prev ${currentPage === 1 ? 'disabled' : ''}`}>
        <a
          href="javascript:;"
          className="pagination-item__link"
          onClick={(e) => {
            e.preventDefault();
            goToPage(currentPage - 1);
          }}
        >
          <i className="pagination-item__icon fa-solid fa-chevron-left"></i>
        </a>
      </li>
    );

    // Page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <li key={i} className={`pagination-item js-pagination ${currentPage === i ? 'pagination-item--active' : ''}`}>
          <a
            href="javascript:;"
            className="pagination-item__link"
            onClick={(e) => {
              e.preventDefault();
              goToPage(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    if (end < totalFilteredPages) {
      pages.push(
        <li key="dots" className="pagination-item js-pagination">
          <a href="javascript:;" className="pagination-item__link">...</a>
        </li>
      );
      if (totalFilteredPages > end + 1) {
        pages.push(
          <li key={totalFilteredPages} className={`pagination-item js-pagination ${currentPage === totalFilteredPages ? 'pagination-item--active' : ''}`}>
            <a
              href="javascript:;"
              className="pagination-item__link"
              onClick={(e) => {
                e.preventDefault();
                goToPage(totalFilteredPages);
              }}
            >
              {totalFilteredPages}
            </a>
          </li>
        );
      }
    }

    // Next button
    pages.push(
      <li key="next" className={`pagination-item js-next ${currentPage === totalFilteredPages ? 'disabled' : ''}`}>
        <a
          href="javascript:;"
          className="pagination-item__link"
          onClick={(e) => {
            e.preventDefault();
            goToPage(currentPage + 1);
          }}
        >
          <i className="pagination-item__icon fa-solid fa-chevron-right"></i>
        </a>
      </li>
    );

    return (
      <ul className="pagination pagination--space">
        {pages}
      </ul>
    );
  };

  return (
    <div className="movie movie-container">
        <div className="grid">
            <div className="movie-container__header">
                <h2>Tìm phim chiếu rạp trên MoMo</h2>

                <div className="filters">
                    {/* Genre Dropdown */}
                    <div className="navbar-item">
                    <a
                        href="#"
                        className="nav-menu-link"
                        onClick={(e) => {
                        e.preventDefault();
                        setGenreDropdown(!genreDropdown);
                        setYearDropdown(false);
                        }}
                    >
                        {getSelectedGenreText()} <i className="fa-solid fa-angle-down"></i>
                    </a>
                    <ul className={`navbar__dropdown-menu grid-2 ${genreDropdown ? 'active' : ''}`}>
                        <li>
                        <a
                            className="navbar__dropdown-item"
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            setGenre("");
                            setGenreDropdown(false);
                            }}
                        >
                            Tất cả
                        </a>
                        </li>
                        {genres.map((g) => (
                        <li key={g.id}>
                            <a
                            className="navbar__dropdown-item"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setGenre(g.id);
                                setGenreDropdown(false);
                            }}
                            >
                            {g.name}
                            </a>
                        </li>
                        ))}
                    </ul>
                    </div>

                    {/* Year Dropdown */}
                    <div className="navbar-item">
                    <a
                        href="#"
                        className="nav-menu-link"
                        onClick={(e) => {
                        e.preventDefault();
                        setYearDropdown(!yearDropdown);
                        setGenreDropdown(false); // Close genre dropdown if open
                        }}
                    >
                        {getSelectedYearText()} <i className="fa-solid fa-angle-down"></i>
                    </a>
                    <ul className={`navbar__dropdown-menu ${yearDropdown ? 'active' : ''}`}>
                        <li>
                        <a
                            className="navbar__dropdown-item"
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            setYear("");
                            setYearDropdown(false);
                            }}
                        >
                            Tất cả
                        </a>
                        </li>
                        {[2025, 2024, 2023, 2022, 2021].map((y) => (
                        <li key={y}>
                            <a
                            className="navbar__dropdown-item"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setYear(y);
                                setYearDropdown(false);
                            }}
                            >
                            {y}
                            </a>
                        </li>
                        ))}
                    </ul>
                    </div>

                    <div className="input">
                        <input
                        type="text"
                        placeholder="Tìm theo tên phim..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        />

                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Đang tải danh sách phim...</p>
            ) : currentMovies.length > 0 ? (
                <>
                <div className="movie-page js-movie-active active" ref={moviePageRef}>
                    <div className="grid__row">
                    <div className="grid_col-5">
                        {currentMovies.map((movie) => (
                        <div key={movie.id} className="movie-content js-movie-content">
                            <div
                            className="movie-card"
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            style={{ cursor: "pointer" }}
                            >
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
                                src={`${POSTER_BASE}${movie.poster_path}`}
                                alt={movie.title}
                                />
                                <div
                                className="btn-play movie-play"
                                onClick={(e) => handlePlayTrailer(movie.id, e)}
                                >
                                <i className="fa-solid fa-play"></i>
                                </div>
                            </div>
                            <div className="movie-info movie-upcoming__info">
                                <h3 className="movie-info-heading movie-upcoming__info-heading">
                                {movie.title}
                                </h3>
                                <p className="movie-info-text movie-upcoming__info-text">
                                {getGenreNames(movie.genre_ids)}
                                </p>
                            </div>
                            </div>

                            {/* Trailer */}
                            {activeTrailer === movie.id && movie.trailer && (
                            <div
                                className="search-overley trailer-movie js-overlay"
                                style={{ display: 'block' }}
                                onClick={() => setActiveTrailer(null)}
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
                                    src={`${POSTER_BASE}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="trailer-movie-img"
                                    />
                                    <div className="trailer-movie-summary">
                                    <h3 className="trailer-movie-heading">
                                        {movie.title}
                                    </h3>
                                    <p className="trailer-movie-text">
                                        {movie.overview || 'Không có tóm tắt'}
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

                {/* Pagination */}
                <div className="pagination">
                    {renderPagination()}
                    <span className="pagination-info">
                    </span>
                </div>
                </>
            ) : (
                <p className="movie-null">Rất tiếc, không tìm thấy phim phù hợp với lựa chọn của bạn</p>
            )}
        </div>
    </div>
  );
}

export default SearchMovie;
