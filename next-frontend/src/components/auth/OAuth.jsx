import '../../styles/Login.css'

function OAuth() {

    const handleOAuth = () => {
        // window.location.href =
        //     `${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect=store`

        window.location.assign(`${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect=store`)
    }

    return (
        <button
            type="button"
            className="googleBtn"
            onClick={handleOAuth}
            aria-label="Continue with Google authentication"
        >
            <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt=""
                aria-hidden="true"
                width="18"
            />
            Continue with Google
        </button>
    )
}

export default OAuth