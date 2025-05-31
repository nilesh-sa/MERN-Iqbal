
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { getAxiosErrorMessage, loginApiHandler, signupApiHandler } from '@/services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  username?: string;
  dateOfBirth?: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async(loginData: any) => {
    try {
      const response = await loginApiHandler(loginData);
      setUser(response.data.user);
      setCurrentView('dashboard');
      toast.success('Login successful!', { position: 'top-right' });
    } catch (error) {
      const errorMes = getAxiosErrorMessage(error);
      toast.error(`Login failed: ${errorMes}`, { position: 'top-right' });
      
    } 
  };

  const handleRegister = async(registerData: any) => {
    try {
      const response= await signupApiHandler(registerData);
      toast.success('Registration successful! Please log in.',{position:'top-right'});
      setCurrentView('login');

    } catch (error) {
      const errorMes= getAxiosErrorMessage(error);
      toast.error(`Registration failed: ${errorMes}`, { position: 'top-right' });
    }
    
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  if (currentView === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {currentView === 'login' ? (
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
    </div>
  );
};

export default Index;
