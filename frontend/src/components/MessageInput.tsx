import React, { useState, ChangeEvent } from "react";
import { socket } from "../socket";

const MessageInput: React.FC = () => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      socket.emit("message", { text: text.trim(), sender: "user" });
      setText("");
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        socket.emit("message", {
          text: data.fileName,
          fileUrl: data.fileUrl,
          sender: "user"
        });
      } catch (error) {
        console.error("Ошибка загрузки файла", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: "8px",
      borderTop: "1px solid #ccc",
      display: "flex",
      alignItems: "center"
    }}>
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, padding: "6px" }}
      />
      <label style={{
        marginLeft: "6px",
        cursor: "pointer",
        maxWidth: "30px",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        📎
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
      </label>
      <button
        type="submit"
        style={{
          marginLeft: "6px",
          padding: "6px 12px",
          maxWidth: "80px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        Отправить
      </button>
    </form>
  );
};

export default MessageInput;
