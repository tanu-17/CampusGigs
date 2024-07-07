import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "./profilePopupScreen";
import JobPostingForm from "./jobPostingForm";
import { IoIosArrowForward } from "react-icons/io";
import "../App.css";

function EmployerHomeScreen() {
  const navigate = useNavigate();
  const [showJobForm, setShowJobForm] = useState(false);
  return (
    <div className="employerHomeScreen">
      <nav className="topNav">
        <ul className="navLinks">
          <li onClick={() => navigate("/")}>Dashboard</li>
          <li onClick={() => navigate("/posted-jobs")}>Posted Jobs</li>
          <li onClick={() => navigate("/applications-received")}>
            Applications Received
          </li>
        </ul>
        <div className="icons" style={{ marginRight: "12px" }}>
          <ProfilePopup />
        </div>
      </nav>
      <div className="topLayout">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: "20px",
          }}
        >
          <h1 style={{ color: "#ffc7b4", fontSize: "52px" }}>
            Welcome to Campus Gigs!
          </h1>
          <h2>Your Partner in Campus Recruitment.</h2>
          <h3>Connect with Talented Students</h3>
          <h3>Employer Dashboard</h3>
        </div>
        <button
          className="buttonStyle"
          style={{ height: "60px", width: "160px", fontSize: "20px" }}
          onClick={() => setShowJobForm(true)}
        >
          Post a Job
        </button>
      </div>
      {showJobForm && <JobPostingForm onClose={() => setShowJobForm(false)} />}{" "}
      {/* Conditionally render the JobPostingForm */}
      <main className="content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f6f6f8",
            height: "100px",
          }}
        >
          <p className="tagline">The Smart Way to Hire!</p>
          <p className="tagline">
            Streamlined recruitment for the leaders of tomorrow.
          </p>
        </div>
        <div className="card-container">
          <div className="card" onClick={() => navigate("/posted-jobs")}>
            <h2>Expand Your Team!</h2>
            <h3>Posted Jobs</h3>
            <div className="arrow-icon-container">
              <IoIosArrowForward className="card-icon" />
            </div>
          </div>
          <div
            className="card"
            onClick={() => navigate("/applications-received")}
          >
            <h2>Review Candidates!</h2>
            <h3>Applications Received</h3>
            <div className="arrow-icon-container">
              <IoIosArrowForward className="card-icon" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmployerHomeScreen;
