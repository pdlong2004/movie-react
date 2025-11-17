import React, { useState, useEffect } from 'react';
import '../../../assets/style/base.css';
import '../MovieReviews/MovieReviews.css';
import { useNavigate } from 'react-router-dom';

const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieReviews = () => {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const navigate = useNavigate()


  const fetchMovies = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=vi-VN&page=${currentPage}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.results || data.results.length === 0)
        throw new Error("Không tìm thấy phim nào");
      setMovies((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        const newMovies = data.results.filter((m) => !ids.has(m.id));
        return [...prev, ...newMovies];
      });

  
      const newMovies = data.results.slice(0, 5);
      newMovies.forEach((movie) => fetchReviews(movie.id));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  
  const fetchReviews = async (movieId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=vi-VN`
      );
      const data = await res.json();

    
      if (!data.results || data.results.length === 0) {
        const resEn = await fetch(
          `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US`
        );
        const dataEn = await resEn.json();
        setReviews((prev) => ({ ...prev, [movieId]: dataEn.results }));
      } else {
        setReviews((prev) => ({ ...prev, [movieId]: data.results }));
      }
    } catch (err) {
      console.error("Lỗi lấy bình luận:", err);
    }
  };


  const fetchTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=vi-VN`
      );
      const data = await res.json();
      let trailer = data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      // Nếu không có bản Việt, thử bản tiếng Anh
      if (!trailer) {
        const resEn = await fetch(
          `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );
        const dataEn = await resEn.json();
        trailer = dataEn.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
      }

      if (trailer) {
        setActiveTrailer({ id: movieId, key: trailer.key });
      } else {
        alert("Không tìm thấy trailer cho phim này.");
      }
    } catch (err) {
      console.error("Lỗi tải trailer:", err);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const loadMore = () => {
    setVisibleCount((prev) => {
      const newCount = prev + 3;
      if (newCount >= movies.length) setPage((prev) => prev + 1);
      return newCount;
    });
  };

  const generateFakeComments = (movie) => {
    const overview = movie.overview || "Không có mô tả.";
    const short1 = overview.slice(0, 100) + "...";
    const short2 = overview.slice(100, 200) + "...";
    return [
      { author: "Người dùng TMDb", time: "Hôm nay", text: "", content: `Phim ${movie.title} rất thú vị! ${short1}` },
      { author: "Người dùng TMDb", time: "Hôm qua", text: "", content: `Tôi thích bộ phim này vì ${short2}` },
    ];
  };

  const getComments = (movie) => {
    const movieReviews = reviews[movie.id];
    if (movieReviews?.length > 0) {
      return movieReviews.slice(0, 2).map((r) => ({
        author: r.author,
        time: new Date(r.created_at).toLocaleDateString("vi-VN"),
        text: "",
        content: r.content,
      }));
    }
    return generateFakeComments(movie);
  };

  if (error) return <p>Lỗi: {error}</p>;
  if (loading && movies.length === 0) return <p>Đang tải phim...</p>;

  const visibleMovies = movies.slice(0, visibleCount);

  return (
    <div className="movie movie-reviews">
      <h2 className="movie__heading"> Bình luận nổi bật</h2>
      <div className="grid">
        <ul className="reviews__list grid_col-3 js-reviews__list">
          {visibleMovies.map((movie) => (
            <li 
              key={movie.id} 
              className="reviews__card js-movie-content"
            >
              <div className="reviews__poster">
                <img
                  className="reviews__poster-img"
                  src={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title}
                />
                <div className="reviews__info">
                  <div
                    className="reviews-play btn-play"
                    onClick={() => fetchTrailer(movie.id)}
                  >
                    <i className="fa-solid fa-play"></i>
                  </div>
                  <div className="reviews__movie-title">{movie.title}</div>
                  <ul className="reviews__stats">
                    <li className="reviews__stats-item">
                      <img className="reviews__stats-momo-img" src="https://homepage.momocdn.net/fileuploads/svg/momo-file-230227094928.svg" alt="" />
                      <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    </li>
                    <li 
                      onClick={() => navigate(`/movie/${movie.id}/review`)}
                      style={{ cursor: 'pointer' }}
                      className="reviews__stats-item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-6 opacity-70 group-hover:opacity-100">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                      </svg>
                      <span>{movie.vote_count ? `${(movie.vote_count / 1000).toFixed(1)}K` : '0'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="reviews__comment">
                {getComments(movie).map((c, i) => (
                  <div key={i} className="reviews__comment-item">
                    <div className="reviews__comment-avatar">
                      <img
                        className="reviews__comment-avatar-img"
                        src="https://avatar.momocdn.net/avatar/f618/6c98e69f04636df9159cc617dd51f29eb0d7f628906c4fcb5962a5e8ec1b.png"
                        alt="Avatar"
                      />
                    </div>
                    <div className="reviews__comment-body">
                      <span className="reviews__comment-author">
                        {c.author}
                        <span className="reviews__comment-time"> · {c.time}</span>
                        <span className="reviews__comment-text">Đã mua qua MoMo</span>
                      </span>
                      <p className="reviews__comment-content">{c.content}</p>
                    </div>
                  </div>
                ))}
                  <a 
                    href=''
                    className="reviews__comment-link"
                    onClick={() => navigate(`/movie/${movie.id}/review`)}
                    style={{ cursor: 'pointer' }}
                  >
                    Xem thêm
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="h-4 w-4 opacity-60"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>

              </div>
            </li>
          ))}
        </ul>

        <div className="btn-contines">
          <button className="btn-contine js-reviews-btn" onClick={loadMore} disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" className="btn-aimation" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            {loading ? 'Đang tải...' : 'Xem tiếp nhé !'}
          </button>
        </div>
      </div>

      {/* ✅ Overlay Trailer */}
      {activeTrailer && (
        <div
          className="search-overley trailer-movie js-overlay"
          style={{ display: "block" }}
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
              src={`https://www.youtube.com/embed/${activeTrailer.key}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <div className="trailer-movie-info">
              <img
                src={`${IMAGE_BASE_URL}${
                  movies.find((m) => m.id === activeTrailer.id)?.poster_path
                }`}
                alt=""
                className="trailer-movie-img"
              />
              <div className="trailer-movie-summary">
                <h3 className="trailer-movie-heading">
                  {movies.find((m) => m.id === activeTrailer.id)?.title ||
                    "Trailer"}
                </h3>
                <p className="trailer-movie-text">
                  {movies.find((m) => m.id === activeTrailer.id)?.overview ||
                    "Không có mô tả."}
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
  );
};

export default MovieReviews;
