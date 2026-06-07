import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "@/pages/Calendar";
import Scripts from "@/pages/Scripts";
import Rooms from "@/pages/Rooms";
import Hosts from "@/pages/Hosts";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/hosts" element={<Hosts />} />
      </Routes>
    </Router>
  );
}
