import React from 'react'
import '../assets/style/base.css'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb.jsx'
import SliderDetail from '../components/MovieDetail/SliderDetail/SliderDetail.jsx'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import MovieDetailContent from '../components/MovieDetail/MovieDetailContent.jsx'

const MovieDetail = () => {
  return (
    <>
        <Header />
        <Breadcrumb />
        <SliderDetail />
        <MovieDetailContent />
        <Footer />
    </>
  )
}

export default MovieDetail