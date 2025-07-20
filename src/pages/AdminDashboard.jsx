import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const { logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedAdmin = storedUser?.admin;
    setAdmin(storedAdmin);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold">🛠️ Admin Panel</div>
        <div className="flex gap-4 items-center">
          {admin && (
            <>
              <Link to="/admin/students" className="hover:underline">Students</Link>
              <Link to="/admin/events" className="hover:underline">Events</Link>
              <Link to="/admin/mediafiles" className="hover:underline">Media</Link>
              <Link to="/admin/announcements" className="hover:underline">Announcements</Link>
              <Link to="/admin/settings" className="hover:underline">Settings</Link>
              <Link to="/admin/bug-reports" className="hover:underline">BugReports</Link>
              <button
                onClick={handleLogout}
                className="hover:underline text-red-200 ml-4"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="pt-[64px] px-4">
        <Outlet context={{ admin }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
