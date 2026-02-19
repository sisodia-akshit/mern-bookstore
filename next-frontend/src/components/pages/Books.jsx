"use client"
import BookCard from "../components/BookCard";
import "../styles/Books.css"
import Search from "../components/Search";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import useQueryParams from "../hooks/useQueryParams";
import { getBooks } from "../services/booksApi";
import Pagination from "../components/Pagination"
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Error from "../components/Error";


const Books = () => {
  const { getParam, setParams } = useQueryParams();

  const page = Number(getParam("page", 1));
  const search = getParam("search", "");
  const sort = getParam("sort", "");
  const order = getParam("order", "");

  const booksPerPage = 12;

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["books", page, debouncedSearch, sort, order,],
    queryFn: ({ signal }) =>
      getBooks({
        page,
        limit: booksPerPage,
        search: debouncedSearch.toLowerCase(),
        sort,
        order,
        // createdBy,
        signal,
      }),
    keepPreviousData: true,
  });
  const books = data?.data ?? [];
  const total = data?.totalBooks ?? 0;
  const totalPages = Math.ceil(total / booksPerPage);

  const searchHandler = (e) => {
    e.preventDefault();
    setParams({ search: e.target.value, page: 1 })
  }

  if (error) return <Error error={error} />
  return (
    <Layout>
      <div className="books">


        <Search
          placeholder="Search books"
          value={search}
          searchHandler={searchHandler}
        />

        {isLoading && <Loading />}
        
        {(!isLoading && books.length === 0) && <h3>No book found !</h3>}
        <p>PRODUCTS</p>
        <h1>Featured Books</h1>
        <hr></hr>
        <div className="info-pro">
          <p>By bringing together generous donors, curious minds, and a simple digital platform, we’re</p>
          <p>giving stories new journeys—from shelf to hand, again and again.</p>
        </div>

        <div className="bookContainer">
          {books.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>

        <br />
        <br />
        {(data && totalPages > 1) &&
          < div className="btns">
            <button className="btn" onClick={(e) => setParams({ page: (page > 1) ? page - 1 : undefined })} disabled={page === 1} style={{
              backgroundColor: (page === 1) ? "#ccc" : "var(--primary-color)",
            }}>prev</button>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setParams({ page: p })}
            />
            <button className="btn" onClick={(e) => setParams({ page: (page < totalPages) ? page + 1 : undefined })} disabled={page === totalPages} style={{ backgroundColor: (page === totalPages) ? "#ccc" : "var(--primary-color)" }}  >Next</button>
          </div>}
      </div>
    </Layout >
  );
};

export default Books;
