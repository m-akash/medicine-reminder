import React, { useEffect, useState } from "react";
import { FaPills, FaExclamationTriangle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth.tsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.tsx";
import Report from "../../components/Report.tsx";

interface Medication {
  id: string;
  name: string;
  pillsLeft: number;
  daysLeft: number;
}

const RefillReminder: React.FC = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.email) return;
    setLoading(true);
    setError(null);
    axiosSecure
      .get(`/api/refill-reminders?userEmail=${encodeURIComponent(user.email)}`)
      .then((res) => setMedications(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError("No refill reminders found.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  }, [user, axiosSecure]);

  const handleRefill = async (medId: string) => {
    if (!user || !user.email) return;
    try {
      setLoading(true);
      await axiosSecure.patch(`/api/medicine/${medId}/refill`);
      const res = await axiosSecure.get(
        `/api/refill-reminders?userEmail=${encodeURIComponent(user.email)}`
      );
      setMedications(res.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError("No refill reminders found.");
      } else {
        setError("Failed to refill. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-400" /> Refill
            Reminders
          </h2>
          {loading && (
            <div className="text-center text-gray-500">Loading...</div>
          )}
          {error && <div className="text-center text-red-500">{error}</div>}
          <div className="flex flex-col gap-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className={`relative rounded-xl border-2 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow transition-all ${
                  med.pillsLeft <= 5 || med.daysLeft <= 2
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaPills
                    className={`text-3xl ${
                      med.pillsLeft <= 5 || med.daysLeft <= 2
                        ? "text-amber-500"
                        : "text-blue-400"
                    }`}
                  />
                  <div>
                    <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      {med.name}
                      {(med.pillsLeft <= 5 || med.daysLeft <= 2) && (
                        <span className="ml-2 text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-semibold animate-pulse">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-sm mt-1 flex items-center gap-1 ${
                        med.pillsLeft <= 5
                          ? "text-red-500 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Pills left:
                      <span className="font-bold">{med.pillsLeft}</span>
                    </div>
                    <div
                      className={`text-sm flex items-center gap-1 ${
                        med.daysLeft <= 2
                          ? "text-red-500 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Days left:
                      <span className="font-bold">{med.daysLeft}</span>
                    </div>
                  </div>
                </div>
                {(med.pillsLeft <= 5 || med.daysLeft <= 2) && (
                  <div className="text-red-500 font-semibold text-sm mt-1">
                    Please refill it
                  </div>
                )}
                <div className="flex gap-2 mt-2 md:mt-0 md:justify-center md:items-center md:static">
                  <button
                    className="absolute right-4 top-4 md:static bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow"
                    onClick={() => handleRefill(med.id)}
                    disabled={loading}
                  >
                    <FaPills /> Refill
                  </button>
                </div>
              </div>
            ))}
            {!loading && medications.length === 0 && (
              <div className="text-center text-gray-500">
                No refills needed at this time.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 ">
        <Report />
      </div>
    </div>
  );
};

export default RefillReminder;
