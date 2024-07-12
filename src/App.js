import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './variables.css';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Programs from './pages/Programs';
import Program from './pages/Program';
import Events from './pages/Events';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/locations" element={<Locations/>} />
        <Route path="/programs" element={<Programs/>} />
        <Route path="/program" element={<Program/>} />
        <Route path="/events" element={<Events/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
