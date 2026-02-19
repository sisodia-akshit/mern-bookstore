import "../../styles/layout.css"
function Loading() {
    return (
            <div className="page-loader">
                <div className="spinner" />
                <br />
                <p>Loading ...</p>
                <p className="muted">
                    First load may be slow because the server is on a free tier.
                </p>
            </div>
    )
}

export default Loading