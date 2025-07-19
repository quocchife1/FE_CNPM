import axios from 'axios';

export const fetchAuditLogs = async () => {
  const response = await axios.get('/api/audit-logs');
  return response.data;
};