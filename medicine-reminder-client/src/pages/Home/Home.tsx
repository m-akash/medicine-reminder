import Greeting from "../Greeting/Greeting.tsx";
import DailyMedications from "../DailyMedications/DailyMedications.tsx";
import MyMedications from "../MyMedications/MyMedications.tsx";
import RefillReminder from "../RefillReminder/RefillReminder.tsx";
import useAuth from "../../hooks/useAuth.tsx";
import Login from "../Login/Login.tsx";
import BaseHelmet from "../../components/BaseHelmet.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";

const Home = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <>
        <BaseHelmet
          title="Medicine Reminder - Your Health Dashboard"
          description="Manage your medications, track your daily doses, and stay on top of your health routine with our comprehensive medicine reminder dashboard."
        />
        <LoadingSpinner
          message="Loading your dashboard..."
          size="large"
          fullScreen={false}
        />
      </>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg">
      <BaseHelmet
        title="Medicine Reminder - Your Health Dashboard"
        description="Manage your medications, track your daily doses, and stay on top of your health routine with our comprehensive medicine reminder dashboard."
      />
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg">
        {user ? (
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl shadow-lg flex flex-col gap-6 bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100">
              <Greeting />
              <DailyMedications />
              <MyMedications />
              <RefillReminder />
            </div>
          </div>
        ) : (
          <div>
            <Login></Login>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
