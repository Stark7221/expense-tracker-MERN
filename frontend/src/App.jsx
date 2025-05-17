import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Income from "./pages/Income/Income";
import Expense from "./pages/Expense/Expense";
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layouts/DasboardLayout';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout activeMenu="Dashboard">
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout activeMenu="Dashboard">
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <DashboardLayout activeMenu="Income">
                    <Income />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/expense"
              element={
                <ProtectedRoute>
                  <DashboardLayout activeMenu="Expense">
                    <Expense />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      <Toaster position="top-right" />
    </UserProvider>
  );
}

export default App;
