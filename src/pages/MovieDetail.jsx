import React from 'react'
import Breadcrumb from '../components/MovieDetail/Breadcrumb/Breadcrumb.jsx'
import SliderDetail from '../components/MovieDetail/SliderDetail/SliderDetail.jsx'
import Header from '../components/Header/Header.jsx'

const MovieDetail = () => {
  return (
    <>
        <Header />
        <Breadcrumb />
        <SliderDetail />
    </>
  )
}

export default MovieDetail