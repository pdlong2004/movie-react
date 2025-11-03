import React from 'react'
import slider from '../../assets/img/slider.webp'
import '../../assets/style/base.css'
import '../Slider/Slider.css'

const Slider = () => {
  return (
    <div className="slider">
            <div className="grid">
                <div className="grid__row">
                    <div className="grid__half-width">

                        <div className="slider__text">
                            <h2 className="text__heading">Mua vé xem phim Online trên MoMo</h2>
                            <span className="text__description">Với nhiều ưu đãi hấp dẫn và kết nối với tất cả các rạp lớn phủ rộng khắp Việt Nam. Đặt vé ngay tại MoMo!</span>
                            <ul className="text__list">
                                <li className="text__list-items">
                                    <i className="fa-solid fa-check"></i>
                                    Mua vé Online,<b> trải nghiệm phim hay</b>
                                </li>
                                <li className="text__list-items">
                                    <i className="fa-solid fa-check"></i>
                                    <b>Đặt vé an toàn</b> trên MoMo
                                </li>
                                <li className="text__list-items">
                                    <i className="fa-solid fa-check"></i>
                                    Tha hồ <b>chọn chỗ ngồi, mua bắp nước</b> tiện lợi.    
                                </li>
                                <li className="text__list-items">
                                    <i className="fa-solid fa-check"></i>
                                    <b>Lịch sử đặt vé</b> được lưu lại ngay
                                </li>
                            </ul>
        
                            <button className="btn">ĐẶT VÉ NGAY</button>
                        </div>
                    </div>

                    <div className="grid__half-width">
                        <img src={slider} alt="" className="slider__img" />
                    </div>

                </div>



            </div>
        </div>
  )
}

export default Slider