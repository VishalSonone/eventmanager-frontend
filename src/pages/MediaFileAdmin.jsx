import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../api";
import "react-toastify/dist/ReactToastify.css";

function MediaFileAdmin() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    eventName: "",
    fromDate: "",
    toDate: ""
  });
  const [editing, setEditing] = useState(null);
  const [metadata, setMetadata] = useState({ originalName: "", eventName: "" });

  const fetchFiles = async () => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.type !== "all") params.append("type", filters.type);
    if (filters.eventName) params.append("eventName", filters.eventName);
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);

    try {
      const res = await api.get(`/api/media/list?${params.toString()}`);
      const data = await res.json();
      setFiles(data);
    } catch {
      toast.error("Error fetching files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [filters]);

  const handleUpload = async () => {
    if (!selectedFile) return toast.warn("Please select a file");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("eventName", metadata.eventName || "");

    try {
      const res = await api.post("/api/media/upload", formData);
      if (!res.ok) throw new Error();
      toast.success("Upload successful");
      setSelectedFile(null);
      fetchFiles();
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await api.delete(`/api/media/delete/${filename}`);
      if (!res.ok) throw new Error();
      toast.info("File deleted");
      fetchFiles();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSave = async (filename) => {
    try {
      const res = await api.put(`/api/media/update/${filename}`, metadata);
      if (!res.ok) throw new Error();
      toast.success("Metadata updated");
      setEditing(null);
      fetchFiles();
    } catch {
      toast.error("Update failed");
    }
  };

  const isImage = name => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <ToastContainer />
      <h2 className="text-xl sm:text-2xl font-bold">🎛 Admin Media Manager</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
        <input
          type="file"
          onChange={e => setSelectedFile(e.target.files[0])}
          className="w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Optional: Event Name"
          value={metadata.eventName}
          onChange={e => setMetadata({ ...metadata, eventName: e.target.value })}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Upload
        </button>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search"
          className="border px-3 py-2 rounded w-full sm:w-48"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          className="border px-3 py-2 rounded w-full sm:w-40"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
        </select>
        <input
          type="text"
          placeholder="Event Name"
          className="border px-3 py-2 rounded w-full sm:w-48"
          value={filters.eventName}
          onChange={e => setFilters(f => ({ ...f, eventName: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.filename} className="border rounded p-4 space-y-2 bg-white shadow-sm">
            {isImage(f.filename) ? (
              <img
                src={f.filePath.startsWith("/") ? f.filePath : `/uploads/media/${f.filename}`}
                alt={f.originalName}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="text-gray-700 font-semibold">📄 {f.originalName}</div>
            )}
            <div><strong>Uploaded:</strong> {new Date(f.uploadedAt).toLocaleString()}</div>
            <div>
              {editing === f.filename ? (
                <>
                  <input
                    type="text"
                    value={metadata.originalName}
                    onChange={e => setMetadata(m => ({ ...m, originalName: e.target.value }))}
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="text"
                    value={metadata.eventName}
                    onChange={e => setMetadata(m => ({ ...m, eventName: e.target.value }))}
                    className="border px-3 py-2 rounded w-full mt-2"
                  />
                </>
              ) : (
                <>
                  <div><strong>Name:</strong> {f.originalName}</div>
                  <div><strong>Event:</strong> {f.eventName || "N/A"}</div>
                </>
              )}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <a
                href={f.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {isImage(f.filename) ? "Preview" : "Download"}
              </a>
              {editing === f.filename ? (
                <button onClick={() => handleSave(f.filename)} className="text-green-600 font-medium">Save</button>
              ) : (
                <button
                  onClick={() => {
                    setEditing(f.filename);
                    setMetadata({ originalName: f.originalName, eventName: f.eventName || '' });
                  }}
                  className="text-yellow-600"
                >
                  Edit
                </button>
              )}
              <button onClick={() => handleDelete(f.filename)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaFileAdmin;
