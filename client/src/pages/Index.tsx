
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { getAxiosErrorMessage, loginApiHandler, signupApiHandler } from '@/services/api';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

export interface UserPropsType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  username?: string;
  dateOfBirth?: Date;
  token: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [user, setUser] = useState<UserPropsType | null>(null);
  const searchParams= useSearchParams();
  



  const handleLogin = async(loginData: any) => {
    try {
      const response = await loginApiHandler(loginData);
      
      if(response.status==200) {
        toast.success('Login successful!', { position: 'top-right' });
        setCurrentView('dashboard');
        if (response.data && response.data.user) {
          setUser({ ...response.data.user, token: response.data.token });
        } else {
          setUser(null);
        }
        return
      }
    } catch (error) {
      const errorMes = getAxiosErrorMessage(error);
      toast.error(`Login failed: ${errorMes}`, { position: 'top-right' });
      
    } 
  };

  const handleRegister = async(registerData: any) => {
    try {
      const response= await signupApiHandler(registerData);
      toast.success( response.data?.message ||  'Registration successful! Please log in.',{position:'top-right'});
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
