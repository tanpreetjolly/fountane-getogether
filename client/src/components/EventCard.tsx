import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const EventCard = () => {
  const navigate = useNavigate();
  const formatDate = (date:string) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  return (
    <button
      className="container p-5 flex flex-col gap-0.5 text-left bg-white w-full border border-gray-300 my-4 rounded-lg shadow-sm  font-inter"
      onClick={() => {
        navigate("/events/1");
      }}
    >
      <span className="text-2xl font-bold text-gray-700">
        Event Title - X Weds Y
      </span>
      <span className="text-gray-700 text-lg font-medium">
        Event Host: John Doe
      </span>
      <span className="text-blue-400 font-semibold text-lg">
        $15,000 Total Budget
      </span>
      <span className="text-gray-500 text-sm">
        {formatDate("2024-05-26")} - {formatDate("2024-05-31")}
      </span>
    </button>
  );
};

export default EventCard;
