import { useState } from "react";

const BugReportForm = () => {
  const [form, setForm] = useState({ studentName: "", message: "" });
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("studentName", form.studentName);
    formData.append("message", form.message);
    if (screenshot) formData.append("screenshot", screenshot);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bug-reports`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow rounded-2xl space-y-4">
        <h2 className="text-2xl font-bold text-indigo-700 text-center">🐞 Report a Bug</h2>
        {submitted ? (
          <p className="text-green-600 text-center text-sm sm:text-base">
            Thanks! We'll fix it soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="studentName"
              placeholder="Your Name"
              required
              value={form.studentName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm"
            />
            <textarea
              name="message"
              placeholder="Describe the issue"
              required
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md h-32 text-sm resize-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BugReportForm;
