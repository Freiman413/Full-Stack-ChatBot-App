import "./button.css"

function Button ({  children, type, disabled, onClick   }) {
    return (
        <button
        className="btn"
        type={type}
        disabled={disabled}
        onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button