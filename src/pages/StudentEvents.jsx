import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const StudentEvents = () => {
  const { user } = useUser();
  const student = user?.student;
  const [events, setEvents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantsCount, setParticipantsCount] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const eventsResponse = await fetch('http://localhost:8080/api/events');
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();

        // Split events based on today's date
        const today = new Date().toISOString().split("T")[0];
        const enrichedEvents = eventsData.map(e => ({
          ...e,
          status: e.date >= today ? "upcoming" : "completed"
        }));
        setEvents(enrichedEvents);

        const counts = {};
        for (const event of enrichedEvents) {
          const response = await fetch(`http://localhost:8080/api/events/${event.id}/with-participants`);
          if (response.ok) {
            const eventWithParticipants = await response.json();
            counts[event.id] = eventWithParticipants.enrollments?.length || 0;
          }
        }
        setParticipantsCount(counts);

        if (student?.id) {
          const enrollmentsResponse = await fetch(`http://localhost:8080/api/enrollments/student/${student.id}`);
          if (!enrollmentsResponse.ok) throw new Error('Failed to fetch enrollments');
          const enrollmentsData = await enrollmentsResponse.json();
          setEnrollments(enrollmentsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [student?.id]);

  const enrolledEventIds = enrollments.map(e => e.event?.id);

  const renderEventCard = (event, disableEnroll = false) => (
    <div key={event.id} className="bg-white border border-indigo-100 rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-indigo-700">{event.name}</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {participantsCount[event.id] || 0} participants
          </span>
        </div>
        <p className="text-gray-600 text-sm">{event.description}</p>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>Type: {event.type}</span>
          <span>Date: {new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>Venue: {event.venue}</span>
          <span>Organizer: {event.organizer}</span>
        </div>
      </div>
      <div className="bg-indigo-50 px-5 py-3 flex justify-end">
        {enrolledEventIds.includes(event.id) ? (
          <span className="text-green-600 font-medium">Already Enrolled</span>
        ) : disableEnroll ? (
          <span className="text-gray-400 italic">Event Completed</span>
        ) : (
          <Link
            to={`/student/events/enroll/${event.id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Enroll Now
          </Link>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="p-10 text-center text-indigo-600 font-medium animate-pulse">Loading events...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600 bg-red-100 border-l-4 border-red-500 rounded">Error: {error}</div>;
  }

  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const completedEvents = events.filter(e => e.status === "completed");

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
      {/* Upcoming Events */}
      <div>
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">Upcoming Events</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => renderEventCard(event))
          ) : (
            <p className="text-gray-500 italic">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Completed Events */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Completed Events</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedEvents.length > 0 ? (
            completedEvents.map(event => renderEventCard(event, true))
          ) : (
            <p className="text-gray-500 italic">No completed events</p>
          )}
        </div>
      </div>

      {/* Student Enrollments */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Your Enrollments</h2>
        {enrollments.length > 0 ? (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white border border-indigo-100 rounded-xl p-4 shadow hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium text-gray-800">{enrollment.event?.name}</h3>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {participantsCount[enrollment.event?.id] || 0} participants
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Status:{" "}
                  <span className={enrollment.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}>
                    {enrollment.status || 'PENDING'}
                  </span>
                </p>
                {enrollment.score && (
                  <p className="text-sm mt-1 text-gray-600">Score: {enrollment.score}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't enrolled in any events yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentEvents;
