import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/style/base.css';
import './ReviewPoster.css'; 


const DEFAULT_POSTER = 'https://via.placeholder.com/500x750?text=No+Image';

const ReviewPoster = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff";

  const renderAgeLimit = (vote) => {
    if (vote >= 8) return 'P';
    if (vote >= 7) return '13+';
    if (vote >= 6) return '16+';
    return '18+';
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=vi-VN`
        );
        setMovie(res.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu phim:', err);
        setError('Không thể tải dữ liệu phim. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const trailer = res.data.results.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        }
      } catch (err) {
        console.error('Lỗi khi tải trailer:', err);
      }
    };

    if (id) {
      fetchMovie();
      fetchTrailer();
    }
  }, [id, API_KEY]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu phim...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <div>Phim không tồn tại.</div>;
  }

 
  const movieGenres = movie.genres
    ?.map((g) => g.name.replace(/Phim/g, '').trim())
    .join(', ') || 'Đang cập nhật';

  return (
    <div className="movie-card-review">
      <div className="movie-items">
        <div className={`movie-condition-review age-limit age-${renderAgeLimit(movie.vote_average)}`}>
          {renderAgeLimit(movie.vote_average)}
        </div>
        <img
          className="movie-review-img"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : DEFAULT_POSTER
          }
          alt={`Poster của ${movie.title}`}
          loading="lazy"
        />
        <div
          className="btn-play movie-play"
          onClick={() => setShowTrailer(true)}
          aria-label={`Phát trailer cho ${movie.title}`}
          role="button"
          tabIndex={0}
        >
          <i className="fa-solid fa-play"></i>
        </div>
      </div>

      <div className="movie-info__review">
        <h3 className="movie__title">{movie.title}</h3>
          <ul className="movie-info_content">
            <li>
              Thể loại:&nbsp;&nbsp;&nbsp;
              {movieGenres}
            </li>
            <li>
              Ngày chiếu: &nbsp;
              {movie.release_date || 'Chưa có thông tin'}
            </li>
            <li>
              Quốc gia: &nbsp;&nbsp;&nbsp;
              {movie.production_countries?.map((c) => c.name).join(', ') || 'Chưa có thông tin'}
            </li>
          </ul>
        <button
          className="btn btn-book"
          aria-label={`Đặt vé cho ${movie.title}`}
        >
          Đặt vé ngay
        </button>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <div
          className="search-overley trailer-movie js-overlay"
          style={{ display: 'block' }}
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="list-scrollbar trailer-movie-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="js-iframe"
              width="693"
              height="390"
              src={trailerUrl}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            <div className="trailer-movie-info">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/300x450?text=No+Poster'
                }
                alt={movie.title}
                className="trailer-movie-img"
              />
              <div className="trailer-movie-summary">
                <h3 className="trailer-movie-heading">{movie.title}</h3>
                <p className="trailer-movie-text">
                  {movie.overview || 'Không có tóm tắt'}
                </p>
                <div className="trailer-movie-buttons">
                  <button className="btn">Đặt vé</button>
                  <button
                    className="btn btn-close js-close"
                    onClick={() => setShowTrailer(false)}
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
  );
};

export default ReviewPoster;
