import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";

const TasksDetailes = ({ task, isManager, managerTasks }) => {
  const { dispatch } = useTasksContext();
  const [isMarked, setIsMarked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isBuissnessAndManager, setIsBuissnessAndManager] = useState(true);

  useEffect(() => {
    if (task.type === "personal" && isManager && !managerTasks) {
      setIsBuissnessAndManager(false);
    }
  }, [isManager,managerTasks,task.type]);

  const handleMark = () => {
    setIsMarked(!isMarked);
  };



  const handleClick = async () => {
    const response = await fetch("/api/tasks/" + task._id, { method: "DELETE" });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
    }
  };

  const formattedFinishDate = new Date(task.finishDate).toLocaleDateString();

  return (
    <div
      className={`task-details ${isMarked ? "marked" : ""} ${
        isDeleted ? "deleted" : ""
      }`}
      onClick={handleMark}
    >
      <h3 className={isMarked ? "marked" : ""}>{task.title}</h3>
      <div className="properties">
        <p>
          <label>Created date:</label> {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <p>
          <label>Finish Date:</label> {formattedFinishDate}
        </p>
        <p>
          <label>Important level:</label> {task.importantLevel}
        </p>
        <p>
          <label>Type:</label> {task.type}
        </p>
      </div>
      {isMarked && !isDeleted && isBuissnessAndManager && (
        <span className="material-symbols-outlined delete-button" onClick={handleClick}>
          Delete
        </span>
      )}
    </div>
  );
};

export default TasksDetailes;
