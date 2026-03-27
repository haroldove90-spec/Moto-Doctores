import { useState, useEffect } from 'react';

export type UserRole = 'patient' | 'doctor' | 'admin' | null;

interface MockUser {
  id: string;
  name: string;
  role: UserRole;
  token: string;
}

export function useMockAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('motodoc_mock_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (role: UserRole) => {
    const mockUsers: Record<string, MockUser> = {
      patient: { id: 'p1', name: 'Juan Pérez (Demo)', role: 'patient', token: 'mock_token_patient' },
      doctor: { id: 'd1', name: 'Dr. García (Demo)', role: 'doctor', token: 'mock_token_doctor' },
      admin: { id: 'a1', name: 'Harold Ove (Admin)', role: 'admin', token: 'mock_token_admin' },
    };

    if (role && mockUsers[role]) {
      const userToSave = mockUsers[role];
      localStorage.setItem('motodoc_mock_user', JSON.stringify(userToSave));
      setUser(userToSave);
    }
  };

  const logout = () => {
    localStorage.removeItem('motodoc_mock_user');
    setUser(null);
  };

  return { user, loading, login, logout };
}
