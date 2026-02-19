import { useQuery } from "@tanstack/react-query";
import { getBookById, getBooks, getBooksByCategory } from "../services/booksApi";

export const useInventory = ({ page, limit, search, sort, order }) => {
  return useQuery({
    queryKey: ["books", page, search, sort, order],
    queryFn: ({ signal }) =>
      getBooks({
        page,
        limit,
        search,
        sort,
        order,
        signal,
      }),
    keepPreviousData: true,
  });
};

export const useProduct = ({ id }) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: ({ signal }) => getBookById({ id, signal }),
  });
};
export const useProductCategory = ({ category }) => {
  return useQuery({
    queryKey: ["books", category],
    queryFn: ({ signal }) => getBooksByCategory({ category, signal }),
    enabled: !!category,
  });
};
