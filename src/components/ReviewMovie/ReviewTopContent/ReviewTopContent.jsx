import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './ReviewTopContent.css'
import '../../../assets/style/base.css'
import ReviewsDetail from './../../MovieDetail/ReviewsDetail/ReviewsDetail';

const API_KEY = 'ab5d2273d38ebf6426d9efe334ecd2ff'; 
const DEFAULT_POSTER = 'https://via.placeholder.com/500x750?text=No+Image';

const ReviewTopContent = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [istruncated, setIsTruncated] = useState(true)

  const renderAgeLimit = (vote) => {
    if (vote >= 8) return { label: 'P'};
    if (vote >= 7) return { label: '13+'};
    if (vote >= 6) return { label: '16+'};
    return { label: '18+'};
  };

  // Helper to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2); 
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i < fullStars ? 'star filled' : 'star'}
        >
          <i className="fa-solid fa-star"></i>
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const [movieRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits`),
        ]);

        setMovie(movieRes.data);

      } catch (err) {
        setError('Không thể tải dữ liệu phim. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin phim...</p>
      </div>
    );
  }

  if (error || !movie) {
    return <div className="error">{error || 'Phim không tồn tại.'}</div>;
  }

  const age = renderAgeLimit(movie.vote_average);
  const genres = movie.genres?.map(g => g.name.replace(/Phim/g, '').trim()).join(', ') || 'Đang cập nhật'; 
  const countries = movie.production_countries?.map(c => c.name).join(', ') || 'Việt Nam';
  const director = movie.credits?.crew?.find(p => p.job === 'Director')?.name || 'Chưa rõ';
  const topCast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'Chưa rõ'; 
  const releaseYear = new Date(movie.release_date).getFullYear();

  const summary = movie.overview || 'Không có tóm tắt chi tiết.';
  const runtimeText = movie.runtime ? `${movie.runtime} phút` : 'Thời lượng chưa rõ';
  const recommendation = age.label === 'P' ? 'Phù hợp cho mọi lứa tuổi.' : `Không dành cho trẻ em dưới ${age.label.replace('+', '')} tuổi.`;

  // Dynamic Pros/Cons based on data
  const pros = [];
  const cons = [];
  if (movie.vote_average >= 7) pros.push('Kịch tính tốt, diễn xuất ấn tượng');
  if (genres.toLowerCase().includes('hành động')) pros.push('Cảnh hành động mãn nhãn');
  if (movie.runtime > 120) cons.push('Thời lượng dài, có thể mệt mỏi');
  if (age.label !== 'P') cons.push('Có yếu tố bạo lực hoặc phức tạp');
  if (pros.length === 0) pros.push('Cốt truyện logic');
  if (cons.length === 0) cons.push('Không có điểm trừ rõ ràng');

  return (
    <div className='top-content'>
      <div className="backdrop-container">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          className="backdrop-img"
        />

        <ul className="reviews__stats review-top-content">
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

      {/* Review Content */}
      <div className="review-container">
        <div className={`${istruncated ? 'is-truncated' : ''}`}>
          <h1 className="review-title">Review {movie.title} {releaseYear}</h1>

          <p className="review-text">
            <strong className='review-text_highlight'>{movie.title}</strong> {summary}
          </p>

          <p className="review-text">
            Phim có thời lượng {runtimeText}, quy tụ dàn diễn viên nổi bật như {topCast}. Đạo diễn: {director}.
          </p>

          <div className="review-detail">
            <h3 className='review-detail-title'>Điểm nổi bật</h3>
            <p className='review-text'>Kịch tính nghẹt thở: phim khai thác thể loại {genres}.
            </p>
            <p className='review-text'>Hình ảnh & âm thanh: Quay với công nghệ hiện đại, mang đến trải nghiệm chân thực.</p>
            <p className='review-text'>Đề xuất: {recommendation} Phù hợp khán giả yêu thích {genres.toLowerCase()}.</p>
          </div>

          {expanded && (
            <div className="extra-review">
              <h3 className="review-detail-title">Đánh giá nhanh</h3>
              <div className="review-text">
                {renderStars(movie.vote_average)}
                <span className="rating-score">({movie.vote_average?.toFixed(1)}/10)</span>
              </div>
              <p className='review-text'>
                Được khen ngợi bởi {movie.vote_count || 0} người xem. Phù hợp cho fan của {genres.toLowerCase()}.
              </p>
              <div className="pros-cons">
                <div className="pros">
                  <h4 className='review-detail-title'>Ưu điểm:</h4>
                  <ul className='review-text'>
                    {pros.map((pro, index) => <li key={index}>{pro}</li>)}
                  </ul>
                </div>
                <div className="cons">
                  <h4 className='review-detail-title'>Nhược điểm:</h4>
                  <ul className='review-text'>
                    {cons.map((con, index) => <li key={index}>{con}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='continue'>
            <button className="btn-view-more" 
              onClick={() => {
                setExpanded(!expanded)
                setIsTruncated(!istruncated)
              }}              
            >
            {expanded ? (
              <>
                Thu gọn <i className="fa-solid fa-chevron-up"></i>
              </>
            ) : (
              <>
                Xem thêm <i className="fa-solid fa-chevron-down"></i>
              </>
            )}
          </button>
      </div>
      

      <ReviewsDetail />
    </div>
  );
};

export default ReviewTopContent;
