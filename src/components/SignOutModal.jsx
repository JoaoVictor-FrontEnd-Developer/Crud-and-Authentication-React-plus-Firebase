import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function SignOutModal() {
  const [state, dispatch] = useContext(AuthContext);

  return (
    <div
      className="modal fade"
      id="SignOutModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Sair
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Deseja mesmo sair da conta?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                dispatch({type: "LOGOUT"})
              }}
              data-bs-dismiss="modal"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignOutModal;
