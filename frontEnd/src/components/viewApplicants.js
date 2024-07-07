import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "./profilePopupScreen";
import AlertPopup from "./alertPopup";

function ApplicantsListComponent() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { jobTitle } = location.state || {};
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  console.log(jobTitle, "jobtitle");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    const response = await fetch(
      `https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/get-applications?jobId=${encodeURIComponent(
        jobId
      )}&status=applied,enrolled,awaitingResponse,notAccepted,rejected`
    );
    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      setApplicants(data.message || []);
    } else {
      console.error(`Failed to fetch applicants: ${response.statusText}`);
    }
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAccept = async (applicantId) => {
    console.log("Accepted application:", applicantId);
    const response = await fetch(
      "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/update-application-status",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "awaitingResponse",
          applicationId: applicantId,
          role: "employee",
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Update response:", data);
      //   alert("Application status updated successfully.");
      handleShowAlert(
        "Status Updated! Awaiting Response from student for enrollment confirmation."
      );
      fetchApplicants();
      // Optionally refresh applicants list here
    } else {
      console.error(
        "Failed to update application status:",
        await response.text()
      );
    }
  };

  const handleReject = async (applicantId) => {
    console.log("Rejected application:", applicantId);
    const response = await fetch(
      "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/update-application-status",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          applicationId: applicantId,
          role: "employee",
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Update response:", data);
      //   alert("Application rejected successfully.");
      if (!showAlert) {
        handleShowAlert("Status Updated! Application Rejected Successfully.");
        // navigate("/applications-received");
        fetchApplicants();
      }
    } else {
      console.error(
        "Failed to update application status:",
        await response.text()
      );
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "Arial, sans-serif",
      margin: "20px",
    },
    applicantList: {
      width: "35%",
      borderRight: "1px solid #ddd",
      overflowY: "auto",
      height: "calc(100vh - 20px)",
      padding: "10px",
      listStyle: "none",
      fontSize: "0.95em",
    },
    applicantItem: {
      cursor: "pointer",
      padding: "15px 10px",
      borderBottom: "1px solid #eee",
      transition: "background-color 0.3s",
      fontWeight: "normal",
      fontSize: "0.9em",
    },
    selectedApplicantItem: {
      backgroundColor: "#e8e8e8",
    },
    content: {
      width: "60%",
      padding: "20px",
      overflowY: "auto",
      height: "calc(100vh - 40px)",
      backgroundColor: "#f8f8f8",
    },
    tabContent: {
      textAlign: "left",
      lineHeight: "1.5",
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

  const additionalStyles = {
    detailItem: {
      marginBottom: "5px",
    },
    detailLabel: {
      fontWeight: "bold",
      color: "#333",
    },
    jobList: {
      listStyleType: "none",
      paddingLeft: "0",
      marginTop: "10px",
    },
    jobListItem: {
      backgroundColor: "#f2f2f2",
      padding: "5px 10px",
      borderRadius: "5px",
      marginBottom: "5px",
    },
  };

  return (
    <div>
      {/* Navigation and header, same as before */}
      <nav className="topNav">
        <IoIosArrowBack
          style={{
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "auto",
            marginLeft: "5px",
          }}
          onClick={() => navigate("/applications-received")}
        />
        <h1>Applicants for {jobTitle}</h1>
        <div style={{ marginLeft: "auto" }}>
          <ProfilePopup />
        </div>
      </nav>

      {/* Main container for layout */}
      <div style={styles.container}>
        {showAlert && (
          <AlertPopup message={alertMessage} onClose={handleCloseAlert} />
        )}
        {/* Applicant list sidebar */}
        <ul style={styles.applicantList}>
          {applicants.map((applicant, index) => (
            <li
              key={index}
              style={
                index === activeTab
                  ? { ...styles.applicantItem, ...styles.selectedApplicantItem }
                  : styles.applicantItem
              }
              onClick={() => setActiveTab(index)}
            >
              {applicant.firstName} {applicant.lastName}
            </li>
          ))}
        </ul>

        {/* Content area for the selected applicant */}
        <div style={styles.content}>
          {applicants.length > 0 && (
            <div style={styles.tabContent}>
              <h2>
                Details for {applicants[activeTab].firstName}{" "}
                {applicants[activeTab].lastName}
              </h2>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>Email:</span>{" "}
                {applicants[activeTab].email}
              </p>

              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>Applied Date:</span>{" "}
                {formatDate(applicants[activeTab].applicationAppliedDate)}
              </p>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>
                  Graduation Date:
                </span>{" "}
                {formatDate(applicants[activeTab].graduationDate)}
              </p>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>School:</span>{" "}
                {applicants[activeTab].school}
              </p>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>Student ID:</span>{" "}
                {applicants[activeTab].studentId}
              </p>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>
                  Degree Enrolled:
                </span>{" "}
                {applicants[activeTab].degreeEnrolled}
              </p>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>
                  No. of Already Enrolled Jobs:
                </span>{" "}
                {applicants[activeTab].noOfEmployedJobs
                  ? applicants[activeTab].noOfEmployedJobs
                  : "0"}
              </p>
              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>
                  Currently Enrolled Jobs:
                </span>
                {applicants[activeTab].employedJobs &&
                applicants[activeTab].employedJobs.length > 0 ? (
                  <ul style={additionalStyles.jobList}>
                    {applicants[activeTab].employedJobs.map((job, index) => (
                      <li key={index} style={additionalStyles.jobListItem}>
                        {job.jobCategory}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>
                    The student is currently not enrolled in any on-campus job.
                  </span>
                )}
              </p>

              <p style={additionalStyles.detailItem}>
                <span style={additionalStyles.detailLabel}>Status:</span>{" "}
                <span
                  style={{
                    color:
                      applicants[activeTab].applicationStatus ===
                        "notAccepted" ||
                      applicants[activeTab].applicationStatus === "rejected"
                        ? "red"
                        : applicants[activeTab].applicationStatus === "enrolled"
                        ? "green"
                        : "inherit",
                    fontWeight: [
                      "notAccepted",
                      "enrolled",
                      "rejected",
                    ].includes(applicants[activeTab].applicationStatus)
                      ? "bold"
                      : "normal",
                  }}
                >
                  {applicants[activeTab].applicationStatus === "enrolled"
                    ? "Enrolled"
                    : applicants[activeTab].applicationStatus ===
                      "awaitingResponse"
                    ? "Awaiting response from student"
                    : applicants[activeTab].applicationStatus === "notAccepted"
                    ? "Offer not accepted by student"
                    : applicants[activeTab].applicationStatus === "rejected"
                    ? "Rejected"
                    : applicants[activeTab].applicationStatus === "applied"
                    ? " "
                    : applicants[activeTab].applicationStatus}
                </span>
              </p>

              {applicants[activeTab].applicationStatus === "applied" && (
                <div>
                  <button
                    style={{ ...styles.button, ...styles.acceptButton }}
                    onClick={() =>
                      handleAccept(applicants[activeTab].applicationId)
                    }
                  >
                    Accept
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.rejectButton }}
                    onClick={() =>
                      handleReject(applicants[activeTab].applicationId)
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
              {/* More status checks and information can be added here */}
            </div>
          )}
          {applicants.length === 0 && <p>No applicants for this job.</p>}
        </div>
      </div>
    </div>
  );
}

export default ApplicantsListComponent;
