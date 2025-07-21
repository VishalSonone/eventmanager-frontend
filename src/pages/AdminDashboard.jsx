import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const { logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
        
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden sm:flex gap-4 items-center">
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
                className="hover:underline text-red-200 ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && admin && (
        <div className="sm:hidden bg-gray-800 text-white px-6 py-4 space-y-2 shadow-md z-40">
          <Link to="/admin/students" className="block hover:underline" onClick={() => setMenuOpen(false)}>Students</Link>
          <Link to="/admin/events" className="block hover:underline" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/admin/mediafiles" className="block hover:underline" onClick={() => setMenuOpen(false)}>Media</Link>
          <Link to="/admin/announcements" className="block hover:underline" onClick={() => setMenuOpen(false)}>Announcements</Link>
          <Link to="/admin/settings" className="block hover:underline" onClick={() => setMenuOpen(false)}>Settings</Link>
          <Link to="/admin/bug-reports" className="block hover:underline" onClick={() => setMenuOpen(false)}>BugReports</Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block text-red-200 hover:underline"
          >
            Logout
          </button>
        </div>
      )}

      <div className="pt-[64px] px-4">
        <Outlet context={{ admin }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
