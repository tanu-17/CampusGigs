import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogScreen from "./loginScreen";
import logo from "../syrlogo.png";

function RoleSelector() {
  const [role, setRole] = useState(null); // State variable to hold the selected role
  const navigate = useNavigate();
  // Function to handle the click event when a role button is clicked
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole); // Set the selected role in state
    navigate("/login", { state: { role: selectedRole } });
  };

  const buttonStyle = {
    width: "90%",
    padding: "10px",
    margin: "10px 0", // Add margin for spacing between buttons
    backgroundColor: "#F76900",
    color: "white", // White text color
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <img src={logo} height="190px" alt="logo" />
        <h2
          style={{
            color: "#F76900",
            fontFamily: "Open Sans, sans-serif",
          }}
        >
          Welcome to Campus Gigs!
        </h2>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "2px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
          width: "340px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", // Add shadow for depth
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            style={buttonStyle}
            onClick={() => handleRoleSelection("student")}
          >
            Student Login
          </button>
          <button
            style={buttonStyle}
            onClick={() => handleRoleSelection("employer")}
          >
            Employer Login
          </button>
        </div>
        {role && <LogScreen role={role} />}
      </div>
    </div>
  );
}

export default RoleSelector;
