import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const { logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedStudent = storedUser?.student;
    setStudent(storedStudent);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Student Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white shadow flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold">🎓 Student Panel</div>
        <div className="flex gap-4 items-center">
          {student && (
            <>
              <Link to="/student/events" className="hover:underline">Events</Link>
              <Link to="/student/mediafiles" className="hover:underline">Media</Link>
              <Link to="/student/announcements" className="hover:underline">Announcements</Link>
              <Link to="/student/profile" className="hover:underline">Profile</Link>
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

      {/* Main Content - Pass student as context */}
      <div className="pt-[64px] px-4">
        <Outlet context={{ student }} />
      </div>
    </div>
  );
};

export default StudentDashboard;