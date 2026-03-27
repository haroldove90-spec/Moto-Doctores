import React from 'react';
import { PatientDashboard } from './components/PatientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PWAInstallPopup } from './components/PWAInstallPopup';
import { RoleSelector } from './components/RoleSelector';
import { DebugBar } from './components/DebugBar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useMockAuth } from './hooks/useMockAuth';
import { Loader2 } from 'lucide-react';

import { DevicePreviewWrapper } from './components/DevicePreviewWrapper';

export default function App() {
  const { user, loading, login, logout } = useMockAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  // --- Route Protection & View Selection ---
  const renderView = () => {
    if (!user) return <RoleSelector onSelect={login} />;

    switch (user.role) {
      case 'patient':
        return (
          <ProtectedRoute allowedRoles={['patient', 'admin']}>
            <PatientDashboard />
          </ProtectedRoute>
        );
      case 'doctor':
        return (
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorDashboard />
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        );
      default:
        return <RoleSelector onSelect={login} />;
    }
  };

  return (
    <DevicePreviewWrapper>
      <div className="antialiased min-h-full">
        {/* Debug Bar (Visible when logged in) */}
        <DebugBar user={user} onLogout={logout} />

        {/* Main View */}
        <main className={user ? "pt-12" : ""}>
          {renderView()}
        </main>

        {/* PWA Install Popup */}
        <PWAInstallPopup />
      </div>
    </DevicePreviewWrapper>
  );
}
