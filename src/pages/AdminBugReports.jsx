import { useEffect, useState } from "react";
import { api } from "../api";

const AdminBugReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/api/bug-reports");
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch bug reports:", error);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/bug-reports/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete bug report:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-8 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4">
        📋 Submitted Bug Reports
      </h2>
      {reports.map((r) => (
        <div
          key={r.id}
          className="border rounded-lg p-4 bg-white shadow space-y-2 text-sm sm:text-base"
        >
          <div className="font-medium break-words">{r.studentName}</div>
          <p className="text-gray-600">
            {new Date(r.submittedAt).toLocaleString()}
          </p>
          <p className="break-words">{r.message}</p>

          {r.screenshotUrl && (
            <a
              href={r.screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all inline-block"
            >
              View Screenshot
            </a>
          )}

          <button
            onClick={() => handleDelete(r.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminBugReports;
