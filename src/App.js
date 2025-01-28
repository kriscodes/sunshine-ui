import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './variables.css';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Location from './pages/Location';
import Programs from './pages/Programs';
import Program from './pages/Program';
import Events from './pages/Events';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsofUse from './pages/TermsofUse';
import Compton from './pages/Compton';
import Lynwood from './pages/Lynwood';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/locations" element={<Locations/>} />
        <Route path="/programs" element={<Programs/>} />
        <Route path="/program" element={<Program/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/location" element={<Location/>} />
        <Route path="/compton" element={<Compton/>} />
        <Route path="/lynwood" element={<Lynwood/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/terms-of-use" element={<TermsofUse/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
