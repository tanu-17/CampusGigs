import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ProfilePopup from "./profilePopupScreen";

function EnrolledJobsScreen() {
  const [enrolledJobs, setEnrolledJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("Id");
    const encodedStudentId = encodeURIComponent(studentId);
    const url = `https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/get-jobs?studentId=${encodedStudentId}&status=enrolled`;

    const fetchEnrolledJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEnrolledJobs(data.message || []);
      } catch (error) {
        setError("Failed to fetch enrolled jobs: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledJobs();
  }, []);

  const styles = {
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      margin: "5px 0",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      transition: "box-shadow 0.3s",
    },
    jobDetails: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "20px",
      alignItems: "start",
      color: "#606060",
    },
    hoverEffect: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <nav className="topNav">
        <IoIosArrowBack
          style={{
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "auto",
            marginLeft: "5px",
          }}
          onClick={() => navigate("/studentHome")}
        />
        <h1>Enrolled Jobs</h1>
        <div style={{ marginLeft: "auto" }}>
          <ProfilePopup />
        </div>
      </nav>
      {enrolledJobs.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {enrolledJobs.map((job, index) => (
            <li
              key={index}
              style={styles.listItem}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = styles.hoverEffect.boxShadow)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.1)")
              }
            >
              <div style={styles.jobDetails}>
                <h2 style={{ color: "black" }}>{job.jobTitle}</h2>
                <p style={{ alignItems: "start" }}>
                  <strong>Category:</strong> {job.jobCategory}
                </p>
                <div style={{ display: "flex" }}>
                  <p>
                    <strong>Location:</strong> {job.jobLocation}
                  </p>
                  <p style={{ marginLeft: "15px" }}>
                    <strong>Pay Rate:</strong> {job.jobPayRate}
                  </p>
                </div>
              </div>
              <p style={{ marginRight: "80px" }}>
                <strong>Application Status:</strong>{" "}
                <span
                  style={{
                    color:
                      job.applicationStatus === "enrolled"
                        ? "green"
                        : "inherit",
                    fontWeight:
                      job.applicationStatus === "enrolled" ? "bold" : "normal",
                  }}
                >
                  {job.applicationStatus === "enrolled"
                    ? "Enrolled"
                    : job.applicationStatus}
                </span>
              </p>
              {/* You can add actions here like revoke, accept, or reject if needed */}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Currently you are not enrolled in any on-campus job.</h2>
        </div>
      )}
    </div>
  );
}

export default EnrolledJobsScreen;
