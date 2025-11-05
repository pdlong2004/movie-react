import React from 'react'
import Container from '../components/Container/Container.jsx'
import Header from '../components/Header/Header.jsx'
import Slider from '../components/Slider/Slider.jsx'
import Footer from '../components/Footer/Footer.jsx'

const Home = () => {
  return (
    <>
        <Header />
        <Slider />
        <Container />
        <Footer />
    </>
  )
}

export default Home