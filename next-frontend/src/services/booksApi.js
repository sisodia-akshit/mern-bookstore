import API from "./api";

export const getBooks = async ({
  page,
  limit,
  search,
  sort,
  order,
  signal,
  createdBy,
}) => {
  const params = new URLSearchParams({
    page: page,
    limit: limit,
    ...(search && { search: search }),
    ...(sort && { sort: sort }),
    ...(order && { order: order }),
    ...(createdBy && { createdBy }),
  });
  const res = await API.get(`books`, { params, signal });
  return res.data;
};

export const getBookById = async ({ _id, signal }) => {
  const res = await API.get(`books/book/${_id}`, { signal });
  return res.data;
};
export const sendReview = async ({ id, rating, title, comment, signal }) => {
  const res = await API.post(`books/book/${id}/review`, {
    rating,
    title,
    comment,
    signal,
  });
  return res.data;
};
export const getBooksByCategory = async ({ category, signal }) => {
  const res = await API.get(`books/book-by-category/${category}`, { signal });
  return res.data;
};
