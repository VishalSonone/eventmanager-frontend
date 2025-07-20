import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, FileText } from 'lucide-react';
import { api, BASE_URL } from '../api';

const AdminAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    target: 'all',
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/announcements');
      if (!response.ok) throw new Error('Failed to fetch announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      setError('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newAnnouncement.title || !newAnnouncement.content) {
      setError('Title and content are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', newAnnouncement.title);
    formData.append('content', newAnnouncement.content);
    formData.append('target', newAnnouncement.target);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await api.post('/api/announcements', formData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create announcement');
      }

      const result = await response.json();
      setAnnouncements([result, ...announcements]);
      setNewAnnouncement({ title: '', content: '', target: 'all' });
      setFile(null);
      document.getElementById('file-upload').value = '';
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/api/announcements/${id}`);
      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a.id !== id));
      } else {
        throw new Error('Failed to delete announcement');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6 bg-gradient-to-br from-indigo-100 to-purple-200 min-h-screen"
    >
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📢 Create Announcement</h2>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <textarea
            placeholder="Content"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <select
            value={newAnnouncement.target}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="all">All Users</option>
            <option value="students">Students Only</option>
            <option value="faculty">Faculty Only</option>
          </select>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <Plus size={16} /> Create Announcement
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📄 All Announcements</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 italic">No announcements found.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800">{a.title}</h3>
                    <p className="text-gray-700 mt-1 text-sm">{a.content}</p>
                    {a.fileName && (
                      <a
                        href={`${BASE_URL}/api/announcements/${a.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        <FileText size={14} /> {a.fileName}
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {a.target === 'all'
                      ? 'All Users'
                      : a.target === 'students'
                      ? 'Students Only'
                      : 'Faculty Only'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminAnnouncement;
