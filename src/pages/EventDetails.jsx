import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, User2 } from "lucide-react";
import { api } from "../api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg text-gray-500">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg text-red-500">
        Event not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
        {event.name}
      </h2>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-5">
        <div>
          <p className="text-sm text-gray-500 uppercase">{event.type}</p>
          <p className="mt-2 text-gray-700">{event.description}</p>
        </div>

        <div className="space-y-2 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-indigo-500" size={18} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-green-500" size={18} />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <User2 className="text-yellow-500" size={18} />
            <span>{event.organizer}</span>
          </div>
        </div>

        <div className="pt-4 border-t text-gray-700">
          <h3 className="text-lg font-semibold mb-2">Additional Notes:</h3>
          <textarea
            value={event.notes || "No additional notes available."}
            readOnly
            className="w-full border rounded p-3 text-sm bg-gray-50"
            rows={5}
          />
        </div>

        <div className="pt-6 text-center">
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
