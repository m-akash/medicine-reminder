import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.tsx";
import useMedicinesUser from "../hooks/useMedicinesUser.tsx";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import { Medicine } from "../types/index.ts";

const getMonthRange = () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
};

const Report = () => {
  const { user } = useAuth();
  const email = user?.email || "";
  const { data: medicinesData, isLoading: loadingMeds } =
    useMedicinesUser(email);
  const medicines: Medicine[] = medicinesData?.findMedicine || [];
  const axiosSecure = useAxiosSecure();
  const [adherence, setAdherence] = useState<number | null>(null);
  const [missed, setMissed] = useState<number | null>(null);
  const [refills, setRefills] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!email || medicines.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const { from, to } = getMonthRange();
        let totalScheduled = 0;
        let totalTaken = 0;
        await Promise.all(
          medicines.map(async (med: Medicine) => {
            const freqArr = med.frequency.split("-").map(Number);
            const dosesPerDay = freqArr.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const start = new Date(
              Math.max(
                new Date(med.startDate).getTime(),
                new Date(from).getTime()
              )
            );
            const end = new Date(
              Math.min(
                new Date(med.startDate).getTime() +
                  (med.durationDays - 1) * 24 * 60 * 60 * 1000,
                new Date(to).getTime()
              )
            );
            let scheduled = 0;
            for (
              let d = new Date(start);
              d <= end;
              d.setDate(d.getDate() + 1)
            ) {
              scheduled += dosesPerDay;
            }
            totalScheduled += scheduled;
            const res = await axiosSecure.get(
              `/api/medicine/${med.id}/taken-history?from=${from}&to=${to}`
            );
            const takenHistory: { taken: string }[] =
              res.data.takenHistory || [];
            takenHistory.forEach((td: { taken: string }) => {
              if (td.taken) {
                totalTaken += td.taken
                  .split("-")
                  .map((v: string) => parseInt(v, 10) || 0)
                  .reduce((a: number, b: number) => a + b, 0);
              }
            });
          })
        );
        setAdherence(
          totalScheduled === 0
            ? null
            : Math.round((totalTaken / totalScheduled) * 100)
        );
        setMissed(totalScheduled - totalTaken);
        const refillRes = await axiosSecure.get(
          `/api/refill-reminders?userEmail=${encodeURIComponent(email)}`
        );
        const upcomingRefills = (refillRes.data || []).filter(
          (med: any) => med.daysLeft <= 7
        ).length;
        setRefills(upcomingRefills);
      } catch (err: any) {
        setError(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    if (!loadingMeds) fetchReport();
  }, [email, medicines, loadingMeds, axiosSecure]);

  return (
    <div className="max-w-7xl mx-auto bg-white md:rounded-2xl shadow-lg  p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-2">
        Reports
      </h1>
      <p className="text-gray-600 text-center mb-8 text-base sm:text-lg">
        View your medication adherence, missed doses, and upcoming refills.
        Export your data for your records or to share with your doctor.
      </p>
      {loading || loadingMeds ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
          <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow text-center">
            <h2 className="text-lg font-semibold mb-1 text-cyan-900">
              Adherence Rate
            </h2>
            <p className="text-2xl font-bold text-blue-700 mb-0.5">
              {adherence !== null ? `${adherence}%` : "-"}
            </p>
            <span className="text-gray-500 text-sm">This Month</span>
          </div>
          <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow text-center">
            <h2 className="text-lg font-semibold mb-1 text-cyan-900">
              Missed Doses
            </h2>
            <p className="text-2xl font-bold text-blue-700 mb-0.5">
              {missed !== null ? missed : "-"}
            </p>
            <span className="text-gray-500 text-sm">This Month</span>
          </div>
          <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow text-center">
            <h2 className="text-lg font-semibold mb-1 text-cyan-900">
              Upcoming Refills
            </h2>
            <p className="text-2xl font-bold text-blue-700 mb-0.5">
              {refills !== null ? refills : "-"}
            </p>
            <span className="text-gray-500 text-sm">Next 7 Days</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
