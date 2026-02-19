import API from "./api";

export const loginUser = async ({ email, password }) => {
    const res = await API.post("auth/login", { email, password });
    return res.data;
};

export const createUser = async (user) => {
  try {
    const res = await API.post("auth/register", user);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to signin");
  }
};

export const getUser = async () => {
  const res = await API.get("users/me");
  return res.data;
};

export const logoutUser = async () => {
  try {
    const res = await API.post("auth/logout");

    return res;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
};

export const generateOtp = async (data) => {
    const res = await API.post("auth/generate-otp", data);
    return res.data;
};

export const verifyOtp = async (user) => {
  try {
    const res = await API.post("auth/verify-otp", user);

    return res;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Something went wrong. Please try again later...",
    );
  }
};
