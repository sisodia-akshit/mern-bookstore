const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          style={{
            margin: "0 5px 8px 0",
            fontWeight: page === i + 1 ? "bold" : "normal",
            backgroundColor: page === i + 1 ? "var(--primary-color)" : "#ffffff",
            color: page === i + 1 ? "#fff" : "#000",
            border: "none",
            padding:"5px 10px",
            cursor:"pointer",
            borderRadius:2,
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
