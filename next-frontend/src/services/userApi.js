import API from "./api";

export const addAddress = async (address) => {
    const res = await API.post("/users/address", address);
    return res.data;
};
export const setDefaultAddress = async (address) => {
    const res = await API.post(`/users/address/${address}`);
    return res.data;
};