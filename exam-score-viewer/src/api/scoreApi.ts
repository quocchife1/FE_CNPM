import axios from 'axios';
const API_URL = 'http://localhost:8080/api/v1';

export const fetchScoresByExamId = async (examId: string) => {
  const response = await axios.get(`${API_URL}/listresult/${examId}`);
  return response.data.data;
};
