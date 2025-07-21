import React, { useEffect, useState } from "react";
import { FiImage, FiFileText } from "react-icons/fi";
import { FaDownload, FaEye } from "react-icons/fa";
import { BASE_URL } from "../api";

const StudentMediaFiles = () => {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/media/list`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredFiles = files.filter((file) => {
    const type = file.fileType?.toLowerCase();
    const isImage = type === "image";
    const isDocument = ["pdf", "doc", "docx", "xls", "xlsx"].includes(type);

    const matchesTab =
      (activeTab === "images" && isImage) ||
      (activeTab === "documents" && isDocument);

    const matchesSearch = file.originalName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 drop-shadow-lg">
          📁 Your Media Gallery
        </h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Explore uploaded photos and documents with preview & download.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("images")}
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition ${
              activeTab === "images"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            📷 Images
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition ${
              activeTab === "documents"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            📄 Documents
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Search files..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="rounded-2xl bg-white shadow-lg p-4 relative hover:shadow-indigo-300 transition-all border border-gray-200"
            >
              <span className="absolute top-2 right-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full shadow-sm">
                {file.fileType.toUpperCase()}
              </span>

              {file.fileType.toLowerCase() === "image" ? (
                <img
                  src={file.filePath} // Cloudinary URL
                  alt={file.originalName}
                  className="w-full h-48 object-cover rounded-xl transform hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-xl text-center p-4 text-indigo-700">
                  <FiFileText className="text-5xl mb-2" />
                  <p className="font-medium text-sm line-clamp-2">
                    {file.originalName}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center text-sm text-gray-700 font-medium">
                <a
                  href={file.filePath} // Cloudinary URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <FaEye /> <span>Preview</span>
                </a>
                <a
                  href={file.filePath} // Cloudinary URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-600 hover:underline"
                >
                  <FaDownload /> <span>Download</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 italic text-base sm:text-lg">
            No matching files found.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMediaFiles;
