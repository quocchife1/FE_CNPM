// profileApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export const fetchProfileById = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const updateProfileById = async (
  userId: number,
  formData: FormData
) => {
  const response = await axios.put(`${API_URL}/user/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
