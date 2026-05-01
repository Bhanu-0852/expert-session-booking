import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpertList from './components/ExpertList';
import ExpertDetail from './components/ExpertDetail';
import MyBookings from './components/MyBookings';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ExpertList />} />
        
        {/* 🎯 THIS PATH MUST MATCH YOUR NAVIGATE CALL */}
        <Route path="/expert/:id" element={<ExpertDetail />} />
        
        <Route path="/bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;