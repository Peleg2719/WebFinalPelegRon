import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import videoURL from '../miniuinim.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);
  
    try {
      const response = await fetch(`/api/users/user?email=${email}&password=${password}`);
      if (!response.ok) {
        throw new Error('Could not fetch the data for that resource!');
      }
  
      const data = await response.json();
      setUser(data);
      setIsPending(false);
      setError(null);
    } catch (error) {
      setIsPending(false);
      setError(error.message);
    }
  };
  
  

  useEffect(() => {
    if (user) {
      // Handle successful login
      console.log('Login successful');
      if (user.type === 'Manager') {
        // Send data to /worker route
        const data = { key: email, isManager: true ,managerTasks:true,emailManager:email}; // Add isManager property
        navigate('/worker', { state: data });
      } else {
        // Send data to /home route
        const data = { key: email, isManager: false ,managerTasks:false,emailManager:''}; // Add isManager property
        navigate('/home', { state: data });
      }
    }
  }, [user, navigate,email]);
  

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src={process.env.PUBLIC_URL + videoURL} type="video/mp4" />
      </video>
      {isPending && <div>Loading...</div>}
      {!isPending && (!error||error==="Could not fetch the data for that resource!") && !user && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="loginDeatils">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button id="login" type="submit">Login</button>
          </div>
          {error=="Could not fetch the data for that resource!" && <div className="error-label">{"Wrong email or Password please try again!"}</div>}
        
        </form>
      )}
    </div>
  );
};

export default Login;
