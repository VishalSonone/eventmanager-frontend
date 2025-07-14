import React, { useEffect, useState } from "react";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://eventmanager-backend-1-5121.onrender.com/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 bg-white shadow rounded-lg border border-gray-200"
          >
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <p>{event.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {event.type} | <strong>Date:</strong>{" "}
              {event.date} | <strong>Venue:</strong> {event.venue}
            </p>
            <p className="text-sm text-blue-600">
              <strong>Organizer:</strong> {event.organizer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
