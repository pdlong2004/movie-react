import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../SliderDetail/SliderDetail.css';
import '../../../assets/style/base.css';

const SliderDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);


  const renderAgeLimit = (vote) => {
    if (vote >= 8) return 'P';    
    if (vote >= 7) return '13+';    
    if (vote >= 6) return '16+';    
    return '18+';                  
  };

  useEffect(() => {
    const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff";

    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=vi-VN`
        );
        setMovie(res.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu phim:", err);
      }
    };

    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const trailer = res.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        }
      } catch (err) {
        console.error("Lỗi khi tải trailer:", err);
      }
    };

    fetchMovie();
    fetchTrailer();
  }, [id]);

  if (!movie) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu phim...</p>
      </div>
    );
  }

  const shortOverview = movie.overview?.split(" ").slice(0, 25).join(" ");
  const fullOverview = movie.overview;

  return (
    <div
      className="movie-detail"
      style={{
        backgroundImage: `url(${
          movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : 'https://via.placeholder.com/1280x720?text=No+Image'
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="grid movie-detail-content">
        {/* Poster */}
        <div className="movie-detail__poster">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
            }
            alt={movie.title}
            className="movie-detail__poster-img"
          />
          {trailerUrl && (
            <div className="btn-play movie-play" onClick={() => setShowTrailer(true)}>
              <i className="fa-solid fa-play"></i>
            </div>
          )}
        </div>

        {/* Thông tin phim */}
        <div className="movie-detail__info">
          
          <div className={`movie-detail__age movie-condition age-limit age-${renderAgeLimit(movie.vote_average)}`}>
            {renderAgeLimit(movie.vote_average)}
          </div>

          <h1 className="movie-detail__title">{movie.title}</h1>

          <ul className="movie-detail__meta">
            <li className="movie-detail__text">{movie.original_title}</li>
            <li className="movie-detail__icon">·</li>
            <li className="movie-detail__year">{movie.release_date?.slice(0, 4)}</li>
            <li className="movie-detail__icon">·</li>
            <li className="movie-detail__duration">
              {movie.runtime ? `${movie.runtime} phút` : "Đang cập nhật"}
            </li>
          </ul>

          {/* Đánh giá */}
          <div className="movie-detail__ratings">
            <div className="movie-detail__rating movie-detail__rating--local">
              <img
                className="movie-detail__start"
                src="https://homepage.momocdn.net/img/momo-amazone-s3-api-240920155012-638624442122067817.png"
                alt=""
              />
              <span className="movie-detail__rating-score">
                {(movie.vote_average * 1).toFixed(1)}
              </span>
              <span className="movie-detail__rating-count">
                từ <span>{movie.vote_count}</span> đánh giá
              </span>
            </div>
            <div className="movie-detail__rating movie-detail__rating--imdb">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32">
                <rect width="100%" height="100%" rx="4" fill="#F5C518" />
                <text
                  x="32"
                  y="22"
                  fontSize="16"
                  fill="black"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  IMDb
                </text>
              </svg>
              <span className="movie-detail__rating-score">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <i className="movie-detail__tagline">{movie.tagline || "Một bộ phim đặc sắc!"}</i>

          {/* Mô tả */}
          <div className="movie-detail__description">
            <h2 className="movie-detail__description-title">Nội dung</h2>
            <div className="movie-detail__description-text">
              <span>{showFull ? fullOverview : shortOverview}</span>
              {fullOverview && fullOverview.length > shortOverview.length && (
                <span
                  className="movie-detail__description-continue"
                  onClick={() => setShowFull(!showFull)}
                >
                  {showFull ? "Thu gọn" : "...Xem thêm"}
                </span>
              )}
            </div>
          </div>

          {/* Thông tin thêm */}
          <div className="movie-detail__extra">
            <span className="movie-detail__extra-item">
              <p>Ngày chiếu:</p>
              <strong>{movie.release_date}</strong>
            </span>
            <span className="movie-detail__extra-item">
              <p>Thể loại:</p>
              <strong>{movie.genres?.map((g) => g.name).join(", ") || "Đang cập nhật"}</strong>
            </span>
            <span className="movie-detail__extra-item">
              <p>Quốc gia:</p>
              <strong>{movie.production_countries?.[0]?.name || "Không rõ"}</strong>
            </span>
          </div>

          {/* Nút hành động */}
          <div className="movie-detail__actions">
            {trailerUrl && (
              <div
                className="movie-detail__btn movie-detail__btn--trailer"
                onClick={() => setShowTrailer(true)}
              >
                <div className="btn--trailer btn-ck">
                  <i className="fa-solid fa-play"></i>
                </div>
                <p>Xem trailer</p>
              </div>
            )}
            <div className="movie-detail__btn movie-detail__btn--review">
              <div className="btn--review btn-ck">
                <i className="fa-solid fa-star"></i>
              </div>
              <p>Xem review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer overlay */}
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

export default SliderDetail;
