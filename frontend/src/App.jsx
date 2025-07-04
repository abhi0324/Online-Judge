import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import ProblemList from './pages/problemlist.jsx';
import ProblemDetails from './pages/problemdetail.jsx';
import MySubmission from './pages/mysubmission.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/submissions" element={<MySubmission />} />
      </Routes>
    </Router>
  );
}

export default App;
