import React from 'react';
import '../Footer/Footer.css';
import '../../assets/style/base.css'
import CHPlay from '../../assets/img/1664287128google-play-store-logo-png.png'
import AppStore from '../../assets/img/download-on-the-app-store-apple-logo-png-transparent.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container grid">

        {/* Cột 1: Mua vé xem phim */}
        <div className="footer__column footer__column--movie">
          <h3 className="footer__title">Mua vé xem phim</h3>
          <ul className="footer__list">
            <li className="footer__item">Lịch chiếu phim</li>
            <li className="footer__item">Rạp chiếu phim</li>
            <li className="footer__item">Phim chiếu rạp</li>
            <li className="footer__item">Review phim</li>
            <li className="footer__item">Top phim</li>
            <li className="footer__item">Blog phim</li>
          </ul>
        </div>

        {/* Cột 2: Dịch vụ nổi bật */}
        <div className="footer__column footer__column--services">
          <h3 className="footer__title">Dịch vụ nổi bật</h3>
          <ul className="footer__list">
            {[
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-240810203439-638589188796724974.svg", text: "Vé xem phim" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-240810203448-638589188881279737.svg", text: "Bảo hiểm Ô tô" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-250311143429-638773004690233497.png", text: "Vé xe khách" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-250108092201-638719249211219284.png", text: "Loa báo nhận tiền" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-240810203503-638589189034875619.png", text: "Ví nhân ái" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-250811142304-638905189840016272.png", text: "Ví trả sau" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-240810203533-638589189333270024.png", text: "Vay nhanh" },
              { src: "https://homepage.momocdn.net/img/momo-amazone-s3-api-250108092228-638719249489828680.png", text: "Nạp Data 4G/5G" },
            ].map((item, i) => (
              <li className="footer__item" key={i}>
                <span className="footer__icon">
                  <img src={item.src} alt={item.text} />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Chăm sóc khách hàng */}
        <div className="footer__column footer__column--support">
          <h3 className="footer__title">
            Chăm sóc khách hàng
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="2" stroke="currentColor" className="relative h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </h3>

          <p className="footer__text">
            Hà Nội:<span> Tầng 15, Tòa Nhà Mercury, Số 444 Hoàng Hoa Thám, P. Tây Hồ</span>
          </p>

          <p className="footer__text">
            Đà Nẵng:<span> Tầng 3, Tòa nhà DMT, Số 484-486 đường 2/9, P. Hòa Cường</span>
          </p>

          <p className="footer__text">
            Thời gian làm việc: <br />
            . Thứ 2 - Thứ 6 (trừ Thứ 7, CN, ngày Lễ)<br />
            . Sáng: 9h00 - 11h30 | Chiều: 13h00 - 16h30
          </p>

          <p className="footer__text">
            Hotline: <span>1900 5454 41</span> (Phí 1.000đ/phút)
          </p>

          <p className="footer__text">
            Email: <a href="mailto:hotro@momo.vn">hotro@momo.vn</a>
          </p>

          <p className="footer__text">
            Tổng đài gọi ra:&nbsp;
            <a className="footer__text-phone" href="tel:02873065555">028.7306.5555</a>
            <span> - </span>
            <a className="footer__text-phone" href="tel:02899995555">028.9999.5555</a>
            <span> - </span>
            <a className="footer__text-phone" href="tel:02855555555">028.5555.5555</a>
          </p>

          <div className="footer-card">
            <svg className="footer-card__icon-svg" fill="currentColor" stroke="currentColor" viewBox="0 0 345.1 512">
              <path d="M279.4,23.7H30.8C14.5,23.7,0,38.2,0,56.3v401.8c0,16.3,14.5,30.8,30.8,30.8H76h23.8L76,449.4H34.5V96.2h243.1v152l34.5,22V56.3C312,38.2,297.5,23.7,279.4,23.7z M226.8,77.1H86.1c-8.1,0-13.5-5.4-13.5-13.5c0-8.1,5.4-13.5,13.5-13.5h140.8c5.4,0,10.8,5.4,10.8,13.5C237.7,71.7,232.3,77.1,226.8,77.1z"></path>
              <path d="M189.4,200.7c-14.4,0-25.9,11.6-25.9,25.9v155.7l-17.3-34.6c-14.2-26.3-28.1-23.6-38.9-17.3c-12.5,8.3-17.2,17-8.6,38.9 c19.6,48.2,49.8,105.6,82.2,142.7h116.7c41-30.4,74-175,17.3-181.6c-5.2,0-13.5,0.8-17.3,4.3c0-17.3-15.1-21.7-21.6-21.6 c-7.5,0.1-13,4.3-17.3,13c0-17.3-14.1-21.6-21.6-21.6c-8.3,0-17.9,5.2-21.6,13v-90.8C215.4,212.3,203.8,200.7,189.4,200.7z"></path>
            </svg>

            <div className="footer-card__text">
              <div className="footer-card__subtitle">Hướng dẫn trợ giúp trên</div>
              <div className="footer-card__title">Ứng dụng MoMo</div>
            </div>
          </div>
        </div>

        {/* Cột 4: Hợp tác & truyền thông */}
        <div className="footer__column footer__column--contact">
          <h3 className="footer__title">Hợp tác doanh nghiệp</h3>
          <p className="footer__text">
            Hotline: <span>1900 636 652</span> (Phí 1.000đ/phút)
          </p>
          <p className="footer__text">Email: <span>merchant.care@momo.vn</span></p>
          <p className="footer__text">Website: <span>business.momo.vn</span></p>

          <h3 className="footer__title footer__title-contact">Liên hệ truyền thông</h3>
          <p className="footer__text">Email: <span>pr@mservice.com.vn</span></p>

          <div className="footer__social">
            <span className="footer__social-title">Kết nối với MoMo</span>
            {[
              "https://homepage.momocdn.net/styles/desktop/images/social/facebook.svg",
              "https://homepage.momocdn.net/styles/desktop/images/social/linkedin.svg",
              "https://homepage.momocdn.net/styles/desktop/images/social/youtube.svg",
            ].map((src, i) => (
              <a href="#" key={i} className="footer__social-icon">
                <img src={src} alt="social-icon" width="32" height="32" />
              </a>
            ))}
          </div>

          <div className="footer__apps">
            <a href="#" className="footer__download-app-link">
              <img src={AppStore}
                alt="Appstore" className="footer__download-app-img" />
            </a>
            <a href="#" className="footer__download-app-link">
              <img src={CHPlay}
                alt="CH Play" className="footer__download-app-img footer__download-app-img-chplay" />
            </a>
          </div>

          <p className="footer__certification">
            Chứng nhận bởi&nbsp;
            <img alt="chứng nhận"
              src="https://homepage.momocdn.net/blogscontents/momo-upload-api-210629153623-637605777831780706.png"
              width="119" height="45" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
