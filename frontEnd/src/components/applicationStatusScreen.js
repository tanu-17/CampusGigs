import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "./profilePopupScreen";
import AlertPopup from "./alertPopup";

function ApplicationStatusScreen() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchJobs();
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
        )}&status=applied,rejected,awaitingResponse`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.statusCode === 200) {
        console.log("dataaa", data);
        setJobs(data.message);
      } else {
        console.error(
          "Failed to fetch jobs:",
          data.message || "Unknown error occurred"
        );
        setJobs([]);
      }
    } catch (error) {
      console.error("Fetching jobs failed:", error);
      setJobs([]);
    }
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleRevoke = async (applicationId) => {
    try {
      const response = await fetch(
        `https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/delete-service?applicationId=${encodeURIComponent(
          applicationId
        )}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      // alert("Deleted successfully!");
      handleShowAlert("Job Application revoked successfully.");
      fetchJobs(); // Refresh job list
    } catch (error) {
      console.error("Failed to revoke application:", error);
      alert("Failed to delete the application. Please try again.");
    }
  };

  const handleAccept = async (applicationId) => {
    try {
      const response = await fetch(
        "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/update-application-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "enrolled",
            applicationId: applicationId,
            role: "student",
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      // alert("Application accepted successfully!");
      handleShowAlert(
        "Status Updated! You are successfully enrolled for this job.Please visit the enrolled jobs section for more details."
      );
      fetchJobs(); // Refresh job list after status update
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Failed to update the application status. Please try again.");
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const response = await fetch(
        "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/update-application-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "notAccepted",
            applicationId: applicationId,
            role: "student",
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      // alert("Application accepted successfully!");
      handleShowAlert("Status Updated! Job Enrollment Cancelled.");
      fetchJobs(); // Refresh job list after status update
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Failed to update the application status. Please try again.");
    }
  };

  const styles = {
    list: {
      padding: "0",
      margin: "20px 0",
    },
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
    revokeButton: {
      padding: "10px 15px",
      marginRight: "10px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    hoverEffect: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    button: {
      padding: "10px 15px",
      margin: "10px 5px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    acceptButton: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    rejectButton: {
      backgroundColor: "#f44336",
      color: "white",
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
        <h1>Application Status</h1>
        <div style={{ marginLeft: "auto" }}>
          <ProfilePopup />
        </div>
      </nav>
      {jobs.length > 0 ? (
        <ul style={styles.list}>
          {jobs.map((job, index) => (
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  marginRight: "50px",
                  width: "20%",
                }}
              >
                <p>
                  <strong>Application Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        job.applicationStatus === "rejected"
                          ? "red"
                          : "inherit",
                      fontWeight:
                        job.applicationStatus === "rejected"
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {job.applicationStatus === "applied"
                      ? "Applied"
                      : job.applicationStatus === "rejected"
                      ? "Rejected"
                      : job.applicationStatus === "awaitingResponse"
                      ? "Awaiting Response"
                      : job.applicationStatus}
                  </span>
                </p>
                {job.applicationStatus === "applied" && (
                  <button
                    style={styles.revokeButton}
                    onClick={() => handleRevoke(job.applicationId)}
                  >
                    Revoke Application
                  </button>
                )}
                {job.applicationStatus === "awaitingResponse" && (
                  <div>
                    <button
                      style={{ ...styles.button, ...styles.acceptButton }}
                      onClick={() => handleAccept(job.applicationId)}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.rejectButton }}
                      onClick={() => handleReject(job.applicationId)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Currently there are no applications to track.</h2>
        </div>
      )}
    </div>
  );
}

export default ApplicationStatusScreen;
