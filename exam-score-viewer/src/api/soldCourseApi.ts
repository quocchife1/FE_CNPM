// src/api/soldCourseApi.ts
import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL = process.env.REACT_APP_API_URL!;

export const fetchSoldCourses = async () => {
  const response = await axios.get(`${API_URL}/soldcourse`);
  return response.data.data;
};
