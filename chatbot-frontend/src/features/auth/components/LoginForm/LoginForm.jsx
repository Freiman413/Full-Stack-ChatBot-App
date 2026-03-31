import { Formik , Form } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import InputField from "../../../../components/InputField/InputField.jsx"
import Button from "../../../../components/button/button";
import useAuth from "../../hooks/useAuth.js"
import "./LoginForm.css"

const loginSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
})

function LoginForm() {
    const { HandleLogin, error, isLoading } = useAuth()
    return (
        <div className="login-form">
            <h2>Login</h2>
            {error && <div className="form-error">{error}</div>}
            <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
                HandleLogin(values.email, values.password)
            }}
        >
            <Form>
                <InputField
                    label="email"
                    id="email"
                    name="email"
                    type="email"
                />
                <InputField
                    label="password"
                    id="password"
                    name="password"
                    type="password"
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </Form>
        </Formik>
        <p className="form-link">
        Don't have an account? <Link to="/register">Register</Link>
        </p>
    </div>
    )
}

export default LoginForm