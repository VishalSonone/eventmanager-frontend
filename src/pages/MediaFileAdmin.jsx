import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const fetchFiles = () => {
    axios.get("/api/media/list", { params: filters })
      .then(res => setFiles(res.data))
      .catch(err => toast.error("Error fetching files"));
  };

  useEffect(() => fetchFiles(), [filters]);

  const handleUpload = () => {
    if (!selectedFile) return toast.warn("Please select a file");
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("eventName", metadata.eventName || '');

    axios.post("/api/media/upload", data, {
      onUploadProgress: ({ loaded, total }) => setUploadProgress((loaded/total)*100)
    })
      .then(() => {
        toast.success("Upload successful");
        setSelectedFile(null);
        setUploadProgress(0);
        fetchFiles();
      })
      .catch(() => toast.error("Upload failed"));
  };

  const handleDelete = filename => {
    axios.delete(`/api/media/delete/${filename}`)
      .then(() => {
        toast.info("File deleted");
        fetchFiles();
      })
      .catch(() => toast.error("Delete failed"));
  };

  const handleSave = filename => {
    axios.put(`/api/media/update/${filename}`, metadata)
      .then(() => {
        toast.success("Metadata updated");
        setEditing(null);
        fetchFiles();
      })
      .catch(() => toast.error("Update failed"));
  };

  const isImage = name => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  const isDocument = name=> /\.(pdf|docx?|txt|pptx?)$/i.test(name);

  return (
    <div className="p-6 space-y-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold">🎛 Admin Media Manager</h2>

      {/* Upload section */}
      <div className="flex items-center gap-3">
        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Optional: Event Name"
          value={metadata.eventName}
          onChange={e => setMetadata({...metadata, eventName: e.target.value})}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleUpload} className="bg-green-600 text-white px-3 py-1 rounded">
          Upload
        </button>
        {uploadProgress > 0 && (
          <progress value={uploadProgress} max="100" className="w-1/4" />
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search"
          className="border px-2 py-1 rounded"
          value={filters.search}
          onChange={e => setFilters(f => ({...f, search: e.target.value}))}
        />
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({...f, type: e.target.value}))}
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
          onChange={e => setFilters(f => ({...f, eventName: e.target.value}))}
        />
        <input
          type="date"
          value={filters.fromDate}
          onChange={e => setFilters(f => ({...f, fromDate: e.target.value}))}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={e => setFilters(f => ({...f, toDate: e.target.value}))}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Admin files grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.filename} className="border rounded p-4 space-y-2 bg-white">
            {isImage(f.filename) ? (
              <img src={f.filePath} alt={f.originalName} className="w-full h-40 object-cover rounded" />
            ) : (
              <div className="text-gray-700 font-semibold">📄 {f.originalName}</div>
            )}
            <div><strong>Uploaded:</strong> {new Date(f.uploadedAt).toLocaleString()}</div>

            {/* Editable metadata */}
            <div>
              {editing === f.filename ? (
                <>
                  <input
                    type="text"
                    value={metadata.originalName}
                    onChange={e => setMetadata(md => ({...md, originalName: e.target.value}))}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    value={metadata.eventName}
                    onChange={e => setMetadata(md => ({...md, eventName: e.target.value}))}
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

            {/* Actions */}
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
