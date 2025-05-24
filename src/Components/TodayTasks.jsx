  import React from "react";
  import { useNavigate } from "react-router-dom";
  import tasks from "../data/tasks.json";

  const TodayTasks = () => {
    const navigate = useNavigate();

    return (
      <div className="w-[620px] h-[350px] bg-white rounded-[60px] shadow-[#D8D8D8] shadow-sm">
        <div className="flex flex-col h-full">
          <div className="ml-[35px] mt-[20px]">
            <h1 className="text-[25px] font-[700]">Today Tasks</h1>
            <p className="text-[15px] font-[300] tracking-widest">
              Refreshed at 10:00 A.M
            </p>
          </div>

          <div className="flex flex-col gap-2 ml-[35px] mt-[20px] w-[550px] max-h-[220px] overflow-y-auto overflow-x-hidden pr-2 scroll-hidden">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="w-[550px] h-[70px] bg-[#ffffff] shadow-sm items-center rounded-full hover:shadow-[#4c4c4c4a] hover:shadow-md"
              >
                <div className="flex items-center gap-[60px] mt-[2px]">
                  <div className="flex flex-col ml-[20px] mt-[10px] w-[160px]">
                    <h1 className="font-bold">{task.title}</h1>
                    <p>+{task.points} points</p>
                  </div>

                  <div
                    className="bg-[#6D6AEF] rounded-2xl w-[50px] h-[50px] flex justify-center items-center mt-[5px] cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("activeTask", JSON.stringify(task));
                      window.open(`/editor/${task.id}`, "_blank");
                    }}
                  >
                    <img
                      src="/code-editor-white.png"
                      className="w-[30px] h-[30px]"
                      alt="Open Editor"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <h1>{task.progress}%</h1>
                    <div className="progress w-[130px] h-[3px] rounded-full bg-[#b3b3b3]">
                      <div
                        className="h-full bg-[#6D6AEF]"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default TodayTasks;
