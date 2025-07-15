import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import ProblemList from './pages/problemlist.jsx';
import ProblemDetails from './pages/problemdetail.jsx';
import MySubmission from './pages/mysubmission.jsx';
import Home from './pages/home.jsx';
import Navbar from './components/navbar.jsx';
import './styles/global.css';
import Leaderboard from './pages/leaderboard.jsx';


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/submissions" element={<MySubmission />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
