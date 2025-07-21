import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

const StudentProfile = () => {
  const { currentUserData, currentUserId, isLoading: contextLoading } = useUser();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentEvents = async () => {
      try {
        if (!currentUserId) throw new Error("Student authentication required");

        setIsLoading(true);
        setError(null);

        const response = await fetch(`${BASE_URL}/api/students/${currentUserId}/events`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Event fetch error:", err);
        setError(err.message);
        if (err.message.includes("authentication")) navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (!contextLoading) {
      fetchStudentEvents();
    }
  }, [currentUserId, contextLoading, navigate]);

  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((e) => e.date && new Date(e.date) >= new Date(today));
  const completedEvents = events.filter((e) => e.date && new Date(e.date) < new Date(today));

  if (contextLoading || isLoading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!currentUserData || !currentUserId) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 mb-4 text-lg">Please login to view your profile</div>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        <p className="mb-4">Error loading profile: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen px-4 py-6 sm:px-6 md:px-8"
    >
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-indigo-800 drop-shadow flex items-center gap-2">
          👤 Student Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl shadow mb-10">
        <Field label="Name" value={currentUserData.name} />
        <Field label="Email" value={currentUserData.email} />
        <Field label="PRN" value={currentUserData.prn} />
        <Field label="Phone" value={currentUserData.phone} />
        <Field label="Department" value={currentUserData.department} />
        <Field label="Class" value={currentUserData.studentClass} />
        <Field label="Status" value={currentUserData.status} />
      </div>

      <div className="space-y-10">
        <EventSection title="📅 Upcoming Events" color="green" events={upcomingEvents} />
        <EventSection title="✅ Completed Events" color="gray" events={completedEvents} />
      </div>
    </motion.div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-500 block mb-1">{label}</label>
    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-800 font-medium shadow-sm text-sm sm:text-base">
      {value || "Not specified"}
    </div>
  </div>
);

const EventSection = ({ title, events, color }) => {
  const colorMap = {
    green: {
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-400",
    },
    gray: {
      text: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-400",
    },
  };

  const colorClasses = colorMap[color] || colorMap.gray;

  return (
    <div>
      <h3 className={`text-xl sm:text-2xl font-bold ${colorClasses.text} mb-3`}>{title}</h3>
      {events.length === 0 ? (
        <p className="italic text-gray-400 px-4 py-3 bg-white rounded shadow text-sm">
          No {title.includes("Upcoming") ? "upcoming" : "completed"} events.
        </p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl p-4 shadow-sm border-l-4 ${colorClasses.border} ${colorClasses.bg}`}
            >
              <h4 className="font-bold text-base sm:text-lg text-indigo-800">{event.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(event.date).toLocaleDateString()} @ {event.venue}
              </p>
              <p className="text-sm text-gray-500 mt-1">{event.description}</p>
              <p className="text-xs text-gray-400 mt-2">Organized by: {event.organizer}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
