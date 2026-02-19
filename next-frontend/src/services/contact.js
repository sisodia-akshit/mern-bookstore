import API from "./api";

export const contactMe = async ({ name, message }) => {
  try {
    const res = await API.post("/contact", { name, message });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send Message");
  }
};
