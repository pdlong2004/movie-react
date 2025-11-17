import React from 'react'
import '../../assets/style/base.css'
import ReviewPoster from './ReviewPoster/ReviewPoster.jsx';
import ReviewTopContent from './ReviewTopContent/ReviewTopContent.jsx';


const ReviewMovie = () => {

  return (
    <div className="grid">
        <div className='grid__row'>
            <div className='grid_col-12'>
                <ReviewPoster />
                <ReviewTopContent />
            </div>
        </div>
    </div>
  )
}

export default ReviewMovie