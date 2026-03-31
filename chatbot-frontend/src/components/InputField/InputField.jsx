import "./InputField.css";
import { useField } from "formik";


function InputField({ label, ...props }) {
    const [field, meta] = useField(props)

    return (
        <div className="field-group">
            <label htmlFor={props.id}>{label}</label>
            <input
                className={meta.touched && meta.error ? "input-error" : ""}
                {...field}
                {...props}
            />
            {meta.touched && meta.error && (
                <span className="error">{meta.error}</span>
            )}
        </div>
    )
}
export default InputField