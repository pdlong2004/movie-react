import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ReviewsDetail.css";
import '../../../assets/style/base.css';

const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff";
const BASE_URL = "https://api.themoviedb.org/3";

// Array chứa các thẻ tags động
const tags = ["Tuyệt vời", "Hài hước", "Hài lòng", "Đáng xem", "Siêu phẩm", "Giải trí", "Cảm động"];

const ReviewsDetail = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const movieId = pathnames[1]; // Lấy movieId từ URL

  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState(new Set()); // State để quản lý bình luận mở rộng

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        let page = 1;
        let allReviews = [];
        let totalPages = 1;
        let lang = "vi-VN";
        let res = await axios.get(
          `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=${lang}&page=${page}`
        );
        if (res.data.results.length === 0) {
          lang = "en-US";
          res = await axios.get(
            `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=${lang}&page=${page}`
          );
        }
        totalPages = res.data.total_pages;
        allReviews = res.data.results;

        // Lặp qua các trang còn lại nếu có
        while (page < totalPages) {
          page++;
          const nextPage = await axios.get(
            `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=${lang}&page=${page}`
          );
          allReviews = [...allReviews, ...nextPage.data.results];
        }

        // Format lại dữ liệu
        const formatted = allReviews.map((c) => ({
          author: c.author || "Người dùng ẩn danh",
          avatar: c.author_details.avatar_path
            ? c.author_details.avatar_path.includes("http")
              ? c.author_details.avatar_path.replace("/https", "https")
              : `https://image.tmdb.org/t/p/w200${c.author_details.avatar_path}`
            : "https://i.pravatar.cc/150",
          rating: c.author_details.rating ?? 0,
          content: c.content,
          date: new Date(c.created_at).toLocaleDateString("vi-VN"),
        }));

        setComments(formatted);
        const avg = formatted.reduce((sum, c) => sum + c.rating, 0) / formatted.length || 0;
        setAverageRating(avg.toFixed(1));
      } catch (err) {
        console.error("Lỗi khi tải bình luận:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchAllComments();
  }, [movieId]);

  // Hàm toggle mở rộng/thu gọn bình luận
  const toggleExpand = (index) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (loading) return <p>Đang tải bình luận...</p>;

  return (
    <div className="comments-container">
      <h2 className="comments-title">Bình luận từ người xem</h2>
      {comments.length === 0 ? (
        <p className="comments-title__null">Chưa có bình luận nào cho phim này.</p>
      ) : (
        <>
          <div className="comments-summary">
            <span className="star">
              <i className="fa-solid fa-star"></i>
            </span>
            <span className="rating">{averageRating}</span>
            <span className="rating-detail"> /10 · {comments.length} đánh giá </span>
          </div>
          <div className="comments-list">
            {comments.map((c, index) => {
              const isExpanded = expandedComments.has(index);
              const maxLength = 100; 
              const shouldShowButton = c.content.length > maxLength;

              
              const numTags = Math.floor(Math.random() * 3) + 1; 
              const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, numTags);

             
              const randomSingleTag = tags[Math.floor(Math.random() * tags.length)];

              return (
                <div key={index} className="comment-card">
                  <div className="comment-header">
                    <img src={c.avatar} alt={c.author} className="comment-avatar" />
                    <div className="comment-info">
                      <p className="comment-author">{c.author}</p>
                      <p className="comment-meta">
                        {c.date} ·{" "}
                        <span className="momo-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="mr-1 h-4 w-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Đã mua qua MoMo
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="comment-rating">
                    <i className="fa-solid fa-star"></i>
                    <b className="comment-rating_text">{c.rating}/10</b>
                    <b className="comment-rating_tag">
                       <span>&nbsp;· </span>
                      {randomSingleTag}
                      </b>
                  </p>
                  <div className="comment-content">
                    <span
                      className="comment-content__text"
                      style={
                        isExpanded
                          ? {} 
                          : {
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }
                      }
                    >
                      {c.content}
                    </span>
                    {shouldShowButton && (
                      <span
                        className="comment-content_continue"
                        onClick={() => toggleExpand(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        {isExpanded ? 'Thu gọn' : '...Xem thêm'}
                      </span>
                    )}
                  </div>
                  <div className="comment-tags">
                    {randomTags.map((tag, tagIndex) => (
                      <span className="comment-tags__text" key={tagIndex}>{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsDetail;
