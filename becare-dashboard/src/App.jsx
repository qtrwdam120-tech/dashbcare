import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Insurances from './pages/Insurances';
import Companies from './pages/Companies';
import Messages from './pages/Messages';
import Offers from './pages/Offers';
import Activity from './pages/Activity';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <SocketProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/insurances" element={<Insurances />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </SocketProvider>
  );
}

export default App;
