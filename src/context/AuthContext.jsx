import { createContext, useEffect, useReducer } from "react";

const initialState = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
}


const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                currentUser: action.payload,
            }
        case 'LOGOUT':
            return {
                currentUser: null,
            }
        default:
            return state
    }
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const value = useReducer(AuthReducer, initialState)

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}