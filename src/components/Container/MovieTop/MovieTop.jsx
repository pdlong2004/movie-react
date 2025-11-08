import React, { useEffect, useState } from 'react';
import '../MovieTop/MovieTop.css'
import '../../../assets/style/base.css'

const API_KEY = 'ab5d2273d38ebf6426d9efe334ecd2ff';
const BASE_URL = 'https://api.themoviedb.org/3/discover/movie';

const MovieTop = () => {
  const [tetMovies, setTetMovies] = useState([]);
  const [koreanActionMovies, setKoreanActionMovies] = useState([]);
  const [japanHighlightMovies, setJapanHighlightMovies] = useState([]);

  useEffect(() => {
    
    fetch(`${BASE_URL}?api_key=${API_KEY}&primary_release_year=2025&sort_by=popularity.desc&region=VN`)
      .then(res => res.json())
      .then(data => setTetMovies(data.results || []))
      .catch(err => console.error('Error fetching Tet movies:', err));


    fetch(`${BASE_URL}?api_key=${API_KEY}&with_original_language=ko&with_genres=28&sort_by=popularity.desc&primary_release_year=2024`)
      .then(res => res.json())
      .then(data => setKoreanActionMovies(data.results || []))
      .catch(err => console.error('Error fetching Korean action movies:', err));

  
    fetch(`${BASE_URL}?api_key=${API_KEY}&with_original_language=ja&primary_release_year=2024&sort_by=vote_average.desc&vote_count.gte=100`)
      .then(res => res.json())
      .then(data => setJapanHighlightMovies(data.results || []))
      .catch(err => console.error('Error fetching Japanese highlight movies:', err));
  }, []);

  return (
    <div className="movie movie-top">
      <h2 className="movie__heading movie-top__heading">Top phim hay trên MoMo</h2>

      <div className="grid">
        <div className="top__movie-list grid_col-3">      
            <a href="#" className="top__movie-card">
              <div className="top__movie-card-item">
                <div className="top__movie-card__gallery">
                    {tetMovies.slice(0, 5).map((movie,index) => (
                  <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="top__movie-card__image" />
                    ))}
                </div>
              </div>
              <h3 className="top__movie-card__title">
                Phim của năm 2025: Sự trở lại của nhiều gương mặt quen thuộc
              </h3>
              <p className="top__movie-card__desc">
                Mùa phim Tết 2025 chứng kiến sự trở lại của những gương mặt đình đám, vốn là “bảo chứng phòng vé” của điện ảnh Việt. Thay vì vội vàng đánh giá rằng mùa phim thiếu sự đột phá, hãy cùng khám phá những điều đặc biệt mà các tác phẩm năm nay mang lại.
              </p>
              <div className="top__movie-card__meta">
                    <span className="top__movie-card__date">02/01/2025</span>
                    <span className="top__movie-card__views">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="relative inline-block h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        2.3K lượt xem
                    </span>
              </div>
            </a>


            <a href="#" className="top__movie-card">
              <div className="top__movie-card-item">
                <div className="top__movie-card__gallery">
                    {koreanActionMovies.slice(0, 5).map((movie,index)=> (
                  <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="top__movie-card__image" />
                ))}
                </div>
              </div>
              <h3 className="top__movie-card__title">
                Phim hành động Hàn Quốc hay mãn nhãn
              </h3>
              <p className="top__movie-card__desc">
                Phim hành động Hàn Quốc luôn được khán giả yêu thích bởi sự hấp dẫn, kịch tính và mãn nhãn.
              </p>
              <div className="top__movie-card__meta">
                <span className="top__movie-card__date">13/06/2023</span>
                <span className="top__movie-card__views">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="relative inline-block h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    36K lượt xem
                </span>
              </div>
            </a>



            <a href="#" className="top__movie-card">
              <div className="top__movie-card-item">
                <div className="top__movie-card__gallery">
                  {japanHighlightMovies.slice(0, 5).map((movie,index) => (
                  <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="top__movie-card__image" />
                ))}
                </div>
              </div>
              <h3 className="top__movie-card__title"> Top phim bộ Nhật Bản cực hay năm 2023</h3>
              <p className="top__movie-card__desc">
                Cùng MoMo cập nhật danh sách phim truyền hình Nhật Bản 2023 cực hay và đáng mong đợi nhất.
              </p>
              <div className="top__movie-card__meta">
                <span className="top__movie-card__date">15/08/2023</span>
                <span className="top__movie-card__views">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="relative inline-block h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    5.2K lượt xem
                </span>
              </div>
            </a>
        </div>

        <div className="top-movie-btn">
          <button className="btn">Xem nhiều hơn !</button>
        </div>
      </div>
    </div>
  );
};

export default MovieTop;
