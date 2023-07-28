import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassWord from "../pages/ForgotPassWord";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";


function AppRoutes() {

    const [state] = useContext(AuthContext);
    
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.currentUser))
        
    }, [state])

    // Proteção de rotas
    // caso o usuário ainda n esteja logado ele tem acesso somente a página de Login e Cadastro
    const RequireAuth = ({ children }) => {
        return state.currentUser ? children : <Navigate to="/login"/>
    }

    // caso o usuário ainda esteja logado ele tem acesso somente a página Home
    const NoRequireAuth = ({ children }) => {
        return !state.currentUser ? children : <Navigate to="/"/>
    }

    // console.log(state.currentUser)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RequireAuth><Home /></RequireAuth>}  />
                <Route path="/login" element={<NoRequireAuth><Login /></NoRequireAuth>}  />
                <Route path="/register" element={<NoRequireAuth><Register /></NoRequireAuth>}  />
                <Route path="/forgotPassword" element={<NoRequireAuth><ForgotPassWord /></NoRequireAuth>}  />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes;
  