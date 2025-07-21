import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Menu } from "lucide-react";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedStudent = storedUser?.student;
    setStudent(storedStudent);
    setIsMobileOpen(false); // Close on route change
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Student Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white shadow px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">🎓 Student Panel</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center text-sm">
          {student && (
            <>
              <Link to="/student/events" className="hover:underline">Events</Link>
              <Link to="/student/mediafiles" className="hover:underline">Media</Link>
              <Link to="/student/announcements" className="hover:underline">Announcements</Link>
              <Link to="/student/profile" className="hover:underline">Profile</Link>
              <Link to="/student/report-bug" className="hover:underline">Report Bug</Link>
              <button
                onClick={handleLogout}
                className="hover:underline text-red-200 ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden bg-indigo-800 text-white px-6 py-4 space-y-3 fixed top-[64px] left-0 right-0 z-40 shadow-lg">
          {student && (
            <>
              <Link to="/student/events" onClick={() => setIsMobileOpen(false)} className="block hover:underline">Events</Link>
              <Link to="/student/mediafiles" onClick={() => setIsMobileOpen(false)} className="block hover:underline">Media</Link>
              <Link to="/student/announcements" onClick={() => setIsMobileOpen(false)} className="block hover:underline">Announcements</Link>
              <Link to="/student/profile" onClick={() => setIsMobileOpen(false)} className="block hover:underline">Profile</Link>
              <Link to="/student/report-bug" onClick={() => setIsMobileOpen(false)} className="block hover:underline">Report Bug</Link>
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  handleLogout();
                }}
                className="block hover:underline text-red-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="pt-[64px] px-4 pb-6">
        <Outlet context={{ student }} />
      </div>
    </div>
  );
};

export default StudentDashboard;
