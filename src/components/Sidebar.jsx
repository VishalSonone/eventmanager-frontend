// // src/components/Sidebar.jsx
// import { Link, useLocation } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();

//   const navItems = [
//     { path: "/student/events", icon: "📅", label: "Events" },
//     { path: "/student/mediafiles", icon: "📁", label: "Media Files" },
//     { path: "/student/announcements", icon: "📢", label: "Announcements" },
//     { path: "/student/profile", icon: "👤", label: "Profile" },
//   ];

//   return (
//     <div className="w-64 bg-indigo-700 text-white p-4 flex flex-col">
//       <div className="p-4 text-xl font-bold border-b border-indigo-600">
//         Student Dashboard
//       </div>
//       <nav className="mt-6 flex-1">
//         <ul className="space-y-2">
//           {navItems.map((item) => (
//             <li key={item.path}>
//               <Link
//                 to={item.path}
//                 className={`flex items-center gap-3 px-4 py-3 rounded transition ${
//                   location.pathname === item.path
//                     ? "bg-indigo-800 font-semibold"
//                     : "hover:bg-indigo-600"
//                 }`}
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 <span>{item.label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//       <div className="mt-auto pt-4 border-t border-indigo-600">
//         <Link
//           to="/logout"
//           className="flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-indigo-600 rounded transition"
//         >
//           <span>🚪</span>
//           <span>Logout</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
