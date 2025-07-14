// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// // Layout with Navbar + Footer
// import Layout from "./components/Layout";

// // Public Pages
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Login from "./pages/Login";
// import AdminLogin from "./pages/AdminLogin";
// import Register from "./pages/Register";

// // Student Components
// import StudentDashboard from "./components/StudentDashboard";
// import StudentEvents from "./pages/StudentEvents";
// import StudentMediaFiles from "./pages/StudentMediaFiles";
// import StudentAnnouncements from "./pages/StudentAnnouncements";
// import StudentProfile from "./pages/StudentProfile";

// // Admin Pages
// import AdminDashboard from "./pages/AdminDashboard";
// import StudentManagement from "./pages/StudentManagement";
// import MediaFileAdmin from "./pages/MediaFileAdmin";
// import AdminAnnouncement from "./pages/AdminAnnoucement";

// // Protected Routes
// import StudentRoute from "./components/StudentRoute";
// import AdminRoute from "./components/AdminRoute";
// import EventEnrollment from "./pages/EventEnrollment"

// // ... (previous imports remain the same)

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* All Routes share Layout (Navbar + Footer) */}
//         <Route path="/" element={<Layout />}>
//           {/* 🌐 Public Routes */}
//           <Route index element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="login" element={<Login />} />
//           <Route path="admin/login" element={<AdminLogin />} />
//           <Route path="register" element={<Register />} />

//           {/* 🎓 Student Protected Routes */}
//           <Route element={<StudentRoute />}>
//             <Route path="student/events" element={<StudentEvents />} />
//             <Route path="student/events/enroll/:id" element={<EventEnrollment />} />
//             <Route path="student/mediafiles" element={<StudentMediaFiles />} />
//             <Route path="student/announcements" element={<StudentAnnouncements />} />
//             <Route path="student/profile" element={<StudentProfile />} />
//           </Route>

//           {/* 🛠️ Admin Protected Routes */}
//           <Route element={<AdminRoute />}>
//             <Route path="admin/dashboard" element={<AdminDashboard />} />
//             <Route path="admin/studentmanagement" element={<StudentManagement />} />
//             <Route path="admin/mediafiles" element={<MediaFileAdmin />} />
//             <Route path="admin/announcements" element={<AdminAnnouncement />} />
//           </Route>

//           {/* 🔁 Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout with Navbar + Footer
import Layout from "./components/Layout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";

// Student Components
import StudentDashboard from "./components/StudentDashboard";
import StudentEvents from "./pages/StudentEvents";
import StudentMediaFiles from "./pages/StudentMediaFiles";
import StudentAnnouncements from "./pages/StudentAnnouncements";
import StudentProfile from "./pages/StudentProfile";
import EventEnrollment from "./pages/EventEnrollment";

// Admin Components
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import EventManagement from "./pages/EventManagement";
import MediaFileAdmin from "./pages/MediaFileAdmin";
import AdminAnnouncement from "./pages/AdminAnnoucement";
import AdminSettings from "./pages/AdminSettings";

// Protected Routes
import StudentRoute from "./components/StudentRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Layout with Navbar/Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin/login" element={<AdminLogin />} />

          {/* 🎓 Student Protected Routes with Dashboard Layout */}
          <Route element={<StudentRoute />}>
            <Route path="student" element={<StudentDashboard />}>
              <Route path="events" element={<StudentEvents />} />
              <Route path="events/enroll/:id" element={<EventEnrollment />} />
              <Route path="mediafiles" element={<StudentMediaFiles />} />
              <Route path="announcements" element={<StudentAnnouncements />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route index element={<Navigate to="events" />} />
            </Route>
          </Route>

          {/* 🛠️ Admin Protected Routes with Dashboard Layout */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />}>
              <Route path="students" element={<StudentManagement />} />
              <Route path="events" element={<EventManagement />} />
              <Route path="mediafiles" element={<MediaFileAdmin />} />
              <Route path="announcements" element={<AdminAnnouncement />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route index element={<Navigate to="students" />} />
            </Route>
          </Route>

          {/* 🔁 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
