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
          fullScreen={true} 
        />
      </>
    );
  }

  return (
    <>
      <BaseHelmet 
        title="Medicine Reminder - Your Health Dashboard"
        description="Manage your medications, track your daily doses, and stay on top of your health routine with our comprehensive medicine reminder dashboard."
      />
      <div className="min-h-screen bg-gray-100 py-2">
        {user ? (
          <div className="max-w-7xl mx-auto px-4">
            <div className="rounded-3xl shadow-xl flex flex-col gap-6">
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
    </>
  );
};

export default Home;
