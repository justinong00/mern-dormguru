import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./components/ProtectedPage.jsx";
import Profile from "./pages/Profile/index.jsx";
import Spinner from "./components/Spinner.jsx";
import { useSelector } from "react-redux";
import Admin from "./pages/Admin/index.jsx";
import DormForm from "./pages/Admin/Dorms/DormForm.jsx";
import DormInfo from "./pages/DormInfo/index.jsx";
import UniInfo from "./pages/UniInfo/index.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <>
      {loading && <Spinner />}
      <BrowserRouter>
        <div className="flex min-h-screen flex-grow flex-col">
          <Routes>
            {/* Protected page route for Home */}
            <Route
              path="/"
              element={
                <>
                  <ProtectedPage>
                    <Home />
                  </ProtectedPage>
                  <Footer />
                </>
              }
            />
            {/* Protected page route for accessing a specific dorm info page*/}
            <Route
              path="/dorm/:id"
              element={
                <>
                  <ProtectedPage>
                    <DormInfo />
                  </ProtectedPage>
                  <Footer />
                </>
              }
            />
            {/* Protected page route for accessing a specific uni info page*/}
            <Route
              path="/uni/:id"
              element={
                <>
                  <ProtectedPage>
                    <UniInfo />
                  </ProtectedPage>
                  <Footer />
                </>
              }
            />
            {/* Protected page route for Profile*/}
            <Route
              path="/profile"
              element={
                <>
                  <ProtectedPage>
                    <Profile />
                  </ProtectedPage>
                  <Footer />
                </>
              }
            />
            {/* Protected page route for Admin*/}
            <Route
              path="/admin"
              element={
                <>
                  <ProtectedPage>
                    <Admin />
                  </ProtectedPage>
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
