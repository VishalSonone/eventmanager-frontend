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

    const res = await fetch("http://localhost:8080/api/bug-reports", {
      method: "POST",
      body: formData,
    });

    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-indigo-700">🐞 Report a Bug</h2>
      {submitted ? (
        <p className="text-green-600">Thanks! We'll fix it soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="studentName"
            placeholder="Your Name"
            required
            value={form.studentName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="message"
            placeholder="Describe the issue"
            required
            value={form.message}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BugReportForm;
