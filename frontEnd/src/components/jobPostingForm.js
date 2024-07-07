// JobPostingForm.js
import React, { useState } from "react";
import "../JobPostingForm.css";
import AlertPopup from "./alertPopup";

const JobPostingForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobCategory: "",
    jobDescription: "",
    jobEligibility: "",
    jobLocation: "",
    jobPayRate: "",
    jobDeadline: "",
    jobSkillsRequired: "",
    employeeId: localStorage.getItem("Id"),
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  console.log("localll", localStorage.getItem("Id"));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/job-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log("sdfsgwregw", data);
      if (data.statusCode === 200) {
        // onClose(); // Close the form upon successful submission
        handleShowAlert("Job Posted Successfully.");
        setTimeout(() => {
          setShowAlert(false);
          onClose(); // Close the form upon successful submission
        }, 3000);
        window.location.reload();
      }
      //throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error("There was an error posting the job:", error);
    }
  };

  return (
    <div className="jobPostingFormBackdrop">
      <div className="jobPostingFormContainer">
        {showAlert && (
          <AlertPopup message={alertMessage} onClose={handleCloseAlert} />
        )}
        <button className="formCloseButton" onClick={onClose}>
          X
        </button>
        <h2>Post a New Job</h2>
        <form onSubmit={handleSubmit}>
          <label>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            required
            onChange={handleInputChange}
          />

          <label>Job Category</label>
          <input
            type="text"
            name="jobCategory"
            required
            onChange={handleInputChange}
          />

          <label>Job Description</label>
          <textarea
            name="jobDescription"
            required
            onChange={handleInputChange}
          ></textarea>

          <label>Job Eligibility</label>
          <input
            type="text"
            name="jobEligibility"
            required
            onChange={handleInputChange}
          />

          <label>Job Location</label>
          <input
            type="text"
            name="jobLocation"
            required
            onChange={handleInputChange}
          />

          <label>Job Pay Rate</label>
          <input
            type="text"
            name="jobPayRate"
            required
            onChange={handleInputChange}
          />

          <label>Job Deadline</label>
          <input
            type="date"
            name="jobDeadline"
            required
            onChange={handleInputChange}
          />

          <label>Job Skills Required</label>
          <input
            type="text"
            name="jobSkillsRequired"
            onChange={handleInputChange}
          />
          <button
            style={{
              backgroundColor: "#1d5066",
              padding: "15px",
              borderRadius: "5px",
            }}
            type="submit"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;
