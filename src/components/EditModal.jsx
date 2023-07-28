import React, { useState, useEffect } from "react";

function EditModal({ user, currentId, handleUpdate }) {
    
  const [name, setName] = useState("");
  const [newTask, setNewTask] = useState({})
  
  useEffect(() => {
    {/* Para que as funções do componente não executem antes que currentId seja algum ID */}
    if(currentId === "") return
    const taskFilter = user.tasks.filter((t, index) => index === currentId)[0]
    setNewTask(taskFilter)
    setName(taskFilter.name)
  }, [currentId]);
    

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="editModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tarefa</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
           
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdate(name, currentId)
            }} className="d-flex flex-column ">
              <input
                className="p-2 form-control"
                type="text"
                placeholder="Nova tarefa"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="mt-4 btn btn-warning"
                data-bs-dismiss="modal"
              >
                Atualizar
              </button>
              </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
