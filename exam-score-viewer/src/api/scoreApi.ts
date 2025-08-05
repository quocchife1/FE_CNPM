// exam-score-viewer/src/api/scoreApi.ts
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL!;

export const fetchScoresByExamId = async (examId: string) => {
  const response = await axios.post(`${API_URL}/listresult/${examId}`);
  return response.data.data;
};
