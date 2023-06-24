import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import videoURL from "../WorkerBackGround.mp4";
const WorkerScreen = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [emailM,setEmailM] = useState(data.key)
  useEffect(() => {
    getUsers();
    if(data.emailManager){
      setEmailM(data.emailManager)
    }
  }, [data.emailManager]);

  const getUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const responseData = await response.json();
      const usersData = responseData.filter(user => user.type === 'Worker'); // Filter users by type "Worker"
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = ( email,emailM) => {
    const data = { key: email,isManager: true , managerTasks:false,emailManager:emailM};
    navigate('/home',  { state: data} );
  };
  const handleUserClickManager = (email)=>{
    const data = { key: email,isManager: true , managerTasks:true,emailManager:emailM};
    navigate('/home',  { state: data} );
  }

  return (
    <div className="worker-screen">
    <video autoPlay loop muted className="background-video">
      <source src={process.env.PUBLIC_URL + videoURL} type="video/mp4" />
    </video>
    <h1>Manager Screen</h1>
    <button onClick={() => handleUserClickManager(emailM)}>My Tasks</button>
    <div className="users-container">
      {users.map((user) => (
        <button key={user._id} onClick={() => handleUserClick(user.name,emailM)}>
          {user.name}
        </button>
      ))}
    </div>
  </div>
  );
};

export default WorkerScreen;
