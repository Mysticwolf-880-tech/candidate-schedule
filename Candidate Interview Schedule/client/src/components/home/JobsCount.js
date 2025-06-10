import { useEffect, useState } from "react";
import { FaBriefcase, FaUser } from "react-icons/fa";
import api from "../../api";

const Jobs = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await api.get("/job/count");
        console.log("Job Count",response.data);
        setCount(response.data.count); 
      } catch (error) {
        console.error("Error fetching contact count:", error);
      }
    };

    fetchCount();
  }, []);
  return (
    <div className="bg-red-500 rounded-xl shadow-md p-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-lightsecondary text-secondary p-3 rounded-md">
          <FaBriefcase style={{ height: '24px', width: '24px', color: 'green' }} />
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <b><p className="text-sm text-dark">Jobs</p></b>
      </div>
      <b><p className="mt-2 text-sm text-gray-600">Total: {count}</p></b>
    </div>
  );
};

export default Jobs;
