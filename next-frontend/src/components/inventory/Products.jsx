"use client";

import BookCard from "../cards/BookCard";
import "../../styles/Books.css";
import Search from "../filters/Search";
import useDebounce from "../../hooks/useDebounce";
import useQueryParams from "../../hooks/useQueryParams";
import Pagination from "../filters/Pagination";
import Loading from "../states/Loading";
import Error from "../states/Error";
import { useInventory } from "@/hooks/useInventory";

const Products = () => {
  const { getParam, setParams } = useQueryParams();

  const page = Number(getParam("page", 1));
  const search = getParam("search", "");
  const sort = getParam("sort", "");
  const order = getParam("order", "");

  const booksPerPage = 12;
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useInventory({ page, search: debouncedSearch, sort, order, limit: booksPerPage })

  const books = data?.data ?? [];
  const total = data?.totalBooks ?? 0;
  const totalPages = Math.ceil(total / booksPerPage);

  const searchHandler = (e) => {
    e.preventDefault();
    setParams({ search: e.target.value, page: 1 });
  };

  if (error) return <Error error={error} />;

  return (
    <div className="books">
      <Search
        placeholder="Search books"
        value={search}
        searchHandler={searchHandler}
      />


      {!isLoading && books.length === 0 && <h2>No book found!</h2>}

      {isLoading ?
        <Loading />
        :
        <>
          <h1>Featured Books</h1>

          <div className="bookContainer">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {data && totalPages > 1 && (
            <div className="btns">
              <button
                className="btn"
                onClick={() =>
                  setParams({ page: page > 1 ? page - 1 : undefined })
                }
                disabled={page === 1}
              >
                Prev
              </button>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setParams({ page: p })}
              />

              <button
                className="btn"
                onClick={() =>
                  setParams({ page: page < totalPages ? page + 1 : undefined })
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      }

    </div>
  );
};

export default Products;
