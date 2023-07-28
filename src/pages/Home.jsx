import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";
import SignOutModal from "../components/SignOutModal";
import { auth } from "../services/firebase";

import {
  FiLogOut,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiCheckSquare,
} from "react-icons/fi";

function Home() {
  // variaveis para criar usuario
  const [tarefa, setTarefa] = useState("");
  // variaveis para atualizar usuario
  const [taskUpdateId, setTaskUpdateId] = useState("");
  const [message, setMessage] = useState(false);
  // array de usuários chamados do bd
  const [user, setUser] = useState(null);

  const [state, dispatch] = useContext(AuthContext);

  useEffect(() => {
    // const docRef = doc(db, "users", state.currentUser.uid);
    // const docSnap = getDoc(docRef).then((doc) =>
    //   setUsers({ ...doc.data(), id: doc.id })
    //   );

    //Pegando doc específco do banco, na coleção "usersr" com id baseado no Usuário
    const unsub = onSnapshot(doc(db, "users", state.currentUser), (doc) => {
      setUser({ ...doc.data(), id: doc.id });
    });
  }, []);

  const criarTarefa = async (e) => {
    e.preventDefault();
    if (tarefa.trim() === "") {
      setMessage(true);
      setTarefa("");
      const timer = setTimeout(() => {
        setMessage(false);
      }, 1000);

      return () => clearTimeout(timer);
    }

    setTarefa("");
    // adicionando novo elemento no array de tarefas do banco
    const user = await updateDoc(doc(db, "users", state.currentUser), {
      tasks: arrayUnion({ name: tarefa, done: false }),
    });
  };

  const deleteTarefa = async (task) => {
    const docUser = await updateDoc(doc(db, "users", state.currentUser), {
      tasks: user.tasks?.filter((t, index) => index !== task),
    });
    setTaskUpdateId("");
  };

  const updateTarefa = async (task, currentId) => {
    const docUser = await updateDoc(doc(db, "users", state.currentUser), {
      tasks: user.tasks?.map((t, index) => {
        if (index === currentId) {
          t.name = task;
        }
        return t;
      }),
    });
    setTaskUpdateId("");
  };

  const doneItem = async (currentId) => {
    const docUser = await updateDoc(doc(db, "users", state.currentUser), {
      tasks: user.tasks?.map((t, index) => {
        if (index === currentId) {
          t.done = !t.done;
        }
        return t;
      }),
    });
  };

  return (
    <>
      {user ? (
        <>
          <header className="bg-primary py-3">
            <div className="container py-3 d-flex justify-content-between align-items-center">
              <h4 className="text-light">Olá, {user.name}</h4>
              <button
                data-bs-toggle="modal"
                data-bs-target="#SignOutModal"
                className="d-flex align-items-center btn btn-light"
              >
                Sair
                <FiLogOut className="ms-1" />
              </button>
            </div>
          </header>

          <div className="d-flex align-items-center flex-column container">
            <form
              onSubmit={criarTarefa}
              className="form-add-task mt-5 form-floating d-flex flex-lg-row flex-column d-flex"
            >
              <input
                type="text"
                value={tarefa}
                id="floatingInput"
                className="form-control"
                placeholder="Adicionar tarefa..."
                onChange={(e) => {
                  setTarefa(e.target.value);
                }}
              />
              <label htmlFor="floatingInput" className="text-secondary">
                Adicionar Tarefa...
              </label>
              <button
                type="submit"
                className="d-flex justify-content-center align-items-center ms-lg-2 mt-lg-0 mt-2 btn btn-primary"
              >
                <FiPlusCircle className="me-1" />
                Adicionar
              </button>
            </form>
            {message && (
              <p className="w-75 py-2 text-center alert alert-danger mt-3">
                Preencha o campo corretamente
              </p>
            )}

            <div className="row w-100 mt-3 justify-content-between">
              <div className="col-lg-6 col-12">
                <h4 className="mt-3">Últimas Tarefas</h4>
                <div className="tasks-container">
                  {user.tasks.filter((t) => t.done === false).length > 0 ? (
                    /* array n estava sendo lido, pois apenas se ele não esiver em branco o "map" funciona */
                    user.tasks?.map((task, index) => {
                      // verifica o estado da tarefa para exibir somente as não concluídas ou concluídas
                      if (!task.done) {
                        return (
                          <div key={index}>
                            <div className="py-3 mb-3 d-flex flex-lg-row flex-column align-items-center justify-content-between border-bottom">
                              <div className="d-flex w-100 justify-content-start align-items-center">
                                <button
                                  onClick={() => doneItem(index)}
                                  className={`d-flex justify-content-center align-items-center p-1 me-2 btn ${
                                    task.done ? "btn-success" : ""
                                  }`}
                                >
                                  <FiCheckSquare />
                                </button>
                                <p
                                  className={`m-0 pe-lg-5 ${
                                    task.done
                                      ? "text-decoration-line-through"
                                      : ""
                                  }`}
                                >
                                  {task.name}
                                </p>
                              </div>
                              <div className="buttons-edit d-flex mt-lg-0 mt-3 ">
                                <button
                                  onClick={() => setTaskUpdateId(index)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                  className="d-flex justify-content-center align-items-center btn btn-danger"
                                >
                                  <FiTrash2 className="fs-5" />
                                </button>
                                <button
                                  onClick={() => setTaskUpdateId(index)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  className="d-flex justify-content-center align-items-center ms-2 btn btn-warning"
                                >
                                  <FiEdit className="fs-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <p>(Nenhuma tarefa adicionada)</p>
                  )}
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <h4 className=" mt-3">Tarefas Concluídas</h4>
                <div className="tasks-container">
                  {user.tasks.filter((t) => t.done === true).length > 0 ? (
                    user.tasks?.map((task, index) => {
                      if (task.done === true) {
                        return (
                          <div key={index}>
                            <div className="py-3 mb-3 d-flex flex-lg-row flex-column align-items-center justify-content-between border-bottom">
                              <div className="d-flex w-100 justify-content-start align-items-center">
                                <button
                                  onClick={() => doneItem(index)}
                                  className={`d-flex justify-content-center align-items-center p-1 me-2 btn ${
                                    task.done ? "btn-success" : ""
                                  }`}
                                >
                                  <FiCheckSquare />
                                </button>
                                <p
                                  className={`m-0 pe-lg-5 ${
                                    task.done
                                      ? "text-decoration-line-through"
                                      : ""
                                  }`}
                                >
                                  {task.name}
                                </p>
                              </div>
                              <div className="buttons-edit d-flex mt-lg-0 mt-3 ">
                                <button
                                  onClick={() => setTaskUpdateId(index)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                  className="d-flex justify-content-center align-items-center btn btn-danger"
                                >
                                  <FiTrash2 className="fs-5" />
                                </button>
                                <button
                                  onClick={() => setTaskUpdateId(index)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  className="d-flex justify-content-center align-items-center ms-2 btn btn-warning"
                                >
                                  <FiEdit className="fs-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <p>(Nenhuma tarefa concluída)</p>
                  )}
                </div>
              </div>
            </div>
            <DeleteModal
              handleDelete={deleteTarefa}
              deleteTask={taskUpdateId}
            />

            <EditModal
              user={user}
              currentId={taskUpdateId}
              handleUpdate={updateTarefa}
            />
          </div>
        </>
      ) : (
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <SignOutModal />
    </>
  );
}

export default Home;
