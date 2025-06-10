import { Link } from "react-router-dom";
import Candidate from "./Candidate";
import CandidateChart from "./CandidateChart";
import Status from "./Status";
import Jobs from "./JobsCount";

const cardStyle = {
  flex: "1 1 300px",
  padding: "10px",
  backgroundColor: "#e0e1e2",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
  transition: "transform 0.2s, box-shadow 0.3s",
  textDecoration: "none",
  color: "inherit",
  height: "150px", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardHoverStyle = {
  transform: "translateY(-3px)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
};

const footerStyle = {
  marginTop: "40px",
  width: "100%",
  textAlign: "center",
  fontSize: "14px",
  color: "#555",
};

const footerLinkStyle = {
  color: "#007bff",
  textDecoration: "none",
};

const Home = () => {
  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <Link to="/candidate" style={cardStyle}>
              {" "}
              <Candidate />{" "}
            </Link>
          </div>
          <div className="col-md-4 mb-4">
            <Link to="/status" style={cardStyle}>
              {" "}
              <Status />{" "}
            </Link>
          </div>
          <div className="col-md-4 mb-4">
            <Link to="/jobposition" style={cardStyle}>
              {" "}
              <Jobs />{" "}
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <CandidateChart />
          </div>
        </div>

        <div style={footerStyle}>
          <p>
            Design and Developed by{" "}
            <a
              href="https://masystechsolution.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={footerLinkStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              MasysTechSolution.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
