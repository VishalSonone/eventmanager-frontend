import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Plus, Trash2, Edit } from "lucide-react";
import { api } from "../api";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [viewingParticipants, setViewingParticipants] = useState(null);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      const today = new Date().toISOString().split("T")[0];
      const processed = data.map((e) => ({
        ...e,
        status: e.date && e.date >= today ? "upcoming" : "completed",
      }));
      setEvents(processed);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage("Failed to load events. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const response = await api.get(`/api/enrollments/${eventId}/participants`);
      if (!response.ok) throw new Error("Failed to fetch participants");
      const participants = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, participants } : event
        )
      );
    } catch (error) {
      console.error("Error fetching participants:", error);
      setErrorMessage("Failed to load participants");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
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

  const validateEvent = () => {
    if (!newEvent.name.trim()) {
      setErrorMessage("Event name is required");
      return false;
    }
    if (!newEvent.date) {
      setErrorMessage("Event date is required");
      return false;
    }
    if (!newEvent.venue.trim()) {
      setErrorMessage("Venue is required");
      return false;
    }
    return true;
  };

  const handleAddOrUpdateEvent = async () => {
    if (!validateEvent()) {
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const method = editingEventId ? "put" : "post";
    const url = editingEventId
      ? `/api/events/${editingEventId}`
      : "/api/events";

    try {
      const res = await api[method](url, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save event");
      }

      const savedEvent = await res.json();
      
      if (editingEventId) {
        setEvents(events.map(e => e.id === savedEvent.id ? savedEvent : e));
      } else {
        setEvents([savedEvent, ...events]);
      }

      resetForm();
      setShowModal(false);
      setSuccessMessage(
        editingEventId ? "✅ Event updated successfully!" : "✅ Event added successfully!"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Save event error:", err);
      setErrorMessage(err.message || "Failed to save event. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/api/events/${eventToDelete}`);
      if (!res.ok) throw new Error("Failed to delete event");
      
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete));
      setSuccessMessage("🗑 Event deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMessage("Failed to delete event. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setShowDeleteDialog(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event) => {
    // Safely handle the date field
    const eventDate = event.date ? event.date.split('T')[0] : '';
    
    setNewEvent({
      name: event.name,
      description: event.description,
      type: event.type,
      date: eventDate,
      venue: event.venue,
      organizer: event.organizer,
    });
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
      const res = await api.delete(`/api/enrollments/${eventId}/student/${studentId}`);
      if (!res.ok) throw new Error("Failed to remove participant");
      await fetchParticipants(eventId);
      setSuccessMessage("Participant removed successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error removing participant:", err);
      setErrorMessage("Failed to remove participant");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const upcoming = events.filter((e) => e.status === "upcoming");
  const completed = events.filter((e) => e.status === "completed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6 bg-gradient-to-br from-indigo-100 to-purple-200 min-h-screen"
    >
      {/* Create Event Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-700">🎯 Event Management</h2>
          <button
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <Plus size={16} /> Add Event
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Events List Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📅 Upcoming Events</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming events found.</p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
                viewingParticipants={viewingParticipants}
                toggleParticipants={toggleParticipants}
                removeParticipant={removeParticipant}
                loadingParticipants={loadingParticipants}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Events Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">✅ Completed Events</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : completed.length === 0 ? (
          <p className="text-gray-500 italic">No completed events found.</p>
        ) : (
          <div className="space-y-4">
            {completed.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
                viewingParticipants={viewingParticipants}
                toggleParticipants={toggleParticipants}
                removeParticipant={removeParticipant}
                loadingParticipants={loadingParticipants}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">Are you sure you want to delete this event?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-700">
                  {editingEventId ? "Edit Event" : "Add Event"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                {["name", "type", "description", "venue", "organizer"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                      value={newEvent[field]}
                      onChange={handleInputChange}
                      required={field === "name" || field === "venue"}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                  disabled={!newEvent.name || !newEvent.date || !newEvent.venue}
                >
                  {editingEventId ? "Update" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EventCard({
  event,
  onDelete,
  onEdit,
  viewingParticipants,
  toggleParticipants,
  removeParticipant,
  loadingParticipants,
}) {
  // Safely format the date
  const formattedDate = event.date 
    ? new Date(event.date).toLocaleDateString() 
    : 'No date set';

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-indigo-800">{event.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
          <p className="text-gray-700 mt-2 text-sm">{event.description}</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
              {event.type}
            </span>
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
              {event.venue}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-2">Organizer: {event.organizer}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(event)} className="text-indigo-600 hover:text-indigo-800">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={() => toggleParticipants(event.id)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <Users size={16} />
          {viewingParticipants === event.id ? "Hide Participants" : "Show Participants"} ({event.participants?.length || 0})
        </button>
        
        {viewingParticipants === event.id && (
          <div className="mt-2 border-t pt-2">
            <h4 className="font-medium text-sm mb-1">Participants:</h4>
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
                      className="text-red-500 hover:text-red-700"
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
      </div>
    </div>
  );
}

export default EventManagement;