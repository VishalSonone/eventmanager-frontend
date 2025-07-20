import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function MediaFileAdmin() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

    const res = await fetch(`/api/media/list?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    } else {
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
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        toast.success("Upload successful");
        setSelectedFile(null);
        setUploadProgress(0);
        fetchFiles();
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Error uploading file");
    }
  };

  const handleDelete = async (filename) => {
    const res = await fetch(`/api/media/delete/${filename}`, {
      method: "DELETE"
    });

    if (res.ok) {
      toast.info("File deleted");
      fetchFiles();
    } else {
      toast.error("Delete failed");
    }
  };

  const handleSave = async (filename) => {
    const res = await fetch(`/api/media/update/${filename}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata)
    });

    if (res.ok) {
      toast.success("Metadata updated");
      setEditing(null);
      fetchFiles();
    } else {
      toast.error("Update failed");
    }
  };

  const isImage = name => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  const isDocument = name => /\.(pdf|docx?|txt|pptx?)$/i.test(name);

  return (
    <div className="p-6 space-y-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold">🎛 Admin Media Manager</h2>

      {/* Upload */}
      <div className="flex items-center gap-3">
        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Optional: Event Name"
          value={metadata.eventName}
          onChange={e => setMetadata({ ...metadata, eventName: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleUpload} className="bg-green-600 text-white px-3 py-1 rounded">
          Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search"
          className="border px-2 py-1 rounded"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
        </select>
        <input
          type="text"
          placeholder="Event Name"
          className="border px-2 py-1 rounded"
          value={filters.eventName}
          onChange={e => setFilters(f => ({ ...f, eventName: e.target.value }))}
        />
      </div>

      {/* File list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.filename} className="border rounded p-4 space-y-2 bg-white">
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
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    value={metadata.eventName}
                    onChange={e => setMetadata(m => ({ ...m, eventName: e.target.value }))}
                    className="border px-2 py-1 rounded w-full mt-1"
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
              <a href={f.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {isImage(f.filename) ? "Preview" : "Download"}
              </a>
              {editing === f.filename ? (
                <button onClick={() => handleSave(f.filename)} className="text-green-600 font-medium">Save</button>
              ) : (
                <button onClick={() => {
                  setEditing(f.filename);
                  setMetadata({ originalName: f.originalName, eventName: f.eventName || '' });
                }} className="text-yellow-600">Edit</button>
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
