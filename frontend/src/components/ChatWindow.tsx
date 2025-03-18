import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import MessageInput from "./MessageInput";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  fileUrl?: string;
  timestamp?: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Запрашиваем историю чата при монтировании
    socket.emit("getHistory");
    
    socket.on("initHistory", (all: ChatMessage[]) => {
      setMessages(all);
    });
    socket.on("message", (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
      setTyping(false);
    });
    socket.on("typing", () => setTyping(true));

    return () => {
      socket.off("initHistory");
      socket.off("message");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      position: "fixed",
      bottom: "90px",
      right: "20px",
      width: "300px",
      height: "400px",
      background: "white",
      border: "1px solid #ccc",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        padding: "8px",
        borderBottom: "1px solid #ccc",
        background: "#fafafa",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <span>GPT Chat</span>
        <button onClick={onClose} style={{
          border: "none",
          background: "transparent",
          fontSize: "16px",
          cursor: "pointer"
        }}>×</button>
      </div>
      <div style={{
        flex: 1,
        padding: "8px",
        overflowY: "auto",
        background: "#f9f9f9"
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            margin: "5px 0",
            padding: "8px",
            borderRadius: "4px",
            background: msg.sender === "assistant" ? "#e6f7ff"
                      : msg.sender === "manager" ? "#ffd591"
                      : "#d9f7be",
            alignSelf: msg.sender === "assistant" ? "flex-start" : "flex-end",
            maxWidth: "80%"
          }}>
            {msg.fileUrl ? (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                📎 {msg.text}
              </a>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {typing && <div style={{ fontStyle: "italic" }}>Assistant печатает...</div>}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
