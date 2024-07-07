import React from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "./profilePopupScreen";
import { IoIosArrowForward } from "react-icons/io";
import "../App.css";

function StudentHomeScreen() {
  const navigate = useNavigate(); // useNavigate hook

  return (
    <div className="studentHomeScreen">
      <nav className="topNav">
        <ul className="navLinks">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/jobs")}>Jobs</li>
          <li onClick={() => navigate("/application-status")}>
            Application Status
          </li>
          <li onClick={() => navigate("/enrolled-jobs")}>Enrolled Jobs</li>
        </ul>

        <div className="icons" style={{ marginRight: "12px" }}>
          <ProfilePopup />
          {/* <IoIosPerson size="24" /> */}
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
          <h1
            style={{
              color: "#ffc7b4",
              fontFamily:
                "Ginto Nord, Suisse Int'l, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, sans-serif",
              fontSize: "52px",
            }}
          >
            Welcome to Campus Gigs!
          </h1>
          <h2 style={{ color: "#ffc7b4" }}>Your Campus Job Awaits.</h2>
          <h3>Student Jobs Portal</h3>
        </div>
        <button
          className="buttonStyle"
          style={{ height: "60px", width: "160px", fontSize: "20px" }}
          onClick={() => navigate("/jobsSearch")}
        >
          Apply Now
        </button>
      </div>
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
          <p className="tagline">Elevate Your College Experience!</p>
          <p className="tagline">
            Embark on a work journey that complements your college life.
          </p>
        </div>
        <div className="card-container">
          <div className="card" onClick={() => navigate("/jobsSearch")}>
            <h2>Find your next opportunity!</h2>
            <h3>Jobs</h3>
            <div className="arrow-icon-container">
              <IoIosArrowForward className="card-icon" />
            </div>
          </div>
          <div className="card" onClick={() => navigate("/application-status")}>
            <h2>Track your applications!</h2>
            <h3>Application Status</h3>
            <div className="arrow-icon-container">
              <IoIosArrowForward className="card-icon" />
            </div>
          </div>
          <div className="card" onClick={() => navigate("/enrolled-jobs")}>
            <h2>See your job commitments!</h2>
            <h3>Enrolled Jobs</h3>
            <div className="arrow-icon-container">
              <IoIosArrowForward className="card-icon" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentHomeScreen;
