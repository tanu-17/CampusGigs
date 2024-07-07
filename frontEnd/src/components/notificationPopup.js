// NotificationPopup.js
import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import "../App.css";

const NotificationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <IoIosNotifications
        size="24"
        onClick={togglePopup}
        style={{ cursor: "pointer" }}
      />
      {isVisible && (
        <div className="notificationPopup">
          {/* Popup content */}
          <p>Dummy Notification Content</p>
          <p>Click the bell icon again to close this popup.</p>
        </div>
      )}
    </>
  );
};

export default NotificationPopup;
