import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import api from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const CandidateChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await api.get("/candidates/count"); 
        setMonthlyData(response.data);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    fetchMonthlyData();
  }, []);

  const total = monthlyData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      color: "#333",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      minHeight: '300px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <div style={{
          backgroundColor: '#f44336',
          padding: '10px',
          borderRadius: '50%',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px'
        }}>
          <FaUser size={20} />
        </div>
        <div>
          <h6 style={{ margin: 0 }}>Candidates This Year</h6>
          <small style={{ color: '#888' }}>Total: {total}</small>
        </div>
      </div>

      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#f44336" barSize={30} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandidateChart;

// import { FaUser } from "react-icons/fa";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";

// const CandidateChart = () => {
//   // Hardcoded data (replace with API data later)
//   const monthlyData = [
//     { month: "January", count: 10 },
//     { month: "February", count: 15 },
//     { month: "March", count: 200 },
//     { month: "April", count: 180 },
//     { month: "May", count: 250 },
//     { month: "June", count: 30 },
//     { month: "July", count: 22 },
//     { month: "August", count: 28 },
//     { month: "September", count: 35 },
//     { month: "October", count: 40 },
//     { month: "November", count: 32 },
//     { month: "December", count: 38 },
//   ];

//   const total = monthlyData.reduce((acc, item) => acc + item.count, 0);

//   return (
//     <div style={{
//       backgroundColor: "#ffffff",
//       borderRadius: "12px",
//       padding: "20px",
//       color: "#333",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       minHeight: '300px',
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
//         <div style={{
//           backgroundColor: '#f44336',
//           padding: '10px',
//           borderRadius: '50%',
//           color: '#fff',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           width: '40px',
//           height: '40px'
//         }}>
//           <FaUser size={20} />
//         </div>
//         <div>
//           <h6 style={{ margin: 0 }}>Candidates This Year</h6>
//           <small style={{ color: '#888' }}>Total: {total}</small>
//         </div>
//       </div>

//       <div style={{ width: '100%', height: '200px' }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Bar dataKey="count" fill="#f44336" barSize={30} radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default CandidateChart;
