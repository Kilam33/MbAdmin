import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { PackagesPage } from './pages/PackagesPage';
import { HotelsPage } from './pages/HotelsPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { BookingsPage } from './pages/BookingsPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { UsersPage } from './pages/UsersPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuthContext();

  if (loading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  if (!user || !isAdmin()) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;