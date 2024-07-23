import apiRequest from "./index.js";

export const GetQuickSearchFilterResults = async (search) => {
  try {
    const response = await apiRequest({
      method: "GET",
      endPoint: `/api/filters?search=${search}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default GetQuickSearchFilterResults;
