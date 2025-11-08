import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../../assets/style/base.css';
import '../MovieSectionDetail/MovieSectionDetail.css';

const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const MovieSectionDetail = () => {
  const [movies, setMovies] = useState([]);
  const [genresMap, setGenresMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Lấy danh sách thể loại phim
  const fetchGenres = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: { api_key: API_KEY, language: "vi-VN" },
      });
      const genres = res.data.genres;
      const map = {};
      genres.forEach((g) => (map[g.id] = g.name));
      setGenresMap(map);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  // Lấy phim đang chiếu
  const fetchNowPlaying = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: { api_key: API_KEY, language: "vi-VN", region: "VN", page: 1 },
      });
      setMovies(res.data.results);
    } catch (err) {
      console.error("Error fetching now playing movies:", err);
      setError("Không thể tải phim đang chiếu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchNowPlaying();
  }, []);

  const renderAgeLimit = (vote) => {
    if (vote >= 8) return 'P';
    if (vote >= 7) return '13+';
    if (vote >= 6) return '16+';
    return '18+';
  };

  const isSneakShow = (movieId) => {
    const sneakIds = [123, 456]; // ví dụ
    return sneakIds.includes(movieId);
  };

  if (loading) return <p>Đang tải phim đang chiếu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="now-playing-container">
      <h2 className="now-playing-header">Phim đang chiếu</h2>
      <ul className="now-playing-list">
        {movies.slice(0, 10).map((movie, index) => {
          const genreNames = movie.genre_ids
            .map((id) => genresMap[id])
            .filter(Boolean)
            .slice(0, 2)
            .join(" · ");

          return (
            <li
              key={movie.id}
              className="now-playing-item"
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="movie-rank">{index + 1}</div>
              <img
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/default-poster.png"}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <div className="movie-title-wrapper">
                  <span className={`age-limit age-${renderAgeLimit(movie.vote_average)}`}>
                    {renderAgeLimit(movie.vote_average)}
                  </span>
                  {isSneakShow(movie.id) && (
                    <span className="movie-tag-sneakshow">SNEAKSHOW</span>
                  )}
                  <h3 className="movie-title">{movie.title}</h3>
                </div>
                <p className="movie-genres">{genreNames}</p>
                <p className="movie-rating">
                  <span className="movie-rating__star">
                    <i className="fa-solid fa-star"></i>
                  </span>
                  <span className="movie-rating__text">{movie.vote_average.toFixed(1)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MovieSectionDetail;
