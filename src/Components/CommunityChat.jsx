import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const CommunityChat = ({ onUserClick }) => {
  const baseURL =
    process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [allUsers, setAllUsers] = useState([]);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [mentionStartIndex, setMentionStartIndex] = useState(null);

  const bottomRef = useRef(null);

  // Fix currentUser: assume localStorage 'user' stores { token, user }
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Extract mentions
  const mentionedUsernames = [...message.matchAll(/@(\w+)/g)].map((m) => m[1]);

  mentionedUsernames.forEach((username) => {
    if (username == currentUser.username) {
      toast(`User @${username} was mentioned!`);
    }
  });

  useEffect(() => {
    // Fetch all users once
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/users`); // Make sure this route exists and returns usernames
        setAllUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users for mentions");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages(); // Initial fetch

    const interval = setInterval(() => {
      fetchMessages(); // Fetch every 2 seconds
    }, 2000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // const res = await axios.get("http://localhost:5000/api/chat");

  const fetchMessages = async () => {
    try {
      const token = currentUser?.token;
      const res = await axios.get(
        `${baseURL}/api/chat`,
        {}, // body (empty in this case)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data)) {
        setMessages((prevMessages) => {
          const newMessages = res.data;
          if (newMessages.length > prevMessages.length && isNearBottom()) {
            setTimeout(
              () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
              100
            );
          }
          return newMessages;
        });
      } else {
        setMessages([]);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Failed to fetch messages. Please try again."
      );
    }
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      const token = currentUser.token;

      if (!token) {
        toast.error("No token found, please login");
        return;
      }

      // const res = await axios.post(
      //   "http://localhost:5000/api/chat",
      //   { message },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );

      const res = await axios.post(
        `${baseURL}/api/chat`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => {
        const updated = [...prev, res.data];
        // Scroll after messages update
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return updated;
      });

      setMessage("");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to send message. Please try again."
      );
    }
  };

  const isNearBottom = () => {
    const container = document.getElementById("chat-scroll-container");
    return container
      ? container.scrollHeight - container.scrollTop - container.clientHeight <
          150
      : false;
  };

  return (
    <div className="flex gap-6 mt-[30px] ml-[30px]">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Chat Box */}
      <div className="w-[970px] h-[560px] border border-black rounded-xl p-[20px] bg-white shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset] flex flex-col justify-between">
        {/* Message Display */}
        <div
          id="chat-scroll-container"
          className="h-[420px] overflow-y-auto pr-2 mb-4 space-y-3 scroll-hidden"
        >
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
                      onClick={() => {
                        if (msg.username !== currentUser.username) {
                          onUserClick(msg.username);
                        }
                      }}
                    >
                      {msg.name} (@{msg.username}):
                    </strong>{" "}
                    {msg.message}
                  </div>
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>

        {/* Message Input */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              const val = e.target.value;
              setMessage(val);

              const cursor = e.target.selectionStart;
              const textUpToCursor = val.slice(0, cursor);
              const match = textUpToCursor.match(/@(\w*)$/);

              if (match) {
                const partial = match[1].toLowerCase();
                setMentionStartIndex(cursor - match[0].length);

                const filtered = allUsers.filter(
                  (u) =>
                    u.username.toLowerCase().startsWith(partial) &&
                    u.username !== currentUser.username
                );
                setMentionSuggestions(filtered.slice(0, 5));
              } else {
                setMentionSuggestions([]);
                setMentionStartIndex(null);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl border border-gray-300 outline-none text-sm"
          />
          {mentionSuggestions.length > 0 && (
            <div className="absolute bottom-16 bg-white border rounded-md shadow-md w-[200px] max-h-[150px] overflow-y-auto z-50">
              {mentionSuggestions.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    const before = message.slice(0, mentionStartIndex);
                    const after = message.slice(
                      message.indexOf(" ", mentionStartIndex) !== -1
                        ? message.indexOf(" ", mentionStartIndex)
                        : message.length
                    );
                    setMessage(`${before}@${user.username} ${after}`.trim());
                    setMentionSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                >
                  @{user.username}
                </div>
              ))}
            </div>
          )}
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
