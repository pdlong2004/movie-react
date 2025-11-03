import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieSection.css'
import '../../../assets/style/base.css'

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;

  useEffect(() => {
    const API_KEY = 'ab5d2273d38ebf6426d9efe334ecd2ff';

    const fetchMovies = async () => {
      try {
        const genreRes = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=vi-VN`
        );
        const genres = genreRes.data.genres;

        
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=vi-VN&page=1`
        );

        
        const moviesWithGenres = await Promise.all(movieRes.data.results.map(async (movie) => {
          const movieGenres = movie.genre_ids
            .map((id) => genres.find((g) => g.id === id)?.name)
            .filter(Boolean);

          const movieVideosRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en‑US`
          );
          const trailers = movieVideosRes.data.results.filter(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          const trailerUrl = trailers.length > 0 ? `https://www.youtube.com/embed/${trailers[0].key}` : null;

          return {
            ...movie,
            genre: movieGenres
              .slice(0, 2)
              .map(g => g.replace(/Phim/g, '').trim())
              .join(', ') || 'Chưa có thể loại',
            age: 'Tất cả',
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            summary: movie.overview,
            trailer: trailerUrl,
          };
        }));

        setMovies(moviesWithGenres);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <>
      <div className="movie movie-section">
        <div className="grid">
          <h2 className="movie__heading movie-section__heading">Phim đang chiếu</h2>

          {/* Nút chuyển trang */}
          {currentPage < totalPages && (
            <div className="movie-switch-page movie-next js-next" onClick={() => setCurrentPage(currentPage + 1)}>
              <i className="fa-solid fa-angle-right"></i>
            </div>
          )}
          {currentPage > 1 && (
            <div 
                className="movie-switch-page movie-return js-return" 
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ display: 'block' }}
            >
              <i className="fa-solid fa-angle-left"></i>
            </div>
          )}

          {movies.length > 0 && (
            <div className="movie-page js-movie-active active">
              <div className="grid__row">
                {currentMovies.map((movie, index) => (
                  <div key={movie.id} className="grid__column-2-4 movie-content js-movie-content">
                    <div className="movie-card">
                      <div className="movie-items">
                        <div className="movie-condition">{movie.age}</div>
                        <img className="movie-img" src={movie.poster} alt={movie.title} />
                        <div 
                            className="btn-play movie-play" 
                            onClick={() => setActiveTrailer(movie.id)}
                        >
                          <i className="fa-solid fa-play"></i>
                        </div>
                      </div>
                      <div className="movie-info movie-section__info">
                        <span className="movie-number">{index + 1 + (currentPage - 1) * moviesPerPage}</span>
                        <h3 className="movie-info-heading movie-section__info-heading">{movie.title}</h3>
                        <p className="movie-info-text movie-section__info-text">{movie.genre}</p>
                        <p className="movie-rating">
                          <i className="fa-solid fa-star"></i> {movie.vote_average.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* Trailer */}
                    {activeTrailer === movie.id && (
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
                            <img src={movie.poster} alt={movie.title} className="trailer-movie-img" />
                            <div className="trailer-movie-summary">
                              <h3 className="trailer-movie-heading">{movie.title}</h3>
                              <p className="trailer-movie-text">{movie.summary || 'Không có tóm tắt'}</p>
                              <div className="trailer-movie-buttons">
                                <button className="btn">Đặt vé</button>
                                <button className="btn btn-close js-close" onClick={() => setActiveTrailer(null)}>
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
          )}

        </div>
      </div>
    </>
  );
}

export default MovieList;
