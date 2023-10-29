import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role_id = 1;

  // State variables for input values
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputImage, setInputImage] = useState("");

  const isLogged = useSelector((state) => state.auth.isLogged);

  const addNewUser = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("https://backend-kxp7.onrender.com/users/register", {
        username: inputUsername,
        password: inputPassword,
        email: inputEmail,
        image: inputImage,
        role_id,
      });

      if (result.data.success) {
        console.log("Register successfully");
        setInputUsername("");
        setInputPassword("");
        setInputEmail("");
        navigate("/Login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      console.log("Registration didn't work");
    }
  };

  return (
    <>

<form class="form_container">
      <div class="logo_container">
        <img src={"https://res.cloudinary.com/dmhvb05w3/image/upload/v1697139315/download-removebg-preview_amtoid.png"} />
      </div>
      <div class="title_container">
        <p class="title">Login to your Account</p>
        <span class="subtitle">
          Get started with our app, just create an account and enjoy the
          experience.
        </span>
      </div>
      <br />
      <div class="input_container">
        <label class="input_label" for="email_field">
          User Name
        </label>
        
        <input
          placeholder="@user_name"
          title="Inpit title"
          name="input-name"
          type="text"
          class="input_field"
          id="email_field"
          onChange={(e) => setInputUsername(e.target.value)}
        />
      </div>
      <div class="input_container">
        <label class="input_label" for="email_field">
          Email
        </label>

        <input
          placeholder="name@mail.com"
          title="Inpit title"
          name="input-name"
          type="text"
          class="input_field"
          id="email_field"
          onChange={(e) => setInputEmail(e.target.value)}
        />
      </div>
      <div class="input_container">
        <label class="input_label" for="password_field">
          Password
        </label>
        <input
          placeholder="Password"
          title="Inpit title"
          name="input-name"
          type="password"
          class="input_field"
          id="password_field"
          onChange={(e) => setInputPassword(e.target.value)}
        />
      </div>
      <div class="input_container">
        <label class="input_label" for="password_field">
        Photo
        </label>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          class="icon">
           
        </svg>
        <input
          placeholder="photo url"
          title="Inpit title"
          name="input-name"
          type="text"
          class="input_field"
          id="password_field"
          onChange={(e) => setInputImage(e.target.value)}
        />
      </div>
      <button title="Sign In" type="submit" class="sign-in_btn" onClick={addNewUser}>
        <span>Create new account</span>
      </button>
      <div class="separator">
        <span>
          <Link to="/login">already have an account</Link>
        </span>
      </div>
      <div class="separator">
       
      </div>
    </form>
    </>
  );
};

export default Register;
