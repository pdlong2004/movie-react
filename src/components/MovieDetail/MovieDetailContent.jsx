import React from 'react'
import '../../assets/style/base.css'
import ReviewsDetail from './ReviewsDetail/ReviewsDetail'
import MovieSectionDetail from './MovieSectionDetail/MovieSectionDetail'

const MovieDetailContent = () => {
  return (
    <div className="grid">
        <div className='grid__row'>
            <div className='grid_col-3'>
                <ReviewsDetail />
                <MovieSectionDetail />
            </div>
        </div>
    </div>
  )
}

export default MovieDetailContent