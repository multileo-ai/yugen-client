import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";

const CommunityChat = ({ onUserClick }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fix currentUser: assume localStorage 'user' stores { token, user }
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchMessages(); // Initial fetch

    const interval = setInterval(() => {
      fetchMessages(); // Fetch every 2 seconds
    }, 2000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat");
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        console.error("Invalid format: messages not an array");
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      const token = currentUser.token;

      if (!token) {
        console.error("No token found, please login");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex gap-6 mt-[30px] ml-[30px]">
      {/* Chat Box */}
      <div className="w-[970px] h-[560px] border border-black rounded-xl p-[20px] bg-white shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset] flex flex-col justify-between">
        {/* Message Display */}
        <div className="overflow-y-auto flex-1 pr-2 mb-4 space-y-3">
          {Array.isArray(messages) &&
            messages.map((msg, index) => {
              const isCurrentUser = msg.username === currentUser.username;
              return (
                <div
                  key={index}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[75%] text-sm ${
                      isCurrentUser
                        ? "bg-[#6D6AEF] text-white"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    <strong
                      className="cursor-pointer hover:underline"
                      onClick={() => onUserClick(msg.username)}
                    >
                      {msg.name} (@{msg.username}):
                    </strong>{" "}
                    {msg.message}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Message Input */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl border border-gray-300 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            className="p-3 rounded-full transition bg-[#6D6AEF] text-white hover:opacity-90"
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
