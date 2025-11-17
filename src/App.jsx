import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import './App.css';
import Home from './pages/Home';
import MovieDetail from "./pages/MovieDetail";
import Review from './pages/Review.jsx';
import MovieScreening from './pages/MovieScreening.jsx';


function App() {
  return (
    <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movie' element={<MovieScreening />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/:id/review" element={<Review />} />
        </Routes>
    </BrowserRouter>  
  )
}

export default App;
