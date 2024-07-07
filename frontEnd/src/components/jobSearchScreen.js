import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ProfilePopup from "./profilePopupScreen";
import AlertPopup from "./alertPopup";

function JobsSearchScreen() {
  // State to store the list of job postings
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchJobs(); // Defined fetchJobs to be reused
  }, []);

  const fetchJobs = async () => {
    try {
      const studentId = localStorage.getItem("Id");
      if (!studentId) {
        console.error("Student ID is not found in local storage.");
        return;
      }
      const response = await fetch(
        `https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/get-jobs?studentId=${encodeURIComponent(
          studentId
        )}`
      );
      //tt00787goi.execute-api.us-east-2.amazonaws.com/dev/get-jobs?studentId=438087090&status=applied
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.statusCode === 200) {
        // Update to use the message array from the response
        console.log("posted job data", data.message);
        setJobs(data.message);
      } else {
        console.error(
          "Failed to fetch jobs:",
          data.message || "Unknown error occurred"
        );
        setJobs([]); // Ensures jobs is always an array even if the API returns something unexpected
      }
    } catch (error) {
      console.error("Fetching jobs failed:", error);
      setJobs([]); // Handle error by setting jobs to an empty array
    }
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const applyToJob = async () => {
    const studentId = localStorage.getItem("Id");
    const jobId = jobs[selectedJobIndex].jobId;

    if (!studentId) {
      console.error("Student ID is not found in local storage.");
      return;
    }

    const payload = {
      studentId: studentId,
      jobId: jobId,
    };

    try {
      const response = await fetch(
        "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/apply-job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Application successful", data);
        // alert("Application submitted successfully!");
        handleShowAlert("Application submitted successfully.");
        window.location.reload();
      } else {
        throw new Error(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Failed to submit application.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "Arial, sans-serif",
      margin: "20px",
    },
    jobList: {
      width: "35%",
      borderRight: "1px solid #ddd",
      overflowY: "auto",
      height: "calc(100vh - 20px)",
      paddingLeft: "5px",
      listStyle: "none",
      fontSize: "0.95em",
    },
    jobHeader: {
      textAlign: "left",
    },
    jobDescription: {
      width: "60%",
      padding: "20px",
      overflowY: "auto",
      height: "calc(100vh - 40px)",
      backgroundColor: "#f8f8f8",
      textAlign: "left",
    },
    jobItem: {
      cursor: "pointer",
      paddingLeft: "10px",
      paddingRight: "10px",
      borderBottom: "1px solid #eee",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      transition: "background-color 0.3s",
      fontWeight: "normal",
      fontSize: "0.9em",
      borderRadius: "5px",
    },
    jobInfo: {
      textAlign: "left",
    },
    jobTitle: {
      fontSize: "1.5em",
      fontWeight: "bold",
    },
    jobCategory: {
      margin: "5px 0",
      fontSize: "1em",
      color: "#666",
    },
    jobLocation: {
      margin: "5px 0",
      fontSize: "1em",
      color: "#666",
    },
    jobDeadline: {
      textAlign: "right",
      width: "100%",
      fontSize: "1em",
      color: "#666",
      marginTop: "10px",
    },
    selectedJobItem: {
      backgroundColor: "#e8e8e8",
    },
    descriptionHeading: {
      color: "#003366",
      fontSize: "1.5em",
      fontWeight: "bold",
      margin: "0 0 20px 0",
    },
    descriptionText: {
      fontSize: "1em",
      color: "#333",
      lineHeight: "1.5",
      marginBottom: "10px",
      textAlign: "left",
    },
    applyButton: {
      padding: "10px 15px",
      backgroundColor: "#f76900",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1em",
      margin: "20px 0",
      fontWeight: "bold",
      width: "100px",
    },
    divider: {
      borderTop: "1px solid #ccc",
      marginTop: "20px",
      marginBottom: "20px",
    },
    atAGlance: {
      fontWeight: "normal",
      color: "#666",
      marginBottom: "10px",
      textAlign: "left",
    },
  };

  return (
    <div>
      {showAlert && (
        <AlertPopup message={alertMessage} onClose={handleCloseAlert} />
      )}
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
        <h1>Job Postings</h1>
        <div style={{ marginLeft: "auto" }}>
          <ProfilePopup />
        </div>
      </nav>
      <div style={styles.container}>
        <ul style={styles.jobList}>
          {jobs.map((job, index) => (
            <li
              key={index}
              style={
                index === selectedJobIndex
                  ? { ...styles.jobItem, ...styles.selectedJobItem }
                  : styles.jobItem
              }
              onClick={() => setSelectedJobIndex(index)}
            >
              <div style={styles.jobInfo}>
                <h2 style={styles.jobTitle}>{job.jobTitle}</h2>
                <p style={styles.jobCategory}>{job.jobCategory}</p>
                <p style={styles.jobLocation}>{job.jobLocation}</p>
              </div>
              <p style={styles.jobDeadline}>{job.jobDeadline}</p>
            </li>
          ))}
        </ul>
        <div style={styles.jobDescription}>
          {jobs.length > 0 ? (
            <div>
              {/* Job title, category, location, and apply button */}
              <div style={styles.jobHeader}>
                <h2 style={styles.descriptionHeading}>
                  {jobs[selectedJobIndex].jobTitle}
                </h2>
                <p style={styles.descriptionText}>
                  <strong>Job Category:</strong>{" "}
                  {jobs[selectedJobIndex].jobCategory}
                </p>
                <p style={styles.descriptionText}>
                  <strong>Job Location:</strong>
                  {jobs[selectedJobIndex].jobLocation}
                </p>
                {/* Apply Button */}
                <button style={styles.applyButton} onClick={() => applyToJob()}>
                  Apply
                </button>
              </div>

              {/* Divider */}
              <hr style={styles.divider} />

              {/* At a glance section */}
              <div style={styles.atAGlance}>
                <p style={styles.descriptionText}>
                  <strong>Pay Rate:</strong> {jobs[selectedJobIndex].jobPayRate}
                </p>
                <p style={styles.descriptionText}>
                  <strong>Posted Date:</strong>{" "}
                  {jobs[selectedJobIndex].jobPostingDate}
                </p>
                <p style={styles.descriptionText}>
                  <strong>Deadline:</strong>{" "}
                  {jobs[selectedJobIndex].jobDeadline}
                </p>
              </div>

              {/* Divider */}
              <hr style={styles.divider} />

              {/* Job description */}
              <div style={styles.jobDescriptionText}>
                <p style={styles.descriptionText}>
                  <strong>Job Description:</strong>
                  {jobs[selectedJobIndex].jobDescription}
                </p>
              </div>
            </div>
          ) : (
            <p>No job postings available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsSearchScreen;
