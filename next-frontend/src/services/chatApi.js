import API from "./api";

export const sendGlobalMessage = async ({message}) => {
  const res = await API.post("/chat/global", { message });
  return res.data;
};

export const getGlobalMessage = async ({ signal }) => {
  const res = await API.get("/chat/global", { signal });
  return res.data;
};
