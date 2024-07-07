// AlertPopup.js

import React from "react";
import ReactDOM from "react-dom";

const AlertPopup = ({ message, onClose }) => {
  return ReactDOM.createPortal(
    <div style={styles.backdrop}>
      <div style={styles.popup}>
        <p>{message}</p>
        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 1001,
  },
  closeButton: {
    padding: "5px 10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AlertPopup;
