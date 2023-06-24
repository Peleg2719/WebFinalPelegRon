import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
// components
import TasksDetails from "../components/TasksDetails";
import TaskForm from "../components/TaskForm";
import videoURL from "../taskBackGround.mp4";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const [sortedTasks, setSortedTasks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [isManager, setIsManager] = useState(false);
  const email = data.key;
  const managerTasks = data.managerTasks;

  // Extract the name from the email prop
  const name = ()=>{
    if (managerTasks)
    return data.emailManager.split("@")[0];
    else{
      return email.split("@")[0];
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      let response;
      if (managerTasks) {
        response = await fetch(`/api/tasks/${data.emailManager}`);
      } else {
        response = await fetch(`/api/tasks/${email}`);
      }
      const json = await response.json();
  
      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };
  
    fetchTasks();
  }, [dispatch, email, managerTasks, data.emailManager]);
  

  useEffect(() => {
    setIsManager(data.isManager);
  }, [data.isManager]);

  useEffect(() => {
    if (tasks) {
      setSortedTasks([...tasks]);
    }
  }, [tasks]);

  const handleSortByPriority = () => {
    const sortedByPriority = [...sortedTasks].sort((a, b) => {
      const priorityA = a.importantLevel.toLowerCase();
      const priorityB = b.importantLevel.toLowerCase();

      if (priorityA === "high") {
        return -1;
      }
      if (priorityB === "high") {
        return 1;
      }
      if (priorityA === "middle" && priorityB === "low") {
        return -1;
      }
      if (priorityA === "low" && priorityB === "middle") {
        return 1;
      }
      return 0;
    });

    setSortedTasks(sortedByPriority);
  };

  const handleSortByFinalDate = () => {
    const sortedByFinalDate = [...sortedTasks].sort((a, b) => {
      const dateA = new Date(a.finishDate);
      const dateB = new Date(b.finishDate);

      return dateA - dateB;
    });

    setSortedTasks(sortedByFinalDate);
  };

  const handleDeleteTask = (taskId) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  };

  const handleBackToMenu = () => {
    navigate("/worker", { state: { key: data.emailManager } });
  };

  return (
    <div className="home">
      <video autoPlay loop muted className="background-video">
        <source src={`${process.env.PUBLIC_URL}${videoURL}`} type="video/mp4" />
      </video>
      <div className="tasks">
        <div className="task-header">
          <h1>{`${name()}'s Tasks`}</h1>
          <div className="sort-buttons">
            {isManager && (
              <button
                className="material-symbols-outlined"
                onClick={handleBackToMenu}
              >
                home
              </button>
            )}
            <button onClick={handleSortByPriority}>Sort by Priority</button>
            <button onClick={handleSortByFinalDate}>Sort by Final Date</button>
          </div>
        </div>
        <div className="task-list">
          {sortedTasks.map((task) => (
            <TasksDetails
              task={task}
              isManager={isManager}
              managerTasks={data.managerTasks}
              key={task._id}
              onDelete={() => handleDeleteTask(task._id)}
            />
          ))}
        </div>
      </div>
      <TaskForm email={email} />
    </div>
  );
};

export default Home;
