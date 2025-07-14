import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminRoute = () => {
  const { isAdmin } = useUser();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;