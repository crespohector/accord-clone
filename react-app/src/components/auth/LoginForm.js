import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { login } from "../../store/session";
import NavBar from "../Navbar/Navbar";

import './LoginForm.css'

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      const arr = [];
      data.errors.forEach(error => {
        // "Email : email is invalid" => slice the error string after the ":"
        const startIdx = error.indexOf(":") + 2;
        arr.push(error.slice(startIdx));
      })
      setErrors(arr)
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const demoLogin = async (e) => {
    const email = 'demo@aa.io';
    const password = 'password';
    e.preventDefault();
    setErrors([]);
    const data = await dispatch(login(email, password));
    if (data.errors) {
      setErrors(data.errors);
    }
  }

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div id="login__background">
      <div id="login__container">
        <h1 id="login__title">Welcome back!</h1>
        <h3 id="login__title--subtitle">We're so excited to see you again!</h3>
        <form onSubmit={onLogin} id="login__form">
            {errors.map((error, idx) => (
              <h5 className="errors" key={idx}>{error}</h5>
            ))}
          <div>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="text"
              value={email}
              onChange={updateEmail}
              required
            />
          </div>
          <div>
            <label htmlFor="password" id="password--margin">Password</label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={updatePassword}
              required
            />
          </div>
          <button type="submit" id="button1">Login</button>
          <button type="submit" id="button2" onClick={demoLogin}>Demo Login</button>
          <div id="register__link">
            <p>Need an account?</p>
            <NavLink to="/sign-up">Register</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
