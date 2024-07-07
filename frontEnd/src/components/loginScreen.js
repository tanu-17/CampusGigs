import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "../syrlogo.png";
import AlertPopup from "./alertPopup";

function LogScreen() {
  const navigate = useNavigate(); // Initialize useHistory
  const location = useLocation(); // Access the location object
  const role = location.state?.role;
  console.log("incoming role:: ", role);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Make API call to login endpoint
      const response = await fetch(
        "https://tt00787goi.execute-api.us-east-2.amazonaws.com/dev/authLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            password: password,
            role: role,
          }),
        }
      );
      const responseData = await response.json();
      console.log("responsee---- coming just check ittttttt", responseData);
      if (responseData.statusCode === 200) {
        console.log("responsee----", responseData);
        // If login successful, redirect to StudentHomeScreen component
        if (role === "student") {
          console.log("student logged in", responseData.data);
          localStorage.setItem("Id", responseData.data.suid);
          navigate("/studentHome");
        } else {
          console.log("employee logged in", responseData.data);
          localStorage.setItem("Id", responseData.data.employeeId);
          navigate("/employerHome");
        }
      } else if (responseData.statusCode === 400) {
        // Handle login error
        console.error(responseData.message);
      } else if (responseData.statusCode === 404) {
        console.error(responseData.message);
        // alert("Invalid credentials. Please try again.");
        handleShowAlert(
          "Invalid Credentials! Please enter valid id and password."
        );
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else {
        console.error(responseData.message);
      }
    } catch (error) {
      // Handle fetch or API call error
      console.error("API call failed:", error);
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {showAlert && (
        <AlertPopup message={alertMessage} onClose={handleCloseAlert} />
      )}
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
          width: "340px",
          height: "260px",
        }}
      >
        <form
          style={{
            border: "3px solid #f5f5f5",
            // paddingBottom: "50px",
            borderRadius: "5px",
          }}
        >
          {/* Form heading */}
          <div style={{ margin: "10px", alignItem: "start" }}>
            <label
              htmlFor="id"
              style={{
                display: "flex",
                paddingBottom: "6px",
              }}
            >
              User Id:
            </label>{" "}
            {/* Label for Id */}
            <input
              style={{ width: "95%", height: "25px" }}
              type="number"
              id="Id"
              name="Id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />{" "}
            {/* Input field for Id */}
          </div>
          <div style={{ margin: "10px" }}>
            <label
              htmlFor="password"
              style={{ display: "flex", paddingBottom: "6px" }}
            >
              Password:
            </label>{" "}
            {/* Label for password */}
            <input
              style={{ width: "95%", height: "25px" }}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            {/* Input field for password */}
          </div>
          <button
            style={{
              backgroundColor: "#F76900",
              color: "white",
              padding: "10px 80px",
              margin: "50px",
              borderRadius: "5px",
              border: "none",
            }}
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>{" "}
          {/* Login button */}
        </form>
      </div>
    </div>
  );
}

export default LogScreen;
