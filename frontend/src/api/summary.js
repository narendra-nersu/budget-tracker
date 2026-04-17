import API from "./axios";

export const getTotals = async (month, year) => {
  const response = await API.get("/summary/totals", {
    params: { month, year },
  });
  return response.data;
};

export const getCategorySummary = async (month, year) => {
  const response = await API.get("/summary/category", {
    params: { month, year },
  });
  return response.data;
};

export const getMonthlySummary = async () => {
  const response = await API.get("/summary/monthly");
  return response.data;
};