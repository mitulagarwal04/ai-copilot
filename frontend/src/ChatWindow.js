import React, { useState } from "react";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      // Send message to backend
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Add bot response to chat
      const botMessage = { text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "⚠️ Backend not responding", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput(""); // Clear input
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto border rounded p-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 my-1 rounded ${
              msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex mt-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
