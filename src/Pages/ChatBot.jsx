import React, { useState } from "react";
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
      setChatHistory((prev) => [
        ...prev,
        {
          id: chatId,
          title,
          usermsg: userMsg,
          chat: todo,
        },
      ]);
      setChatIdCounter(chatId + 1);
      setActiveChatId(chatId);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: `❌ ${error.message}`,
        },
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
                  className={`flex items-center gap-2 text-sm ${
                    completedTasks[index] ? "line-through text-gray-500" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleTask(index)}
                    className="mt-[2px]"
                  >
                    {completedTasks[index] ? (
                      <FaCheckCircle className="text-[#6D6AEF]" />
                    ) : (
                      <FaRegCircle className="text-[#6D6AEF]" />
                    )}
                  </button>
                  <span>{task}</span>
                  <div className="rounded-full w-4 h-4 bg-[#6D6AEF] flex justify-center items-center">
                    <IoChatbubble size={10} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Enter your problem statement..."
            className="flex-1 p-3 rounded-xl border border-gray-300 outline-none text-sm"
            disabled={disabled || isGenerating}
          />
          <button
            onClick={handleSend}
            disabled={disabled || isGenerating}
            className={`p-3 rounded-full transition ${
              disabled || isGenerating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#6D6AEF] text-white hover:opacity-90"
            }`}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-3">
        <div className="border border-black w-[460px] h-[300px] rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-md font-semibold">Chat History</h1>
            <div
              onClick={startNewChat}
              className="w-6 h-6 bg-[#d9d9d948] flex justify-center items-center rounded-md cursor-pointer"
            >
              <IoAdd size={18} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-1 scroll-hidden">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat)}
                className={`p-2 rounded-md cursor-pointer ${
                  activeChatId === chat.id ? "bg-[#4f4dd4]" : "bg-[#6D6AEF]"
                }`}
              >
                <strong className="text-white tracking-wider">
                  {chat.title}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#6D6AEF] w-[460px] h-[250px] rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between mb-2">
            <div className="bg-white w-6 h-6 rounded-full flex justify-center items-center">
              <IoStar className="text-[#6D6AEF]" size={14} />
            </div>
            <h1 className="text-white">Pro Plan</h1>
          </div>

          <h1 className="text-[40px] text-[white] font-semibold mt-2">
            ₹ 550 / <span className="text-[20px]">month</span>
          </h1>
          <p className="text-[white] text-[14px] mt-2">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            ipsa numquam sapiente suscipit eum ab!
          </p>
          <div className="w-[300px] h-[40px] rounded-full bg-white text-center text-[#6D6AEF] font-semibold flex justify-center items-center cursor-pointer mt-4 ml-14">
            Subscribe Now
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
