// exam-score-viewer/src/api/profileApi.ts
import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = process.env.REACT_APP_API_URL!;

export const fetchProfileById = async (userId: number) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const updateProfileById = async (userId: number, formData: FormData) => {
  const response = await axios.put(`${API_URL}/user/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
