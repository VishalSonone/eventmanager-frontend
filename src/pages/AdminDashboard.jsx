// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   LayoutDashboard,
//   Users,
//   Image,
//   CalendarCheck,
//   Trophy,
//   Settings,
// } from "lucide-react";

// import StudentManagement from "./StudentManagement";
// import EventManagement from "./EventManagement";
// import MediaFileAdmin from "./MediaFileAdmin";
// import AdminAnnouncement from "./AdminAnnoucement";
// import AdminSettings from "./AdminSettings";

// const handleLogout = () => {
//   localStorage.removeItem("admin-auth");
//   window.location.href = "/admin/login";
// };

// const AdminDashboard = () => {
//   const [selectedSection, setSelectedSection] = useState("students");

//   const sections = {
//     home: <div>🏠 Welcome to Admin Dashboard</div>,
//     students: <StudentManagement />,
//     events: <EventManagement />,
//     mediafiles: <MediaFileAdmin />,
//     announcement: <AdminAnnouncement />,
//     calendar: <div>📆 Calendar Setup Coming Soon...</div>,
//     settings: <AdminSettings />,
//   };

//   return (
//     <div className="h-screen flex overflow-hidden">
//       <aside className="w-64 h-full bg-white shadow-md p-4 space-y-4 sticky top-0 flex-shrink-0">
//         <h2 className="text-2xl font-bold text-indigo-600 mb-6">
//           Admin Dashboard
//         </h2>

//         <SidebarItem
//           icon={<LayoutDashboard className="w-5 h-5" />}
//           label="Home"
//           active={selectedSection === "home"}
//           onClick={() => setSelectedSection("home")}
//         />
//         <SidebarItem
//           icon={<Users className="w-5 h-5" />}
//           label="Students"
//           active={selectedSection === "students"}
//           onClick={() => setSelectedSection("students")}
//         />
//         <SidebarItem
//           icon={<LayoutDashboard className="w-5 h-5" />}
//           label="Events"
//           active={selectedSection === "events"}
//           onClick={() => setSelectedSection("events")}
//         />
//         <SidebarItem
//           icon={<Image className="w-5 h-5" />}
//           label="Announcements"
//           active={selectedSection === "announcement"}
//           onClick={() => setSelectedSection("announcement")}
//         />
//         <SidebarItem
//           icon={<Image className="w-5 h-5" />}
//           label="MediaFiles"
//           active={selectedSection === "mediafiles"}
//           onClick={() => setSelectedSection("mediafiles")}
//         />
//         <SidebarItem
//           icon={<Settings className="w-5 h-5" />}
//           label="Settings"
//           active={selectedSection === "settings"}
//           onClick={() => setSelectedSection("settings")}
//         />
//       </aside>

//       <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.4 }}
//           className="bg-white rounded-xl shadow-lg p-6 min-h-full"
//         >
//           {sections[selectedSection]}
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// const SidebarItem = ({ icon, label, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-3 w-full p-2 
//       text-left rounded-lg transition-all 
//       duration-300 hover:bg-indigo-100 
//       hover:text-indigo-600 
//       text-gray-700 font-medium ${
//         active ? "bg-indigo-100 text-indigo-600" : ""
//       }`}
//   >
//     {icon}
//     <span>{label}</span>
//   </button>
// );

// export default AdminDashboard;
// src/pages/AdminDashboard.jsx
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
      {/* Admin Navbar */}
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

      {/* Main Content */}
      <div className="pt-[64px] px-4">
        <Outlet context={{ admin }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
