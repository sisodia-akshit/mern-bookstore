
function AuthForm({ children, handleSubmit, isPending, error, authButton }) {
    return (
        <form onSubmit={handleSubmit} noValidate>
            {children}
            {error && (
                <p style={{ color: "red", margin: "0px auto" }}>
                    {error?.response?.data?.message || "Something went wrong"}
                </p>
            )}
            <button type="submit" disabled={isPending}>
                {authButton}
            </button>
        </form>
    )
}

export default AuthForm