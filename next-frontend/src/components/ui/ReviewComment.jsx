import StarRating from '../ui/StarRating'

function ReviewComment({ review }) {
    return (
        <div className='reviewComment'>
            <StarRating ratings={review.ratings} /><br />
            <span>{review.title}</span>
            <div className="rComment">
                <p>{review.comment}</p>
            </div>
            <div className='rUser'>{review.user.email}</div>
        </div>
    )
}

export default ReviewComment