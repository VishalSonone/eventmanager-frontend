import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save } from "lucide-react";

const AdminSettings = () => {
  const [adminDetails, setAdminDetails] = useState({
    email: "",
    fullName: "",
    contactNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
  const fetchAdminDetails = async () => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      const adminEmail = parsed?.admin?.email;

      if (!adminEmail) {
        setError("Admin email not found in local storage.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/details?email=${adminEmail}`);
      if (!response.ok) throw new Error("Failed to fetch admin details.");

      const data = await response.json();
      setAdminDetails({
        ...data,
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      setError("Failed to fetch admin details");
    } finally {
      setIsLoading(false);
    }
  };

  fetchAdminDetails();
}, []);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (adminDetails.password !== adminDetails.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/admin/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adminDetails)
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedAdmin = await response.json();
      setAdminDetails({
        ...updatedAdmin,
        password: "",
        confirmPassword: ""
      });
      setSuccess("Details updated successfully");
    } catch (error) {
      setError(error.message || "An error occurred while updating");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center overflow-hidden"
    >
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-indigo-200 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-indigo-700 flex items-center justify-center gap-2">
          <User className="text-indigo-600" /> Admin Settings
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={adminDetails.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={adminDetails.fullName}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={adminDetails.contactNumber}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, contactNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Leave blank to keep current"
                value={adminDetails.password}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, password: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Leave blank to keep current"
                value={adminDetails.confirmPassword}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
