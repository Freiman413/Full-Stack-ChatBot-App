import { useContext, useState} from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../context/AuthContext"
import { registerUser, loginUser } from "../service/authService";


function useAuth() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] =useState(false)

    async function HandleRegister(email, password) {
        setError(null)
        setIsLoading(true)
        try {
            await registerUser(email, password)
            navigate("/login")
        }   catch (err) {
            const message = err.response?.data?.detail || "Registration failed"
            setError(message)
        }   finally {
            setIsLoading(false)
        }
    }

    async function HandleLogin(email, password) {
        setError(null)
        setIsLoading(true)
        try {
            const data = await loginUser(email, password)
            login(data.access_token)
            navigate("/chat")
        }   catch (err) {
            const message = err.response?.data?.detail || "Login failed"
            setError(message)
        }   finally {
            setIsLoading(false)
        }
    }
    return { HandleRegister, HandleLogin, error, isLoading }
}

export default useAuth
