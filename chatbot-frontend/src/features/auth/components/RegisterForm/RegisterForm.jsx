import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import InputField from "../../../../components/InputField/InputField"
import Button from "../../../../components/button/button"
import useAuth from "../../hooks/useAuth"
import "./RegisterForm.css"

const registerSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
})

function RegisterForm() {
  const {  HandleRegister, error, isLoading } = useAuth()

  return (
    <div className="register-form">
      <h2>Register</h2>
      {error && <div className="form-error">{error}</div>}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          HandleRegister(values.email, values.password)
        }}
      >
        <Form>
          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Form>
      </Formik>
      <p className="form-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default RegisterForm