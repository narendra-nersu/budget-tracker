import API from "./axios";

export const getTransactions = async (filters = {}) => {
  const response = await API.get("/transactions/", { params: filters });
  return response.data;
};

export const addTransaction = async (data) => {
  const response = await API.post("/transactions/", data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await API.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}`);
  return response.data;
};