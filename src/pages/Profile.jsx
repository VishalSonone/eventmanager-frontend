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
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200"
    >
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center animate-fade-in-up">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">Student Profile</h2>
        <p className="text-gray-600 mb-6">Your account details</p>

        <div className="space-y-3 text-left text-sm">
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">👤</span>
            <strong>Name:</strong> {student.name}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">📧</span>
            <strong>Email:</strong> {student.email}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">🏫</span>
            <strong>Department:</strong> {student.department}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">🆔</span>
            <strong>PRN:</strong> {student.prn}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">📚</span>
            <strong>Class:</strong> {student.studentClass}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">📱</span>
            <strong>Phone:</strong> {student.phone}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-indigo-600">🔒</span>
            <strong>Status:</strong> 
            <span className={`px-2 py-1 rounded-full text-xs ${
              student.status === 'approved' ? 'bg-green-100 text-green-800' :
              student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {student.status}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;