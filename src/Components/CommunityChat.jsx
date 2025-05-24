import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

const CommunityChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "Alice", text: "Hey everyone!" },
    { sender: "You", text: "Hi Alice, welcome!" },
  ]);

  const handleSend = () => {
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "You", text: message.trim() }]);
    setMessage("");
  };

  return (
    <div className="flex gap-6 mt-[30px] ml-[30px]">
      {/* Chat Box */}
      <div className="w-[970px] h-[560px] border border-black rounded-xl p-[20px] bg-white shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset] flex flex-col justify-between">
        {/* Message Display */}
        <div className="overflow-y-auto flex-1 pr-2 mb-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] text-sm ${
                  msg.sender === "You"
                    ? "bg-[#6D6AEF] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            </div>
          ))}
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
