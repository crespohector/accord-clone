import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';
import { useLoading } from "../context/LoadingContext";
import './SignUpForm.css'

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const { setIsLoading } = useLoading();

  const onSignUp = async (e) => {
    e.preventDefault();
    //check if passwords are mismatched
    if (password !== repeatPassword) {
      setErrors(["Passwords are mismatched"]);
      return;
    }
    // render loading animation
    setIsLoading(true);
    const res = await dispatch(signUp(username, email, password));
    // stop loading animation
    setIsLoading(false);
    // check if errors property exist
    if (res.errors) {
      const arr = [];
      res.errors.forEach(error => {
        // "Email : email is invalid" => slice the error string after the ":"
        const startIdx = error.indexOf(":") + 2;
        arr.push(error.slice(startIdx));
      })
      setErrors(arr)
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div id="signup__background">
      <div id="signup__container">
        <h1 id="signup__title">Create an account</h1>

        {errors.length > 0 &&
          <div>
            {errors.map((error, idx) => (
              <h5 className="errors" key={idx}>{error}</h5>
            ))}
          </div>
        }

        <form onSubmit={onSignUp} id="signup__form">
          <div>
            <label>User Name</label>
            <input
              type="text"
              name="username"
              onChange={updateUsername}
              value={username}
              required
            ></input>
          </div>
          <div>
            <label>Email</label>
            <input
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
              required
            ></input>
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={updatePassword}
              value={password}
              required
              minLength={4}
            ></input>
          </div>
          <div>
            <label>Repeat Password</label>
            <input
              type="password"
              name="repeat_password"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
              minLength={4}
            ></input>
          </div>
          <button type="submit" className="button">Sign Up</button>
          <NavLink to="/login" id="login__link">Already have an account?</NavLink>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
