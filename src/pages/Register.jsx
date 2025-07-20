import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    prn: "",
    department: "",
    studentClass: "",
    phone: ""
  });

  const [validation, setValidation] = useState({
    email: { valid: false, message: "" },
    phone: { valid: false, message: "" },
    prn: { valid: false, message: "" }
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") validateEmail(value);
    if (name === "phone") validatePhone(value);
    if (name === "prn") validatePrn(value);
  };

  const validateEmail = (email) => {
    const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "edu.in"];
    const domain = email.split("@")[1];
    const isValid = domain && validDomains.includes(domain);

    setValidation(prev => ({
      ...prev,
      email: {
        valid: isValid,
        message: isValid ? "" : "Only Gmail, Yahoo, Outlook or edu.in emails allowed"
      }
    }));
  };

  const validatePhone = (phone) => {
    const isValid = /^\d{10}$/.test(phone);
    setValidation(prev => ({
      ...prev,
      phone: {
        valid: isValid,
        message: isValid ? "" : "Phone number must be 10 digits"
      }
    }));
  };

  const validatePrn = (prn) => {
    const isValid = /^[a-zA-Z0-9]{10,12}$/.test(prn);
    setValidation(prev => ({
      ...prev,
      prn: {
        valid: isValid,
        message: isValid ? "" : "PRN must be 10-12 alphanumeric characters"
      }
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validation.email.valid || !validation.phone.valid || !validation.prn.valid) {
      setMessage({ text: "Please fix validation errors before submitting", isError: true });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMessage({ text: "Registration successful! Redirecting to login...", isError: false });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ text: error.message, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-indigo-200 rounded-2xl shadow-2xl px-8 py-10 animate-fade-in"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">🎓 Register</h2>
          <p className="text-gray-600 mt-1">Create your student account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition pr-10"
            />
            {formData.email && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {validation.email.valid ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </span>
            )}
          </div>
          {formData.email && !validation.email.valid && (
            <p className="text-sm text-red-600">{validation.email.message}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="6"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />

          <div className="relative">
            <input
              type="text"
              name="prn"
              placeholder="PRN Number"
              required
              value={formData.prn}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition pr-10"
            />
            {formData.prn && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {validation.prn.valid ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </span>
            )}
          </div>
          {formData.prn && !validation.prn.valid && (
            <p className="text-sm text-red-600">{validation.prn.message}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="department"
              placeholder="Department"
              required
              value={formData.department}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
            <input
              type="text"
              name="studentClass"
              placeholder="Class"
              required
              value={formData.studentClass}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition pr-10"
            />
            {formData.phone && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {validation.phone.valid ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </span>
            )}
          </div>
          {formData.phone && !validation.phone.valid && (
            <p className="text-sm text-red-600">{validation.phone.message}</p>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.prn ||
              !formData.department ||
              !formData.studentClass ||
              !formData.phone ||
              !validation.email.valid ||
              !validation.phone.valid ||
              !validation.prn.valid
            }
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login here
            </Link>
          </p>
        </div>

        {message.text && (
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              message.isError
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
