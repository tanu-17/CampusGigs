import React, { useState } from "react";
import { IoIosPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";

const ProfilePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("Id");
    navigate("/"); // Redirect to Role Selection Screen
  };

  return (
    <>
      <IoIosPerson
        size="24"
        onClick={togglePopup}
        style={{ cursor: "pointer" }}
      />
      {isVisible && (
        <div className="notificationPopup">
          {/* Popup content, updated to include logout option */}
          <p
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "black" }}
          >
            Logout
          </p>
        </div>
      )}
    </>
  );
};

export default ProfilePopup;
