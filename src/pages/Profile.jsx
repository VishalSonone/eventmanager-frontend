import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const { student } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!student) {
      navigate("/login");
    }
  }, [student, navigate]);

  if (!student) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 px-4 sm:px-6"
    >
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-2">Student Profile</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Your account details</p>

        <div className="space-y-3 text-left text-sm sm:text-base">
          <ProfileItem icon="👤" label="Name" value={student.name} />
          <ProfileItem icon="📧" label="Email" value={student.email} />
          <ProfileItem icon="🏫" label="Department" value={student.department} />
          <ProfileItem icon="🆔" label="PRN" value={student.prn} />
          <ProfileItem icon="📚" label="Class" value={student.studentClass} />
          <ProfileItem icon="📱" label="Phone" value={student.phone} />
          <p className="flex items-center gap-2 flex-wrap">
            <span className="text-indigo-600">🔒</span>
            <strong>Status:</strong>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                student.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : student.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {student.status}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <p className="flex items-center gap-2 flex-wrap break-words">
    <span className="text-indigo-600">{icon}</span>
    <strong>{label}:</strong> <span className="truncate">{value}</span>
  </p>
);

export default Profile;
