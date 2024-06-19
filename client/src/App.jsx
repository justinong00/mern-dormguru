import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedPage from './components/ProtectedPage.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Protected page routes */}
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
