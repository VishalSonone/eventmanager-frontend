import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000); // wait briefly for UX clarity
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
