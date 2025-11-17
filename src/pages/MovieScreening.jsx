import React from 'react'
import Header from '../components/Header/Header'
import Slider from '../components/Slider/Slider'
import MovieSection from '../components/Container/MovieSection/MovieSection'
import MovieUpComing from '../components/Container/MovieUpComing/MovieUpComing'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import SearchMovie from '../components/SeachMovie/SearchMovie'
import Footer from '../components/Footer/Footer'

const MovieScreening = () => {
  return (
    <>
        <Breadcrumb />
        <Header />
        <Slider />
        <MovieSection />
        <MovieUpComing />
        <SearchMovie />
        <Footer />
    </>
  )
}

export default MovieScreening