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

function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          {/* Protected page route for Home */}
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          {/* Protected page route for Profile*/}
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          {/* Protected page route for Admin*/}
          <Route
            path="/admin"
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          />
          {/* Protected page route for adding a new dorm*/}
          <Route
            path="/admin/dorms/add"
            element={
              <ProtectedPage>
                <DormForm />
              </ProtectedPage>
            }
          />
          {/* Protected page route for editing a new dorm*/}
          <Route
            path="/admin/dorms/edit/:id"
            element={
              <ProtectedPage>
                <DormForm />
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
