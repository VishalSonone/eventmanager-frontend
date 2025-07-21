import React, { useEffect, useState } from "react";
import { api } from "../api";

function MediaFileUser() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/api/media/list")
      .then(res => res.json())
      .then(setFiles)
      .catch(() => {});
  }, []);

  const filteredFiles = files.filter((file) => {
    const matchesType =
      (activeTab === "images" && file.fileType === "image") ||
      (activeTab === "documents" && file.fileType === "document");
    const matchesSearch = file.originalName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-700">📁 Media Files</h2>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-2 rounded ${
            activeTab === "images"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📷 Photos
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded ${
            activeTab === "documents"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📄 Documents
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search by file name..."
        className="w-full border rounded px-3 py-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.filename}
            className="border rounded p-3 shadow-sm hover:shadow-md bg-white transition"
          >
            {file.fileType === "image" ? (
              <img
                src={
                  file.filePath.startsWith("/")
                    ? file.filePath
                    : `/uploads/media/${file.filename}`
                }
                alt={file.originalName}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="text-gray-800 font-semibold truncate">
                📄 {file.originalName}
              </div>
            )}

            <div className="mt-2 text-sm flex justify-between items-center">
              <a
                href={file.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Preview
              </a>
              <a
                href={file.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Download
              </a>
            </div>
          </div>
        ))}

        {filteredFiles.length === 0 && (
          <p className="text-gray-500 italic col-span-full">
            No files found.
          </p>
        )}
      </div>
    </div>
  );
}

export default MediaFileUser;
