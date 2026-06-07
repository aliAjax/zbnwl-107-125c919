import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "@/pages/Calendar";
import Scripts from "@/pages/Scripts";
import ScriptTypes from "@/pages/ScriptTypes";
import ScriptTags from "@/pages/ScriptTags";
import Rooms from "@/pages/Rooms";
import Hosts from "@/pages/Hosts";
import Customers from "@/pages/Customers";
import Dashboard from "@/pages/Dashboard";
import Memos from "@/pages/Memos";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/script-types" element={<ScriptTypes />} />
        <Route path="/script-tags" element={<ScriptTags />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/hosts" element={<Hosts />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/memos" element={<Memos />} />
      </Routes>
    </Router>
  );
}
