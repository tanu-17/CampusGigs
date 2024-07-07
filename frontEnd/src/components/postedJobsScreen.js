import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import JobPostingForm from "./jobPostingForm";
import "../App.css";
import ProfilePopup from "./profilePopupScreen";
import { IoIosArrowBack } from "react-icons/io";
import AlertPopup from "./alertPopup";

function PostedJobsScreen() {
  const navigate = useNavigate();
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const role = location.state?.role;
  console.log(role, "rolee");

  useEffect(() => {
    fetchJobs(); // Fetch jobs on component mount
  }, []);

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const fetchJobs = async () => {
    try {
      const employeeId = localStorage.getItem("Id");
      if (!employeeId) {
        console.error("Employee ID is not found in local storage.");
        return;
      }
      const response = await fetch(
        `https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/get-jobs?employeeId=${encodeURIComponent(
          employeeId
        )}`
      );
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

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(
        `https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/delete-service?jobId=${encodeURIComponent(
          jobId
        )}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await response.json();
      // alert("Job deleted successfully!");
      handleShowAlert("Job Application deleted successfully.");
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      fetchJobs(); // Refresh the jobs list after deletion
    } catch (error) {
      console.error("Failed to delete the job:", error);
      alert("Failed to delete the job. Please try again.");
    }
  };

  // Inline styles
  const styles = {
    container: {
      padding: "20px",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: "25px",
      marginTop: "20px",
      paddingRight: "15px",
    },
    pageTitle: {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "28px",
      color: "#003366",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    },
    th: {
      background: "#1d5066",
      color: "white",
      fontWeight: "normal",
      padding: "10px 15px",
      textAlign: "left",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    },
    td: {
      background: "#f1f1f1",
      padding: "10px 15px",
      borderBottom: "1px solid #ddd",
      color: "#333",
    },
    button: {
      background: "#f90",
      color: "white",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      fontWeight: "bold",
    },
  };

  return (
    <div className="employerHomeScreen">
      {showAlert && (
        <AlertPopup message={alertMessage} onClose={handleCloseAlert} />
      )}
      <nav className="topNav" style={{ marginBottom: "25px" }}>
        <IoIosArrowBack
          style={{
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "auto",
            marginLeft: "5px",
          }}
          onClick={() => navigate("/employerHome")}
        />
        <h1>Posted Jobs</h1>
        <div style={{ marginLeft: "auto" }}>
          <button
            className="buttonStyle"
            style={{
              marginRight: "35px",
            }}
            onClick={() => setShowJobForm(true)}
          >
            Post a Job
          </button>

          <ProfilePopup />
        </div>
      </nav>

      {showJobForm && <JobPostingForm onClose={() => setShowJobForm(false)} />}
      {jobs.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                "Job Title",
                "Category",
                "Description",
                "Job Eligibility",
                "Location",
                "Pay Rate",
                "Deadline",
                "Actions",
              ].map((text, index) => (
                <th key={index} style={styles.th}>
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index}>
                <td style={styles.td}>{job.jobTitle}</td>{" "}
                <td style={styles.td}>{job.jobCategory}</td>{" "}
                <td style={styles.td}>{job.jobDescription}</td>
                <td style={styles.td}>{job.jobEligibility}</td>
                <td style={styles.td}>{job.jobLocation}</td>
                <td style={styles.td}>{job.jobPayRate}</td>
                <td style={styles.td}>{job.jobDeadline}</td>{" "}
                <td style={styles.td}>
                  <button
                    className="buttonStyle"
                    onClick={() => handleDelete(job.jobId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>
            There are no job postings. Click on "Post a Job" button to post a
            new one.
          </h2>
        </div>
      )}
    </div>
  );
}

export default PostedJobsScreen;
