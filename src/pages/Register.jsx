import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { db, auth } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { FiEye, FiEyeOff, FiInfo } from "react-icons/fi";

import ModalInfo from "../components/ModalInfo";
import bg from "../images/Checklist-rafiki.png";

function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const refInput = useRef(null);

  const handleSubmit = (e) => {
    if (password.trim() === "" && email.trim() === "" && name.trim() === "") {
      document.querySelector("#email-input").classList.add("is-invalid");
      document.querySelector("#password-input").classList.add("is-invalid");
      document.querySelector("#name-input").classList.add("is-invalid");
    } else if (name.trim() === "") {
      document.querySelector("#name-input").classList.add("is-invalid");
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        sendEmailVerification(auth.currentUser)
          .then(async () => {
            const docTeste = await setDoc(doc(db, "users", user.uid), {
              name: name,
              email,
              tasks: [],
            });
            setVisible(true);
            const timer = setTimeout(() => {
              setVisible(false);
              navigate("/login");
            }, 3000);

            return () => clearTimeout(timer);
          })
          .catch((error) => {
            console.log("email não encontrado");
          });
      })
      .catch((error) => {
    
        switch (error.code) {
          case "auth/weak-password":
            document
              .querySelector("#password-input")
              .classList.add("is-invalid");
            setMessage("Senha deve conter pelo menos 6 caracteres");
            break;
          case "auth/missing-password":
            document
              .querySelector("#password-input")
              .classList.add("is-invalid");
            break;
          case "auth/email-already-in-use":
            document.querySelector("#email-input").classList.add("is-invalid");
            setMessage("Email já está sendo utilizado");
            break;
          case "auth/missing-email":
            document.querySelector("#email-input").classList.add("is-invalid");
            break;
          case "auth/invalid-email":
            document.querySelector("#email-input").classList.add("is-invalid");
            setMessage("Email inválido");
            break;
          default:
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
      setVisiblePassword(true);
      refInput.current.type = "text";
    } else {
      setVisiblePassword(false);
      refInput.current.type = "password";
    }
  };

  return (
    <div className="row g-0 d-flex justify-content-beteween vw-100">
      <div className="col d-flex flex-column justify-content-center align-items-center">
        <img src={bg} className="bg-illustration" alt="teste" />
      </div>
      <div className="col-xl-6 col-12 d-flex vh-100 flex-column justify-content-center align-items-center bg-primary">
        <h2 className="text-white">{!visible ? 'Cadastro' : 'Usuário Cadastrado!'}</h2>

        {!visible ? (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="d-flex flex-column w-75 bg-body p-5 rounded-3"
          >
            <label className="mt-2 form-label">Nome:</label>
            <input
              id="name-input"
              className="p-2 form-control"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => {
                e.target.classList.remove("is-invalid");
                setName(e.target.value);
              }}
            />

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
            {message === "Email já está sendo utilizado" ||
            message === "Email inválido" ? (
              <div className="fs-6 text-danger d-flex align-items-center">
                <FiInfo className="me-1" />
                {message}
              </div>
            ) : (
              <div
                id="emailHelp"
                className="mb-2 d-flex align-items-center form-text fw-bold"
              >
                <FiInfo className="me-1" />
                Utilize um email válido para verificação da conta!
              </div>
            )}

            <label className="form-label">Senha:</label>
            <div className="input-group">
              <input
                ref={refInput}
                id="password-input"
                className="p-2 form-control"
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
                {visiblePassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            {message === "Senha deve conter pelo menos 6 caracteres" && (
              <div className="fs-6 text-danger d-flex align-items-center">
                <FiInfo className="me-1" />
                {message}
              </div>
            )}

            {loading ? (
              <div className="pt-3 d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="mt-2 btn btn-primary"
                >
                  Cadastrar
                </button>
                <Link to="/login" className="mt-2 btn">
                  Entrar
                </Link>
              </>
            )}
          </form>
        ) : (
          <ModalInfo
            title=""
            text={
              <>
                <p className="m-0">
                  Email de verificação enviado para
                  <br/><span className="fw-bold">{email}</span>
                </p>
              </>
            }
          />
        )}
      </div>
    </div>
  );
}

export default Register;
