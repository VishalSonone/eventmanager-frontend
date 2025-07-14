import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, FileText } from "lucide-react";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("https://eventmanager-backend-1-5121.onrender.com/api/announcements/student");
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("❌ Error:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen px-6 py-6 bg-gradient-to-br from-indigo-50 to-purple-100"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-indigo-600" size={28} />
        <h1 className="text-3xl font-extrabold text-indigo-800 drop-shadow-sm">
          📣 Announcements
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center text-gray-500 text-sm">Loading announcements...</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">{error}</div>
        )}
        {!isLoading && announcements.length === 0 && (
          <p className="text-center text-gray-400 italic">No announcements available.</p>
        )}

        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-indigo-700">
                {announcement.title}
              </h3>
              <span className="text-xs text-gray-500">
                {new Date(announcement.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{announcement.content}</p>

            {announcement.fileName && (
              <a
                href={`https://eventmanager-backend-1-5121.onrender.com/api/announcements/${announcement.id}/file`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline gap-1"
              >
                <FileText size={16} />
                {announcement.fileName}
              </a>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentAnnouncements;
