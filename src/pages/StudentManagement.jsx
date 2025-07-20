import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { BASE_URL } from "../api";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [animateRow, setAnimateRow] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/students`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        else console.error("Unexpected data format:", data);
      })
      .catch((err) => console.error("Error fetching students:", err.message));
  }, []);

  const counts = {
    total: students.length,
    approved: students.filter((s) => s.status === "approved").length,
    pending: students.filter((s) => s.status === "pending").length,
    rejected: students.filter((s) => s.status === "rejected").length,
  };

  const filteredStudents = students.filter((student) => {
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const triggerRowAnimation = (id) => {
    setAnimateRow(id);
    setTimeout(() => setAnimateRow(null), 700);
  };

  const handleAction = (id, action) => {
    fetch(`${BASE_URL}/api/students/${id}/${action}`, {
      method: "PUT",
    })
      .then(() => {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: action === "approve" ? "approved" : "rejected" } : s
          )
        );
        triggerRowAnimation(id);
      })
      .catch((err) => console.error(`Error on ${action}:`, err));
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/api/students/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        triggerRowAnimation(id);
      })
      .catch((err) => console.error("Error deleting student:", err));
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setEditData({ ...student });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = (id) => {
    fetch(`${BASE_URL}/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then(() => {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...editData } : s))
        );
        cancelEdit();
        triggerRowAnimation(id);
      })
      .catch((err) => console.error("Error updating student:", err));
  };

  const renderStatus = (status) => {
    const color =
      status === "approved"
        ? "green"
        : status === "rejected"
        ? "red"
        : "yellow";
    return (
      <span className={`text-${color}-700 bg-${color}-100 px-2 py-1 rounded-full text-xs capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 text-sm font-semibold">
          <span className="text-gray-700">Total: {counts.total}</span>
          <span className="text-green-600">Approved: {counts.approved}</span>
          <span className="text-yellow-600">Pending: {counts.pending}</span>
          <span className="text-red-600">Rejected: {counts.rejected}</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 border rounded text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              {[
                "ID",
                "Name",
                "Email",
                "PRN",
                "Department",
                "Class",
                "Password",
                "Status",
                "Actions",
              ].map((head) => (
                <th key={head} className="px-3 py-2 border">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className={`transition-all ${animateRow === student.id ? "bg-green-50" : ""
                  } hover:bg-gray-50`}
              >
                <td className="px-3 py-2 border">{student.id}</td>
                <td className="px-3 py-2 border">
                  {editId === student.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td className="px-3 py-2 border">
                  {editId === student.id ? (
                    <input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    student.email
                  )}
                </td>
                <td className="px-3 py-2 border">{student.prn}</td>
                <td className="px-3 py-2 border">{student.department}</td>
                <td className="px-3 py-2 border">{student.studentClass}</td>
                <td className="px-3 py-2 border text-center">••••••••</td>
                <td className="px-3 py-2 border">{renderStatus(student.status)}</td>
                <td className="px-3 py-2 border flex gap-1 flex-wrap justify-center">
                  {editId === student.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(student.id)}
                        className="px-2 py-1 border rounded bg-blue-100 text-blue-600 flex items-center gap-1"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 border rounded bg-gray-100 text-gray-600 flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-2 py-1 border rounded text-green-600 hover:bg-green-50"
                        onClick={() => handleAction(student.id, "approve")}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-yellow-600 hover:bg-yellow-50"
                        onClick={() => handleAction(student.id, "reject")}
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-blue-600 hover:bg-blue-50"
                        onClick={() => startEdit(student)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentManagement;
