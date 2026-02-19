import "../../styles/layout.css"
function BookLoading() {
    return (
        <div className="book-skeleton">
            <div className="skeleton cover" />
            <div className="skeleton title" />
            <div className="skeleton text" />
            <div className="skeleton button" />
        </div>
    )
}

export default BookLoading