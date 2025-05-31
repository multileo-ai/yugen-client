import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CodeEditor = () => {
  const { taskId } = useParams();
  const [isTask, setIsTask] = useState(false);

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const [taskTitle, setTaskTitle] = useState("Loading...");
  const [fileName, setFileName] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [tempFileName, setTempFileName] = useState("");

  const defaultHtmlComment =
    "<!-- Your HTML code goes here -->\n<!-- Structure your page here -->\n";
  const defaultCssComment =
    "/* Your CSS code goes here */\n/* Style your page here */\n";
  const defaultJsComment =
    "\t// Your JavaScript code goes here\n\t// You can add your logic and functions below\n";

  // Load taskTitle from activeTask in storage
  useEffect(() => {
    const savedTask =
      sessionStorage.getItem("activeTask") ||
      localStorage.getItem("activeTask");

    if (savedTask) {
      const parsedTask = JSON.parse(savedTask);
      if (parsedTask.id?.toString() === taskId?.toString()) {
        setTaskTitle(parsedTask.title);
        setIsTask(true); // ✅ mark this as a task
      } else {
        setTaskTitle("Enter File Name");
        setIsTask(false); // ✅ not a task
      }
    } else {
      setTaskTitle("Enter File Name");
      setIsTask(false); // ✅ not a task
    }
  }, [taskId]);

  // **Fix: only set fileName from storage or taskTitle if user hasn't renamed it**
  useEffect(() => {
    const savedName = sessionStorage.getItem(`fileName_${taskId}`);
    if (savedName) {
      setFileName(savedName);
    } else if (taskTitle && taskTitle !== "Loading...") {
      setFileName(taskTitle);
      sessionStorage.setItem(`fileName_${taskId}`, taskTitle);
    }
  }, [taskId, taskTitle]);

  useEffect(() => {
    if (!showPopup) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (tempFileName.trim() !== "") {
          saveFileName(tempFileName.trim());
        }
      } else if (e.key === "Escape") {
        setShowPopup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup, tempFileName]);

  useEffect(() => {
    setHtml(sessionStorage.getItem(`html_${taskId}`) || "");
    setCss(sessionStorage.getItem(`css_${taskId}`) || "");
    setJs(sessionStorage.getItem(`js_${taskId}`) || "");
  }, [taskId]);

  useEffect(() => {
    sessionStorage.setItem(`html_${taskId}`, html);
    sessionStorage.setItem(`css_${taskId}`, css);
    sessionStorage.setItem(`js_${taskId}`, js);

    const fullCode = `<html><head><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`;
    sessionStorage.setItem(`livePreviewCode_${taskId}`, fullCode);
  }, [html, css, js, taskId]);

  const saveFileName = (name) => {
    setFileName(name);
    setTaskTitle(name);
    sessionStorage.setItem(`fileName_${taskId}`, name);
    setShowPopup(false);
  };

  const openPreview = () => {
    window.open(`/preview/${taskId}`, "_blank");
  };

  const handleEditorClick = () => {
    if (isTask) return; // 🚫 prevent renaming if it's a task
    if (fileName === "Untitled" || fileName === "Enter File Name") {
      setTempFileName(fileName);
      setShowPopup(true);
    } else {
      setTempFileName(fileName);
      setShowPopup(true); // ✅ allow rename for normal files
    }
  };

  const uploadCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    const baseURL =
      process.env.REACT_APP_API_URL || "https://yugen-service.onrender.com";
    console.log("API base URL:", baseURL);

    try {
      const res = await axios.post(
        `${baseURL}/api/code`,
        {
          title: fileName,
          html,
          css,
          js,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Code uploaded successfully!");
      } else {
        alert("Upload failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred while uploading the code.");
    }
  };

  return (
    <>
      <div className="flex mt-[30px] ml-[20px] gap-5">
        <div className="w-[50px] h-[560px] relative flex justify-center items-center">
          <div
            className="absolute text-white text-[20px] bg-[#6D6AEF] text-sm whitespace-nowrap transform -rotate-90 origin-center rounded-full px-5 py-1 cursor-pointer select-none"
            onClick={handleEditorClick}
          >
            {/* Show fileName or fallback to taskTitle */}
            {fileName || taskTitle}
          </div>
        </div>

        <div className="cursor-default">
          <div className="w-[1300px] h-[560px] border border-black rounded-xl p-[20px] relative bg-[white] shadow-[rgb(204,219,232)_3px_3px_6px_0px_inset,rgba(255,255,255,0.5)_-3px_-3px_6px_1px_inset]">
            <div className="circle bg-white border border-black rounded-full w-[180px] h-[180px] z-10 m-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="innercircle bg-[#6D6AEF] relative rounded-full w-[150px] h-[150px] z-10 m-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview();
                }}
              >
                <svg
                  viewBox="0 0 120 60"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[60px] pointer-events-none"
                >
                  <defs>
                    <path
                      id="topCurveInner"
                      d="M10,50 Q60,0 110,50"
                      fill="transparent"
                    />
                  </defs>
                  <text fill="white" fontSize="14" fontFamily="sans-serif">
                    <textPath
                      href="#topCurveInner"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      Live Preview
                    </textPath>
                  </text>
                </svg>
                <img
                  src="/arrow-white.png"
                  alt="Run"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9"
                />
                <svg
                  viewBox="0 0 120 60"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[60px] pointer-events-none"
                >
                  <defs>
                    <path
                      id="bottomCurveInner"
                      d="M10,10 Q60,60 110,10"
                      fill="transparent"
                    />
                  </defs>
                  <text fill="white" fontSize="14" fontFamily="sans-serif">
                    <textPath
                      href="#bottomCurveInner"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      Live Preview
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div className="html w-[1260px] h-[250px] rounded-xl border border-black relative">
                <label
                  className={`absolute top-1 right-2 text-sm text-black bg-white px-1 z-10 transition-opacity ${
                    html ? "opacity-0" : "opacity-100"
                  }`}
                >
                  HTML
                </label>
                <textarea
                  placeholder="HTML"
                  value={html === "" ? defaultHtmlComment : html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-full outline-none bg-transparent p-2 text-black resize-none font-mono"
                />
              </div>

              <div className="cssjs flex gap-[20px]">
                <div className="css w-[590px] h-[250px] rounded-xl border border-black relative">
                  <label
                    className={`absolute top-1 right-12 text-sm text-black bg-white px-1 z-10 transition-opacity ${
                      css ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    CSS
                  </label>
                  <textarea
                    placeholder="CSS"
                    value={css === "" ? defaultCssComment : css}
                    onChange={(e) => setCss(e.target.value)}
                    className="w-full h-full outline-none bg-transparent p-2 text-black resize-none font-mono"
                  />
                </div>

                <div className="h-[160px] w-[80px] bg-[#6D6AEF] mt-[90px] rounded-2xl cursor-pointer flex justify-center items-center">
                  <div
                    className="flex flex-col mt-[18px] text-white text-[14px] text-center select-none"
                    onClick={uploadCode}
                  >
                    <span>U</span>
                    <span>P</span>
                    <span>L</span>
                    <span>O</span>
                    <span>A</span>
                    <span>D</span>
                  </div>
                </div>

                <div className="js w-[590px] h-[250px] rounded-xl border border-black relative">
                  <label
                    className={`absolute top-1 right-2 text-sm text-black bg-white px-1 z-10 transition-opacity ${
                      js ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    JavaScript
                  </label>
                  <textarea
                    value={js === "" ? defaultJsComment : js}
                    onChange={(e) => setJs(e.target.value)}
                    className="w-full h-full outline-none bg-transparent p-2 text-black resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup for renaming */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#000000bb] bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full relative">
            <h2 className="text-2xl font-semibold mb-4">Enter File Name</h2>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              onChange={(e) => setTempFileName(e.target.value)}
              placeholder="File Name"
              // value={tempFileName}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempFileName.trim() === "") return;
                  saveFileName(tempFileName.trim());
                }}
                className="px-4 py-2 rounded-md bg-[#6D6AEF] text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CodeEditor;
