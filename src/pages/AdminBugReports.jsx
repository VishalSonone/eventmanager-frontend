import { useEffect, useState } from "react";

const AdminBugReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/bug-reports")
      .then((res) => res.json())
      .then(setReports);
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/bug-reports/${id}`, {
      method: "DELETE",
    });
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">📋 Submitted Bug Reports</h2>
      {reports.map((r) => (
        <div key={r.id} className="border rounded p-4 shadow bg-white space-y-2">
          <div className="font-medium">{r.studentName}</div>
          <p className="text-sm text-gray-600">
            {new Date(r.submittedAt).toLocaleString()}
          </p>
          <p>{r.message}</p>
          {r.screenshotUrl && (
            <a
              href={`http://localhost:8080${r.screenshotUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Screenshot
            </a>
          )}
          <button
            onClick={() => handleDelete(r.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminBugReports;
