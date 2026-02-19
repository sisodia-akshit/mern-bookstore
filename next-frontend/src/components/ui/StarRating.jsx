import "../../styles/layout.css"

function StarRating({ ratings }) {
    const percentage = (ratings / 5) * 100;

    return (
        <div className="stars">
            <div className="stars-empty">★★★★★</div>
            <div
                className="stars-filled"
                style={{ width: `${percentage}%` }}
            >
                ★★★★★
            </div>
        </div>
    );
}

export default StarRating