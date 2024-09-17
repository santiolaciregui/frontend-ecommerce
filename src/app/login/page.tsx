'use client'
import { useRouter } from 'next/navigation';
import LoginForm from '../components/LoginForm';
import { login } from '../pages/api/authService';  // Asegúrate de que la ruta sea correcta

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login({ username, password });
      router.push('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;