import { createRoutesFromElements,createBrowserRouter,RouterProvider, Route, Routes, BrowserRouter } from 'react-router-dom'
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./components/Navbar";
import { SearchProvider } from "./context/SearchContext";
import AddMovie from './pages/AddMovie';

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Movies />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="/addmovie" element={<AddMovie />} />
            <Route path="movies/:id" element={<MovieDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;