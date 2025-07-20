

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
// import EventEnrollment from "./pages/EventEnrollment";
// import BugReportForm from "./pages/BugReportForm"

// // Admin Components
// import AdminDashboard from "./pages/AdminDashboard";
// import StudentManagement from "./pages/StudentManagement";
// import EventManagement from "./pages/EventManagement";
// import MediaFileAdmin from "./pages/MediaFileAdmin";
// import AdminAnnouncement from "./pages/AdminAnnoucement";
// import AdminSettings from "./pages/AdminSettings";
// import AdminBugReports from "./pages/AdminBugReports"

// // Protected Routes
// import StudentRoute from "./components/StudentRoute";
// import AdminRoute from "./components/AdminRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* 🌐 Public Layout with Navbar/Footer */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//           <Route path="admin/login" element={<AdminLogin />} />

//           {/* 🎓 Student Protected Routes with Dashboard Layout */}
//           <Route element={<StudentRoute />}>
//             <Route path="student" element={<StudentDashboard />}>
//               <Route path="events" element={<StudentEvents />} />
//               <Route path="events/enroll/:id" element={<EventEnrollment />} />
//               <Route path="mediafiles" element={<StudentMediaFiles />} />
//               <Route path="announcements" element={<StudentAnnouncements />} />
//               <Route path="profile" element={<StudentProfile />} />
//               <Route index element={<Navigate to="events" />} />
//               <Route path="/student/report-bug" element={<BugReportForm />} />

//             </Route>
//           </Route>

//           {/* 🛠️ Admin Protected Routes with Dashboard Layout */}
//           <Route element={<AdminRoute />}>
//             <Route path="admin" element={<AdminDashboard />}>
//               <Route path="students" element={<StudentManagement />} />
//               <Route path="events" element={<EventManagement />} />
//               <Route path="mediafiles" element={<MediaFileAdmin />} />
//               <Route path="announcements" element={<AdminAnnouncement />} />
//               <Route path="settings" element={<AdminSettings />} />
//               <Route path="/admin/bug-reports" element={<AdminBugReports />} />

//               <Route index element={<Navigate to="students" />} />
//             </Route>
//           </Route>

//           {/* 🔁 Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

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
import BugReportForm from "./pages/BugReportForm";

// Admin Components
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import EventManagement from "./pages/EventManagement";
import MediaFileAdmin from "./pages/MediaFileAdmin";
import AdminAnnouncement from "./pages/AdminAnnoucement";
import AdminSettings from "./pages/AdminSettings";
import AdminBugReports from "./pages/AdminBugReports";

// Protected Routes
import StudentRoute from "./components/StudentRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const { isLoading } = useUser(); // ✅ wait until auth is restored

  if (isLoading) {
    return <div className="p-10 text-center text-indigo-600">Restoring session...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Student routes */}
        <Route element={<StudentRoute />}>
          <Route path="student" element={<StudentDashboard />}>
            <Route path="events" element={<StudentEvents />} />
            <Route path="events/enroll/:id" element={<EventEnrollment />} />
            <Route path="mediafiles" element={<StudentMediaFiles />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="report-bug" element={<BugReportForm />} />
            <Route index element={<Navigate to="events" />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />}>
            <Route path="students" element={<StudentManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="mediafiles" element={<MediaFileAdmin />} />
            <Route path="announcements" element={<AdminAnnouncement />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="bug-reports" element={<AdminBugReports />} />
            <Route index element={<Navigate to="students" />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
