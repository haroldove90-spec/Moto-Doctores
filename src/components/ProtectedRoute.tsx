import React from 'react';
import { UserRole, useMockAuth } from '../hooks/useMockAuth';
import { RoleSelector } from './RoleSelector';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * HOC/Component para proteger vistas basadas en el rol del usuario (Modo Demo)
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, login } = useMockAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Si no hay usuario o el rol no está permitido, redirigir al selector
    return <RoleSelector onSelect={login} />;
  }

  return <>{children}</>;
}
