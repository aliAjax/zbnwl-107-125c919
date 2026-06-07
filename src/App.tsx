import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "@/pages/Calendar";
import Scripts from "@/pages/Scripts";
import Rooms from "@/pages/Rooms";
import Hosts from "@/pages/Hosts";
import Dashboard from "@/pages/Dashboard";
import ScriptTypes from "@/pages/ScriptTypes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/hosts" element={<Hosts />} />
        <Route path="/script-types" element={<ScriptTypes />} />
      </Routes>
    </Router>
  );
}
