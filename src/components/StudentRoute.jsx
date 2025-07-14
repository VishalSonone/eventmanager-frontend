import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const StudentRoute = () => {
  const { isStudent, user } = useUser();

  if (!isStudent || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default StudentRoute;
