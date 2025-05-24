import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditorPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("activeTask");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.id.toString() === taskId) {
        setTask(parsed);
      }
    }
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{task.title}</h1>
      <textarea
        className="w-full h-[300px] p-4 border rounded"
        defaultValue={task.initialCode || "<!-- Your code here -->"}
      />
      {/* Add preview or run button here */}
    </div>
  );
};

export default EditorPage;
