import useAuth from "../../hooks/useAuth.tsx";
import useUserByEmail from "../../hooks/useUserByEmail.tsx";
import { User } from "../../types/index.ts";

const Greeting = () => {
  const { user } = useAuth();
  const email = user?.email || "";
  const { data } = useUserByEmail(email);
  const userInfo: User | undefined = data?.findUser;

  const firstName = userInfo?.name.split(" ")[0] || "";
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "?";

  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = today.getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  const greeting = getGreeting();

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex-shrink-0 bg-blue-400 rounded-full w-14 h-14 flex items-center justify-center shadow-md">
          <span className="text-white text-2xl font-bold">{firstInitial}</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {greeting}, <span className="text-blue-500">{firstName}</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Here's your medications overview today!
          </p>
        </div>
      </div>
      <div className="text-right w-full md:w-auto">
        <p className="text-gray-700 text-base md:text-lg font-medium">
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default Greeting;
