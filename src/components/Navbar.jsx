import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  LogIn,
  LogOut,
  Users,
  GalleryHorizontal,
  Megaphone,
  Settings,
  User,
  FileText,
  Calendar,
  Menu
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const storedType = localStorage.getItem("userType");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserType(storedType);
    setUserData(storedUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setUserType(null);
    setUserData(null);
    navigate("/");
  };

  const renderLinks = () => {
    if (userType === "student" && userData?.student) {
      return (
        <>
          <NavItem to="/student/events" icon={<Calendar size={16} />} label="Events" />
          <NavItem to="/student/mediafiles" icon={<GalleryHorizontal size={16} />} label="Media" />
          <NavItem to="/student/announcements" icon={<Megaphone size={16} />} label="Announcements" />
          <NavItem to="/student/profile" icon={<User size={16} />} label="Profile" />
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-300 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
        </>
      );
    } else if (userType === "admin" && userData?.admin) {
      return (
        <>
          <NavItem to="/admin/students" icon={<Users size={16} />} label="Students" />
          <NavItem to="/admin/events" icon={<Calendar size={16} />} label="Events" />
          <NavItem to="/admin/mediafiles" icon={<GalleryHorizontal size={16} />} label="Media" />
          <NavItem to="/admin/announcements" icon={<Megaphone size={16} />} label="Announcements" />
          <NavItem to="/admin/settings" icon={<Settings size={16} />} label="Settings" />
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-300 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <NavItem to="/" icon={<Home size={16} />} label="Home" />
          <NavItem to="/admin/login" icon={<LogIn size={16} />} label="Admin" />
          <NavItem to="/login" icon={<LogIn size={16} />} label="Student" />
          <NavItem to="/about" icon={<FileText size={16} />} label="About" />
        </>
      );
    }
  };

  return (
    <nav className="h-[64px] px-6 bg-gray-900 text-white shadow-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:text-cyan-400">
        🎓 EventManager
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-4 text-sm">
        {renderLinks()}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        <Menu size={24} />
      </button>

      {/* Mobile Dropdown */}
      {isMobileOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-gray-800 text-white shadow-md md:hidden px-6 py-4 space-y-4 z-40">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-1 hover:text-cyan-400 transition duration-200"
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
