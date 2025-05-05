import React, { createContext, useState, useContext, useEffect } from 'react';

type UserRole = 'student' | 'faculty' | 'admin' | 'maintenance' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMaintenance: boolean;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: StoredUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@school.edu', password: 'admin123', role: 'admin' },
  // Removed the first maintenance staff from here
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);

  // Load saved users and logged-in user
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      // Filter out unwanted maintenance staff users from initial localStorage data
      const filteredUsers = parsedUsers.filter((u: StoredUser) => u.role !== 'maintenance');
      setUsers(filteredUsers);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
    } else {
      setUsers(MOCK_USERS); // Use only mock users without maintenance
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save users to localStorage when updated
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: StoredUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      role,
    };

    setUsers((prev) => [...prev, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMaintenance: user?.role === 'maintenance',
    allUsers: users.map(({ password: _, ...user }) => user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

