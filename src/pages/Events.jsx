import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin, User2 } from "lucide-react";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  // Helper to strip time from date
  const stripTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = stripTime(new Date());

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem("student"));
    setStudentId(studentData?.id || null);

    fetch("http://localhost:8080
/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const handleEnroll = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:8080
/api/enrollments/${eventId}/student/${studentId}`,
        {
          method: "POST",
        }
      );
      const updatedEvent = await response.json();
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const upcomingEvents = events.filter((event) => {
    const eventDate = stripTime(event.date);
    return eventDate >= today;
  });

  const completedEvents = events.filter((event) => {
    const eventDate = stripTime(event.date);
    return eventDate < today;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[80vh]">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        📅 Events
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading events...</p>
      ) : (
        <>
          {/* Upcoming Events */}
          <section>
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">No upcoming events.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition-all"
                  >
                    <h4 className="text-xl font-bold text-indigo-600 mb-1">
                      {event.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2 capitalize">
                      {event.type}
                    </p>
                    <p className="text-gray-700 line-clamp-2 mb-3">
                      {event.description}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-indigo-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-500" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User2 size={16} className="text-yellow-500" />
                        <span>{event.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Participants: {event.participants?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleEnroll(event.id)}
                        className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        disabled={!studentId}
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Completed Events */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Completed Events
            </h3>
            {completedEvents.length === 0 ? (
              <p className="text-gray-500">No completed events yet.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {completedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-50 shadow-md rounded-xl p-5 border border-gray-200"
                  >
                    <h4 className="text-xl font-bold text-gray-800 mb-1">
                      {event.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2 capitalize">
                      {event.type}
                    </p>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {event.description}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User2 size={16} className="text-gray-400" />
                        <span>{event.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Participants: {event.participants?.length || 0}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-block mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Events;
