import React from 'react'
import MovieSection from '../Container/MovieSection/MovieSection.jsx'
import MovieUpComing from '../Container/MovieUpComing/MovieUpComing.jsx'
import MovieReviews from '../Container/MovieReviews/MovieReviews.jsx'
import MovieTop from '../Container/MovieTop/MovieTop.jsx'

const Container = () => {
  return (
    <div className="container">
      <MovieSection />
      <MovieUpComing />
      <MovieReviews />
      <MovieTop />
    </div>
  )
}

export default Container