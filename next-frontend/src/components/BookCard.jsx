import "../styles/BookCard.css"
import { NavLink } from 'react-router-dom';

function BookCard({book}) {

  return (
    <NavLink to={`/books/${book._id}`} className='bookCard' >
      <span className="Availability" style={{ backgroundColor: book.stock > 0 ? "var(--success-color)" : "var(--error-color)" }}>{book.stock > 0 ? "Available" : "N/A"}</span>
      <img src={book.coverImage} alt={book.title} width="120" />
      <h6 style={{ color: "#555", fontWeight: "400" }}>{book.author}</h6>
      <h3>{book.title}</h3>
      <h5 style={{ color: "var(--secondary-color)" }}>₹{book.price}</h5>
      <div className='genres' >
        {book.genres.map((curr, i) => {
          return <p key={i}>{curr}</p>
        })}
      </div>
    </NavLink>
  )
}

export default BookCard