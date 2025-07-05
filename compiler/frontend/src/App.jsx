import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnlineCompiler from './pages/onlinecompiler.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/compiler" element={<OnlineCompiler />} />
      </Routes>
    </Router>
  );
}

export default App;
