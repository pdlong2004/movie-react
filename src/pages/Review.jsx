import React from 'react'
import Header from '../components/Header/Header'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import ReviewMovie from './../components/ReviewMovie/ReviewMovie';

const Review = () => {
  return (
    <>
        <Header />
        <Breadcrumb />
        <ReviewMovie />
    </>
  )
}

export default Review