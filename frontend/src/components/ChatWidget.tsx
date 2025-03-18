import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import "../styles/global.css";

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <button 
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#0078ff",
          color: "white",
          fontSize: "24px",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
    </>
  );
};

export default ChatWidget;
