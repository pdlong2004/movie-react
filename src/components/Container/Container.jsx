import React from 'react'
import MovieSection from '../Container/MovieSection/MovieSection.jsx'
import MovieUpComing from '../Container/MovieUpComing/MovieUpComing.jsx'

const Container = () => {
  return (
    <div className="container">
      <MovieSection />
      <MovieUpComing />
    </div>
  )
}

export default Container