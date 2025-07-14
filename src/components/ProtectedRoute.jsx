import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const student = JSON.parse(localStorage.getItem('student'));
  
  if (!student) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;