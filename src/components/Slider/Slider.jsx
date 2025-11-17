import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import slider from '../../assets/img/slider.webp';
import '../../assets/style/base.css';
import '../Slider/Slider.css';

const Slider = () => {
  const location = useLocation();

  const content = useMemo(() => {
    const path = location.pathname;

    if (path === '/') {
      return {
        heading: 'Mua vé xem phim Online trên MoMo',
        description: 'Với nhiều ưu đãi hấp dẫn và kết nối với tất cả các rạp lớn phủ rộng khắp Việt Nam. Đặt vé ngay tại MoMo!',
        list: [
          <>Mua vé Online, <b>trải nghiệm phim hay</b></>,
          <><b>Đặt vé an toàn</b> trên MoMo</>,
          <>Tha hồ <b>chọn chỗ ngồi, mua bắp nước</b> tiện lợi</>,
          <><b>Lịch sử đặt vé</b> được lưu lại ngay</>,
        ],
        button: 'ĐẶT VÉ NGAY',
      };
    }

    if (path.includes('/movie')) {
      return {
        heading: 'Phim chiếu rạp 2025 trên MoMo',
        description: 'Danh sách Phim Chiếu Rạp 2025 đặc sắc và đáng mong đợi trên MoMo Cinema',
        list: [
          <>Đa dạng <b>phim chiếu rạp 2025</b></>,
          <>Lịch chiếu phim <b>cập nhật đầy đủ nhất</b></>,
          <><b>Đánh giá phim rạp review phim</b> chi tiết chân thật</>,
          <>Đặt vé <b>xem phim Online </b> dễ dàng</>,
        ],
        button: 'XEM NGAY',
      };
    }

    return {
      heading: 'Chào mừng bạn đến với MoMo Movies',
      description: 'Cập nhật tin tức, review và ưu đãi điện ảnh mỗi ngày.',
      list: [],
      button: 'KHÁM PHÁ NGAY',
    };
  }, [location.pathname]);

  return (
    <div className="slider">
      <div className="grid">
        <div className="grid__row">
          <div className="grid__half-width">
            <div className="slider__text">
              <h2 className="text__heading">{content.heading}</h2>
              <span className="text__description">{content.description}</span>

              {content.list.length > 0 && (
                <ul className="text__list">
                  {content.list.map((text, i) => (
                    <li key={i} className="text__list-items">
                      <i className="fa-solid fa-check"></i>
                      {text}
                    </li>
                  ))}
                </ul>
              )}

              <button className="btn">{content.button}</button>
            </div>
          </div>

          <div className="grid__half-width">
            <img src={slider} alt="slider" className="slider__img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
