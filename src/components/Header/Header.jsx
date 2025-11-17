import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from '../../assets/img/logo.svg';
import cinemaIcon from '../../assets/img/cenima.svg';
import '../../assets/font/fontawesome-free-7.0.0-web/fontawesome-free-7.0.0-web/css/all.min.css';
import '../../assets/style/base.css';
import '../Header/Header.css';

const Header = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]); 
  const navigate = useNavigate()

  useEffect(() => {
    const API_KEY = 'ab5d2273d38ebf6426d9efe334ecd2ff';

    const fetchMoviesAndGenres = async () => {
      try {
        const genreRes = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=vi-VN`
        );
        const genreData = await genreRes.json();
        const genres = genreData.genres || [];

        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=vi-VN&page=1`
        );
        const movieData = await movieRes.json();

        const moviesWithGenres = (movieData.results || []).map((movie) => {
          const movieGenres = movie.genre_ids
            .map(
              (id) =>
                genres.find((g) => g.id === id)?.name?.replace(/^Phim\s*/i, '')
            )
            .filter(Boolean)
            .slice(0, 2);

          return { ...movie, genres: movieGenres };
        });

        setMovies(moviesWithGenres);
        setFilteredMovies(moviesWithGenres); 
      } catch (err) {
        console.error('Error fetching movies:', err);
        setMovies([]);
        setFilteredMovies([]);
      }
    };

    fetchMoviesAndGenres();
  }, []);

  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const results = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(results);
    }
  }, [searchQuery, movies]);

  return (
    <div className="header">
      <div className="grid header__content">
        {/* Logo */}
        <div className="header__logo">
          <a href="/" className="header__logo-link">
            <img src={logo} alt="Logo" className="header__logo-img" />
          </a>
        </div>

        {/* Navbar */}
        <div className="navbar">
          <a href="/" className="navbar-link">
            <img src={cinemaIcon} alt="" className="navbar-icon" />
            <span className="navbar-text">
              Đặt vé <br /> xem phim
            </span>
          </a>

          <ul className="navbar__list">
            <li className="navbar-item">
              <a href="/cinema/lich-chieu" className="nav-menu-link">
                Lịch chiếu <i className="fa-solid fa-angle-down"></i>
              </a>
              <ul className="navbar__dropdown-menu">
                <li><a className="navbar__dropdown-item" href="#">Lịch chiếu hôm nay</a></li>
                <li><a className="navbar__dropdown-item" href="#">Đang chiếu</a></li>
                <li><a className="navbar__dropdown-item" href="#">Sắp chiếu</a></li>
              </ul>
            </li>

            <li className="navbar-item">
              <a href="/cinema/rap" className="nav-menu-link">
                Rạp chiếu <i className="fa-solid fa-angle-down"></i>
              </a>
              <ul className="navbar__dropdown-menu grid-2">
                <li><a className="navbar__dropdown-item" href="#">CGV</a></li>
                <li><a className="navbar__dropdown-item" href="#">Rạp gần đây</a></li>
                <li><a className="navbar__dropdown-item" href="#">Galaxy Cinema</a></li>
                <li><a className="navbar__dropdown-item" href="#">Cinestar</a></li>
                <li><a className="navbar__dropdown-item" href="#">Mega GS</a></li>
                <li><a className="navbar__dropdown-item" href="#">Starlight</a></li>
                <li><a className="navbar__dropdown-item" href="#">Lotte Cinema</a></li>
                <li><a className="navbar__dropdown-item" href="#">BHD Star</a></li>
                <li><a className="navbar__dropdown-item" href="#">Beta Cinemas</a></li>
                <li><a className="navbar__dropdown-item" href="#">DCINE</a></li>
                <li><a className="navbar__dropdown-item" href="#">Cinemax</a></li>
                <li><a className="navbar__dropdown-item" href="#">Rio</a></li>
              </ul>
            </li>

            <li className="navbar-item">
              <a 
                href="" 
                className="nav-menu-link"
                onClick={() => navigate('/movie')}
              >
                Phim chiếu
              </a>
            </li>
            <li className="navbar-item">
              <a href="#" className="nav-menu-link">Review phim</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="nav-menu-link">Top phim</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="nav-menu-link">
                Blog phim <i className="fa-solid fa-angle-down"></i>
              </a>
              <ul className="navbar__dropdown-menu">
                <li><a className="navbar__dropdown-item" href="#">Blog điện ảnh</a></li>
                <li><a className="navbar__dropdown-item" href="#">Phim chiếu rạp</a></li>
                <li><a className="navbar__dropdown-item" href="#">Tổng hợp phim</a></li>
                <li><a className="navbar__dropdown-item" href="#">Phim Netflix</a></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Search */}
        
        <div className="header__search">
          <i
            className="header__search-btn fa-solid fa-magnifying-glass"
            onClick={() => setSearchActive(!searchActive)}
          ></i>

          <div className={`search__movie ${searchActive ? 'active' : ''}`}>
            <div
              className="search-overley search-overley-header"
              onClick={() => setSearchActive(false)}
            ></div>
            <div className="search__body">
              <div className="search__input">
                <div className="search_items">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    className="search__input-input"
                    type="text"
                    placeholder="Nhập tên phim..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ul className="list-scrollbar search__list">
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie) => (
                    <Link
                      to={`/movie/${movie.id}`}
                      key={movie.id}
                      className="search-link"
                      onClick={() => setSearchActive(false)} 
                    >
                      <li className="search-items">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          className="search-img"
                        />
                        <div className="search-info">
                          <h3 className="search-info__heading">{movie.title}</h3>
                          <p className="search-info__type">
                            {movie.genres && movie.genres.length > 0
                              ? movie.genres.join(", ")
                              : "Chưa có thể loại"}
                          </p>
                          <div className="search-meta">
                            <span className="search__rating">
                              <i className="fa-solid fa-star"></i>
                              <span>
                                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                              </span>
                            </span>
                            <span className="search__status">
                              <svg
                                className="search__status-icon"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                ></path>
                              </svg>
                              <span>ĐANG CHIẾU</span>
                            </span>
                          </div>
                        </div>
                      </li>
                    </Link>

                  ))
                ) : (
                  <p style={{ padding: '10px', color: '#ccc' }}>
                    Không tìm thấy phim nào phù hợp
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
