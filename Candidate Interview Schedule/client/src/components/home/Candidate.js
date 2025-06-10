import { useEffect, useState } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import api from "../../api";

const Candidate = () => {
  const [countData, setCountData] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await api.get("/candidates/count");
        console.log(response.data);
        setCountData(response.data); 
      } catch (error) {
        console.error("Error fetching contact count:", error);
      }
    };

    fetchCount();
  }, []);
   const total = countData.reduce((acc, item) => acc + item.count, 0);
  return (
    <div className="bg-red-500 rounded-xl shadow-md p-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-lightsecondary text-secondary p-3 rounded-md">
          <FaUserTie style={{ height: '24px', width: '24px', color: 'green' }} />
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <b><p className="text-sm text-dark">Candidate</p></b>
      </div>
      <b><p className="mt-2 text-sm text-gray-600">Total: {total}</p></b>
    </div>
  );
};

export default Candidate;
