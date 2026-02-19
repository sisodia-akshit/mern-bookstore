import "../../styles/layout.css"

function StarLine({ number, reviews, totalReviews }) {
    let percentage = 0;
    if (totalReviews !== 0) {
        percentage = (reviews.length / totalReviews) * 100;
    }
    return (
        <div className='starLineContainer' key={number}>
            <p> {number}</p>
            <div className="starLine">
                <div className="empty-starLine"></div>
                <div className="filled-starLine" style={{ width: `${percentage}%`, backgroundColor: "var(--primary-color)" }}></div>

            </div>
        </div>
    );
}

export default StarLine