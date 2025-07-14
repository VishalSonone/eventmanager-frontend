import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const EventEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Add debug logging to check user data
  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://eventmanager-backend-1-5121.onrender.com/api/events/${id}/with-participants`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEnroll = async () => {
    try {
      // Check if user is properly authenticated
      if (!user || !user.student) {
        throw new Error('Please login again. Session might have expired.');
      }

      setIsEnrolling(true);
      
      const response = await fetch('https://eventmanager-backend-1-5121.onrender.com/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user.student.id,
          eventId: event.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Enrollment failed');
      }

      navigate('/student/events', { 
        state: { 
          enrolled: true,
          message: `Successfully enrolled in ${event.name}` 
        } 
      });
    } catch (err) {
      console.error("Enrollment error:", err);
      setError(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/student/events')}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return <div className="p-4">Event not found</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enroll in {event.name}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* ... (rest of your JSX remains the same) ... */}
      </div>
    </div>
  );
};

export default EventEnrollment;