'use client'
import { useRouter } from 'next/navigation';
import LoginForm from '../components/LoginForm';
import { login } from '../pages/api/auth';  // Import your login function

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      // Call your login service function
      await login({ username, password });

      // Redirect to the admin dashboard after successful login
      router.push('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
