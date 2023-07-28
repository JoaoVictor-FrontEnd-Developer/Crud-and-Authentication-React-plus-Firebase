import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import ModalInfo from "../components/ModalInfo";
import { FiInfo } from "react-icons/fi";
import bg from "../images/Forgot password-rafiki.png";

function ForgotPassWord() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    setLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setVisible(true);
        const timer = setTimeout(() => {
          navigate("/login");
        }, 3000);

        return () => clearTimeout(timer);
      })
      .catch((error) => {
        setLoading(false);
        
        switch (error.code) {
          case "auth/missing-email":
            document.querySelector("#email-input").classList.add("is-invalid");
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
            break;
        }
        const timer = setTimeout(() => {
          setMessage("");
        }, 2000);

        return () => clearTimeout(timer);
      });
  };

  return (
    <div className="row g-0 d-flex justify-content-beteween vw-100">
      <div className="col d-flex flex-column justify-content-center align-items-center">
        <img src={bg} className="bg-illustration" alt="teste" />
      </div>
      <div className="col-xl-6 col-12 d-flex vh-100 flex-column justify-content-center align-items-center bg-primary">
        <h2 className="text-white">Redefinir Senha:</h2>
        {!visible ? (
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
              placeholder="Digite o email da conta"
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
                  Enviar email
                </button>
                <Link to="/login" className="mt-2 btn">
                  Cancelar
                </Link>
              </>
            )}
          </form>
        ) : (
          <ModalInfo
            title=""
            text={
              <p className="m-0">
                Email enviado para:
                <br /><span className="fw-bold">{email}</span>
              </p>
            }
          />
        )}
      </div>
    </div>
  );
}

export default ForgotPassWord;
