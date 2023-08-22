import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { AuthContext } from '../../context/context';

function LoginPage() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated && user) {
      navigate('/');
      // window.location.replace('/');
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData.email);
    console.log(formData.password);
    authCtx.onLogin(formData.email, formData.password);
    navigate('/');
  };

  return (
    <div className={classes.body}>
      <div className={classes.loginContainer}>
        <h2>Login</h2>
        <div>
          <form method="POST" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              required
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              required
              onChange={handleInputChange}
            />
            <button type="submit">Login</button>
          </form>
        </div>
        <div className={classes.registerLink}>
          <span> Don't have an account? </span>{" "}
          <Link to="/auth/register">Register here</Link>
        </div>
        <div className={classes.homeLink}>
          <Link to="/">Continue as Guest</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
