import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import SingleVenuePage from "./pages/SingleVenuePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CreateVenuePage from "./pages/CreateVenuePage";
import UpdateVenuePage from "./pages/UpdateVenuePage";
import AutoScroll from "./components/AutoScroll";

function App() {
  return (
    <Router>
      <AutoScroll />
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venue/:id" element={<SingleVenuePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />
          <Route path="/create" element={<CreateVenuePage />} />
          <Route path="/update/:id" element={<UpdateVenuePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
