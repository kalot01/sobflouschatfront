import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "../../App";
import logo from "../../assets/sobflous.png";
import "./auth.css";

export default function Auth() {
  function login() {
    axiosInstance
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then((resp) => {
        if (resp.status == 201) {
          console.log(resp.data);
          window.sessionStorage.setItem("username", resp.data.username);
          window.sessionStorage.setItem("token", resp.data.token);
          history.push("/dashboard");
        } else {
          alert(resp.data.error);
        }
      });
  }
  function signup() {
    if (password == confirmPassword) {
      if (username.length > 0 && password.length > 0) {
        axiosInstance
          .post("/auth/register", {
            username: username,
            password: password,
          })
          .then((resp) => {
            if (resp.status == 201) {
              alert(resp.data.message);
              setClicked(0);
            } else {
              alert(resp.data.error);
            }
          });
      } else {
        alert("Please fill all the fields");
      }
    } else {
      alert("Check Password and Confirm Password");
    }
  }
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clicked, setClicked] = useState(0);
  useEffect(() => {
    if (window.sessionStorage.getItem("token")) {
      history.push("/dashboard");
    }
  }, []);
  useEffect(() => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }, [clicked]);
  if (clicked == 1) {
    return (
      <div className="auth_container">
        <div className="auth_droitecontainer">
          <img src={logo} className="auth_logosobflous" />
          <div className="auth_form">
            <input
              placeholder="Username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <br />
            <input
              placeholder="Password"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <br />
            <input
              placeholder="Confirm Password"
              type="password"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            />
          </div>
          <button className="auth_signin" onClick={signup}>
            SIGN UP
          </button>
        </div>
        <div className="auth_gauchecontainer">
          <span className="auth_bienvenue">Bienvenue</span>
          <span className="auth_text">
            Inscrivez-vous au Messagerie Instantanée de Sobflous.tn Restez en
            contact avec vos amis, clients et vendeurs.
          </span>
          <button
            className="auth_gotosignup"
            onClick={() => {
              setClicked(0);
            }}
          >
            SIGN IN
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="auth_container">
      <div className="auth_gauchecontainer">
        <span className="auth_bienvenue">Bienvenue</span>
        <span className="auth_text">
          Connectez-vous au Messagerie Instantanée de Sobflous.tn Restez en
          contact avec vos amis, clients et marchants.
        </span>
        <button
          className="auth_gotosignup"
          onClick={() => {
            setClicked(1);
          }}
        >
          SIGN UP
        </button>
      </div>
      <div className="auth_droitecontainer">
        <img src={logo} className="auth_logosobflous" />
        <div className="auth_form">
          <input
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <br />
          <input
            placeholder="Password"
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <button className="auth_signin" onClick={login}>
          SIGN IN
        </button>
      </div>
    </div>
  );
}
