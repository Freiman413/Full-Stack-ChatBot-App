import { createContext, useState, useEffect } from "react";

const AuthContext = createContext(null)

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedToken = localStorage.getItem("token")
        if (savedToken) {
            setToken(savedToken)
        }
        setIsLoading(false)
    },[])

    function login(newToken) {
        localStorage.setItem("token", newToken)
        setToken(newToken)
    }

    function logout() {
        localStorage.removeItem("token")
        setToken(null)
    }

    const isAuthenticated = token !== null

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }

