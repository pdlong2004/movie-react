import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import './Breadcrumb.css'
import '../../assets/style/base.css'

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const fetchMovieTitle = async () => {
      
      if (pathnames[0] === "movie" && pathnames[1]) {
        try {
          const API_KEY = "ab5d2273d38ebf6426d9efe334ecd2ff";
          const res = await axios.get(
            `https://api.themoviedb.org/3/movie/${pathnames[1]}?api_key=${API_KEY}&language=vi-VN`
          );
          setMovieTitle(res.data.title);
        } catch (err) {
          console.error("Lỗi khi tải tên phim:", err);
        }
      } else {
        setMovieTitle("");
      }
    };

    fetchMovieTitle();
  }, [pathnames]);

  
  const nameMap = {
    cinema: "Cinema",
    movie: "Phim chiếu",
  };

  return (
    <div className="breadcrumb">
      <div className="grid">
        <ul className="breadcrumb__list">
          {/* Trang chủ */}
          <li className="breadcrumb__item">
            <Link to="/" className="breadcrumb__link">
              <i className="fa-solid fa-house breadcrumb__icon-house"></i>
            </Link>
          </li>

          {/* Các phần còn lại của đường dẫn */}
          {pathnames.map((name, index) => {
            const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

           
            const displayName =
              pathnames[0] === "movie" && index === 1
                ? movieTitle || "Đang tải..."
                : nameMap[name] || decodeURIComponent(name);

            return (
              <li
                key={routeTo}
                className={`breadcrumb__item ${
                  isLast ? "breadcrumb__item--active" : ""
                }`}
              >
                <i className="fa-solid fa-chevron-right breadcrumb__icon-right"></i>
                {isLast ? (
                  displayName
                ) : (
                  <Link to={routeTo} className="breadcrumb__link">
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;