import Home from './pages/Home';
import Answer from './pages/Answer';
import Edit from './pages/Edit';
import NotFound from './pages/NotFound';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/answer' exact element={<Answer />} />
          <Route path='/edit' exact element={<Edit />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
