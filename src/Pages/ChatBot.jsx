import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoAdd, IoChatbubble, IoSend, IoStar } from "react-icons/io5";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [chatIdCounter, setChatIdCounter] = useState(1);
  const [activeChatId, setActiveChatId] = useState(null);
  const [userId, setUserId] = useState(null);

  const baseURL =
    process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";

  const toggleTask = (index) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const cleanAIResponse = (text) => {
    try {
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.slice(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonStr);
      }
    } catch {}
    return [];
  };

  const extractTitle = (text) => {
    const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/);
    return titleMatch ? titleMatch[1] : "Untitled";
  };

  const extractTodoList = (text) => {
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonStr = text.slice(jsonStart, jsonEnd + 1);
      try {
        return JSON.parse(jsonStr);
      } catch {
        return [];
      }
    }
    return [];
  };

  const generateResponse = async (userMsg) => {
    if (!userMsg || disabled) return;

    setIsGenerating(true);
    setMessages([{ type: "user", text: userMsg }]);
    setMessage("");

    const prompt = `you are a technical project manager AI. The user wants to build: "${userMsg}"

BREAK THIS DOWN INTO:
1. Project Setup
2. Core Components
3. Features/Functionality
4. Styling/UI
5. Data Management
6. Integrations
7. Testing
8. Deployment

Return ONLY a valid JSON array of strings with these rules:
1. NO markdown formatting (no \`\`\`json or \`\`\`)
2. NO comments (no // PROJECT SETUP)
3. NO numbering (no 1., 2., etc.)
4. Start IMMEDIATELY with [
5. End with ]
6. Each item must be a string in quotes
7. No trailing commas

EXAMPLE FOR "E-commerce Platform":
[
  
  "Initialize Next.js project with TypeScript and Tailwind CSS",
  "Configure ESLint + Prettier for code quality",
  "Set up state management (Zustand/Redux)",

  
  "Navbar: Responsive layout with: Logo, Search bar [Requires: Algolia], User auth buttons, Cart icon with counter",
  "Hero Section: Full-width carousel with auto-rotate and manual controls",
  "Product Grid: Responsive card layout with: Image, Title, Price, Rating, Add-to-cart button",
  "Product Detail: Page with: Image gallery, Variant selector, Description tabs, Review section",
  "Cart Sidebar: Slide-out panel with: Item list, Quantity adjusters, Subtotal, Checkout button",

  
  "Implement user authentication: Login/Register forms with JWT cookies",
  "Product search: Instant search with filters [Requires: Algolia integration]",
  "Checkout flow: 3-step process (Address → Payment → Confirmation)",

  
  "Design MongoDB schema for: Products, Users, Orders",
  "Create API endpoints for CRUD operations",
  "Implement data fetching with React Query",

  
  "Payment: Stripe integration with test mode",
  "Analytics: Google Tag Manager setup",
  "Email: SendGrid integration for order confirmations",


  "Design system: Color palette, Typography scale, Spacing system",
  "Dark mode: Implement theme switcher with system preference detection",
  "Micro-interactions: Button hover states, Loading skeletons",


  "Unit tests: Jest setup for core components",
  "E2E tests: Cypress configuration for critical user flows",


  "Dockerize application for production",
  "CI/CD pipeline: GitHub Actions for automated testing and deployment",
  "Monitoring: Set up Sentry for error tracking"
]

YOUR RESPONSE MUST BE:
- Be extremely specific about components and their features
- Include both frontend and backend considerations
- Mention any recommended libraries
- No explanations outside the JSON array
- Maintain this level of detail regardless of project type`;

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCaPm8NB9Ft6fpoWYdBJrybYqs586tRnNc"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      const title = await generateShortTitle(userMsg);
      const todo = extractTodoList(rawText);

      if (!Array.isArray(todo) || todo.length === 0) {
        throw new Error("Invalid or empty todo list");
      }

      setTodoList(todo);
      setDisabled(true);

      const chatId = chatIdCounter;
      const newChat = {
        id: chatId,
        title,
        usermsg: userMsg,
        chat: todo,
      };

      setChatHistory((prev) => [...prev, newChat]);

      if (userId && userId !== "guest") {
        await axios.post(`${baseURL}/api/user/aichat`, {
          userId,
          chatSession: newChat,
        });
      }

      setChatIdCounter(chatId + 1);
      setActiveChatId(chatId);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { type: "error", text: `❌ ${error.message}` },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    if (message.trim() !== "" && !disabled) {
      generateResponse(message.trim());
    }
  };

  const fetchChatbotHistory = async (uid) => {
    try {
      const response = await axios.get(`${baseURL}/api/user/aichat/${uid}`);
      const data = response.data;

      if (data && Array.isArray(data)) {
        setChatHistory(data);
        if (data.length > 0) {
          setChatIdCounter(Math.max(...data.map((chat) => chat.id)) + 1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const startNewChat = () => {
    setMessage("");
    setMessages([]);
    setTodoList([]);
    setCompletedTasks({});
    setDisabled(false);
    setActiveChatId(null);
  };

  const loadChat = (chat) => {
    setMessages([{ type: "user", text: chat.usermsg }]);
    setTodoList(chat.chat);
    setCompletedTasks({});
    setDisabled(true);
    setActiveChatId(chat.id);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || !stored._id) {
      console.error("No valid user found");
      return;
    }
    setUserId(stored._id);
    fetchChatbotHistory(stored._id);
  }, []);

  const generateShortTitle = async (userMsg) => {
    const prompt = `Give me a very short title (3 to 5 words max) summarizing this project idea:\n"${userMsg}".\nRespond ONLY with the title — no quotes, no punctuation, no explanation.`;
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCaPm8NB9Ft6fpoWYdBJrybYqs586tRnNc"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const title = result.response.text().trim();
      return title;
    } catch (err) {
      return userMsg.split(" ").slice(0, 5).join(" "); // fallback
    }
  };

  return (
    <div className="flex gap-6 mt-[30px] ml-[30px]">
      <div className="w-[900px] h-[560px] border border-black rounded-xl p-[20px] bg-white shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset] flex flex-col justify-between">
        <div className="overflow-y-auto flex-1 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 px-4 py-2 rounded-xl max-w-[75%] text-sm ${
                msg.type === "user"
                  ? "bg-[#6D6AEF] text-white self-end ml-auto"
                  : "bg-red-100 text-red-800 border border-red-300 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {isGenerating && (
            <div className="my-2 px-4 py-2 rounded-xl max-w-[75%] text-sm bg-[#e9e9e9] text-gray-800 border border-gray-300 self-start">
              Generating todo list as per your problem statement...
            </div>
          )}

          {todoList.length > 0 && (
            <div className="mt-4 space-y-2">
              {todoList.map((task, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm rounded p-1 cursor-pointer ${
                    completedTasks[index] ? "text-gray-400 line-through" : ""
                  }`}
                  onClick={() => toggleTask(index)}
                >
                  {completedTasks[index] ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaRegCircle className="text-gray-400" />
                  )}
                  <span>{task}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              disabled
                ? "Start new chat by clicking +"
                : "Enter your project idea here..."
            }
            value={message}
            disabled={disabled}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-grow rounded-lg border border-gray-400 p-2 text-black"
          />
          <button
            onClick={handleSend}
            disabled={disabled || message.trim() === ""}
            className={`rounded-lg p-2 ${
              disabled || message.trim() === ""
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#6D6AEF] text-white"
            }`}
          >
            <IoSend size={24} />
          </button>
        </div>
      </div>

      <div className="w-[240px] flex flex-col border border-black rounded-xl p-4 bg-white shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset] max-h-[560px] overflow-y-auto">
        <button
          className="flex items-center gap-2 mb-4 text-sm text-[#6D6AEF] font-semibold hover:underline"
          onClick={() => {
            startNewChat();
          }}
        >
          <IoAdd size={20} />
          New Chat
        </button>

        {chatHistory.length === 0 && (
          <div className="text-gray-600 text-sm">No chat history yet</div>
        )}

        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            onClick={() => loadChat(chat)}
            className={`text-left mb-2 px-3 py-2 rounded hover:bg-[#6D6AEF] hover:text-white transition-colors duration-300 ${
              chat.id === activeChatId
                ? "bg-[#6D6AEF] text-white"
                : "bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="truncate">{chat.title}</span>
              <IoStar size={18} className="text-yellow-400" />
            </div>
            <div className="text-xs text-gray-600 truncate">{chat.usermsg}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBot;
