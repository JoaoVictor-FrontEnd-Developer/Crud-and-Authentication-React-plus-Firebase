import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import ModalInfo from "../components/ModalInfo";
import {MdTaskAlt} from 'react-icons/md'

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [manyTries, setManyTries] = useState(false);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  const refInput = useRef(null);

  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useContext(AuthContext);

  const handleSubmit = (e) => {
    if (password.trim() === "" && email.trim() === "") {
      document.querySelector("#email-input").classList.add("is-invalid");
      document.querySelector("#password-input").classList.add("is-invalid");
    }

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        if (!auth.currentUser.emailVerified) {
          setMessage("Verificação de email necessária para prosseguir!");
          setLoading(false);
          const timer = setTimeout(() => {
            setMessage("");
          }, 3000);

          return () => clearTimeout(timer);
        }
        const user = userCredential.user.uid;
        dispatch({ type: "LOGIN", payload: user });
        navigate("/");
        // ...
      })
      .catch((error) => {
       
        switch (error.code) {
          case "auth/wrong-password":
            document
              .querySelector("#password-input")
              .classList.add("is-invalid");
            setMessage("Senha Incorreta");
            break;
          case "auth/missing-password":
            document
              .querySelector("#password-input")
              .classList.add("is-invalid");
            break;
          case "auth/user-not-found":
            document.querySelector("#email-input").classList.add("is-invalid");
            setMessage("Usuário não encontrado");
            break;
          case "auth/invalid-email":
            document.querySelector("#email-input").classList.add("is-invalid");
            setMessage("Email inválido");
            break;
          default:
            setMessage("Muitas tentativas, tente novamente mais tarde");
            setManyTries(true);
            setMessage("");
            break;
        }
        setLoading(false);
        const timer = setTimeout(() => {
          setMessage("");
        }, 2000);

        return () => clearTimeout(timer);
      });
  };

  const showPassword = () => {
    if (refInput.current.type === "password") {
      setVisible(true);
      refInput.current.type = "text";
    } else {
      setVisible(false);
      refInput.current.type = "password";
    }
  };

  return (
    <div className="row g-0 d-flex justify-content-beteween vw-100">
      <div className="d-xl-flex d-none col flex-column justify-content-center align-items-center">
        <MdTaskAlt className="logo text-primary"/>
        <h1 className="text-center w-50">Bem vindo a sua Lista de Tarefas</h1>
      </div>
      <div className="col-xl-6 col-12 d-flex vh-100 flex-column justify-content-center align-items-center bg-primary">
        <h2 className="text-white">Login:</h2>
        {!manyTries ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="d-flex flex-column w-75 bg-body p-5 rounded-3"
            >
              <label className="mt-2 form-label">Email:</label>
              <input
                id="email-input"
                className="p-2 form-control"
                type="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => {
                  e.target.classList.remove("is-invalid");
                  setEmail(e.target.value);
                }}
              />
              {message === "Usuário não encontrado" && (
                <div className="fs-6 text-danger d-flex align-items-center">
                  <FiInfo className="me-1" />
                  {message}
                </div>
              )}
              {message === "Email inválido" && (
                <div className="fs-6 text-danger d-flex align-items-center">
                  <FiInfo className="me-1" />
                  {message}
                </div>
              )}
              <label className="mt-2 form-label">Senha:</label>
              <div className="input-group">
                <input
                  ref={refInput}
                  id="password-input"
                  className="p-2 form-control "
                  type="password"
                  placeholder="*******"
                  value={password}
                  onChange={(e) => {
                    e.target.classList.remove("is-invalid");
                    setPassword(e.target.value);
                  }}
                />
                <button
                  onClick={showPassword}
                  className="btn border border-start-0"
                  type="button"
                  id="button-addon2"
                >
                  {visible ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {message === "Senha Incorreta" && (
                <div className="fs-6 text-danger d-flex align-items-center">
                  <FiInfo className="me-1" />
                  {message}
                </div>
              )}

              <div className="d-flex justify-content-end">
                <Link to="/forgotPassword" className="py-2 px-0 btn btn-link">
                  Esqueceu sua senha?
                </Link>
              </div>

              {loading ? (
                <div className="pt-3 d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-2 btn btn-primary"
                  >
                    Entrar
                  </button>
                  <Link to="/register" className="mt-2 btn">
                    Cadastrar
                  </Link>
                </>
              )}

              {message ===
                "Verificação de email necessária para prosseguir!" && (
                <p className="text-center text-danger">{message}</p>
              )}
            </form>
          </>
        ) : (
          <ModalInfo
            title="Ocorreu um erro:"
            text={
              <>
                <p className="m-0">
                  <span className="fw-bold">
                    Muitas tentativas de login, tente novamente mais tarde!
                  </span>
                </p>
              </>
            }
          />
        )}
      </div>
    </div>
  );
}

export default Login;
