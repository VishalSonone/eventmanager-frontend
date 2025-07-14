import React, { useEffect, useState } from "react";
import { Users, X } from "lucide-react";

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    venue: "",
    organizer: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [viewingParticipants, setViewingParticipants] = useState(null);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://eventmanager-backend-1-5121.onrender.com/api/events");
      const data = await res.json();
      const today = new Date().toISOString().split("T")[0];
      const processed = data.map((e) => ({
        ...e,
        status: e.date >= today ? "upcoming" : "completed",
      }));
      setEvents(processed);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const response = await fetch(
        `https://eventmanager-backend-1-5121.onrender.com/api/enrollments/${eventId}/participants`
      );
      const participants = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, participants } : event
        )
      );
      setLoadingParticipants(false);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setLoadingParticipants(false);
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setNewEvent({
      name: "",
      description: "",
      type: "",
      date: "",
      venue: "",
      organizer: "",
    });
    setEditingEventId(null);
  };

  const handleAddOrUpdateEvent = async () => {
    const method = editingEventId ? "PUT" : "POST";
    const url = editingEventId
      ? `https://eventmanager-backend-1-5121.onrender.com/api/events/${editingEventId}`
      : "https://eventmanager-backend-1-5121.onrender.com/api/events";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error("Failed to save event");
      await fetchEvents();
      resetForm();
      setShowModal(false);
      setSuccessMessage(
        editingEventId ? "✅ Event updated successfully!" : "✅ Event added successfully!"
      );
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Save event error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://eventmanager-backend-1-5121.onrender.com/api/events/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setSuccessMessage("🗑 Event deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditingEventId(event.id);
    setShowModal(true);
  };

  const toggleParticipants = async (eventId) => {
    if (viewingParticipants === eventId) {
      setViewingParticipants(null);
    } else {
      await fetchParticipants(eventId);
      setViewingParticipants(eventId);
    }
  };

  const removeParticipant = async (eventId, studentId) => {
    try {
      const res = await fetch(
        `https://eventmanager-backend-1-5121.onrender.com/api/enrollments/${eventId}/student/${studentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove participant");
      await fetchParticipants(eventId);
    } catch (err) {
      console.error("Error removing participant:", err);
    }
  };

  const upcoming = events.filter((e) => e.status === "upcoming");
  const completed = events.filter((e) => e.status === "completed");

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 to-purple-200 p-6 overflow-y-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-indigo-700">🎯 Event Management</h2>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
        >
          + Add Event
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md animate-fade">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EventList
          title="Upcoming Events"
          events={upcoming}
          onDelete={handleDelete}
          onEdit={handleEdit}
          viewingParticipants={viewingParticipants}
          toggleParticipants={toggleParticipants}
          removeParticipant={removeParticipant}
          loadingParticipants={loadingParticipants}
        />
        <EventList
          title="Completed Events"
          events={completed}
          onDelete={handleDelete}
          onEdit={handleEdit}
          viewingParticipants={viewingParticipants}
          toggleParticipants={toggleParticipants}
          removeParticipant={removeParticipant}
          loadingParticipants={loadingParticipants}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-indigo-700">
              {editingEventId ? "Edit Event" : "Add Event"}
            </h3>
            <div className="space-y-3">
              {['name', 'type', 'description', 'venue', 'organizer'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={newEvent[field]}
                  onChange={handleInputChange}
                />
              ))}
              <input
                type="date"
                name="date"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={newEvent.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingEventId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventList({
  title,
  events,
  onDelete,
  onEdit,
  viewingParticipants,
  toggleParticipants,
  removeParticipant,
  loadingParticipants,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const filtered = events
    .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "name-asc") return a.name.localeCompare(b.name);
      if (sortKey === "name-desc") return b.name.localeCompare(a.name);
      if (sortKey === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortKey === "date-desc") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  return (
    <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-5 space-y-3">
      <h3 className="text-lg font-semibold text-indigo-700">{title}</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name"
          className="flex-grow p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="date-asc">Date ↑</option>
          <option value="date-desc">Date ↓</option>
        </select>
      </div>
      <ul className="space-y-2 max-h-[60vh] overflow-auto">
        {filtered.map((event) => (
          <li key={event.id} className="p-4 border rounded-md">
            <div className="flex justify-between">
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-indigo-800">{event.name}</div>
                <div className="text-gray-500 text-xs">{event.date}</div>
                <div>{event.description}</div>
                <div className="text-gray-600">Type: {event.type}</div>
                <div className="text-gray-600">Venue: {event.venue}</div>
                <div className="text-gray-600">Organizer: {event.organizer}</div>
                <div className="text-gray-600">
                  Participants: {event.participants?.length || 0}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <button onClick={() => onEdit(event)} className="text-blue-600 hover:underline">✏️</button>
                <button onClick={() => onDelete(event.id)} className="text-red-500 hover:underline">🗑</button>
              </div>
            </div>
            <button
              onClick={() => toggleParticipants(event.id)}
              className="text-sm text-indigo-600 mt-2 flex items-center gap-1"
            >
              <Users size={16} />
              {viewingParticipants === event.id ? "Hide Participants" : "Show Participants"}
            </button>
            {viewingParticipants === event.id && (
              <div className="mt-2 border-t pt-2">
                <h4 className="font-medium mb-1">Participants:</h4>
                {loadingParticipants ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : event.participants && event.participants.length > 0 ? (
                  <ul className="space-y-1">
                    {event.participants.map((student) => (
                      <li
                        key={student.id}
                        className="text-sm flex justify-between items-center"
                      >
                        <span>
                          {student.name} ({student.email}) - {student.department}
                        </span>
                        <button
                          onClick={() => removeParticipant(event.id, student.id)}
                          className="text-red-500 hover:underline"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No participants yet</p>
                )}
              </div>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 italic">No matching events</p>
        )}
      </ul>
    </div>
  );
}

export default EventManagement;
