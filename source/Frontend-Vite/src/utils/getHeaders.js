// ✅ utils/getHeaders.js
export const getHeaders = () => {
  const token = localStorage.getItem("jwt");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};
