import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import StaffEntry from "./pages/StaffEntry";
import ManagerDashboard from "./pages/ManagerDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/staff" element={<StaffEntry />} />
          <Route path="/manager" element={<ManagerDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
