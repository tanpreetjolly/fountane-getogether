import React from "react";

type Props = {};

const CreateEvent = (props: Props) => {
  return (
    <div className="px-4 mx-auto flex flex-col gap-2">
      <div>
        <input
          type="text"
          id="eventName"
          name="eventName"
          placeholder="Your Event Name Here"
          className="mt-1 p-2.5 px-4 w-full border border-gray-300 rounded-lg focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        />
      </div>
      <div>
        <select
          id="eventtype"
          name="eventtype"
          className="mt-1 p-2.5 px-4 w-full border bg-transparent border-gray-300 rounded-lg focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        >
          <option value="">Select Event Type</option>
          <option value="wedding">Wedding</option>
          <option value="conference">Conference</option>
          <option value="party">Party</option>
          <option value="concert">Concert</option>
        </select>
      </div>
    </div>
  );
};

export default CreateEvent;
