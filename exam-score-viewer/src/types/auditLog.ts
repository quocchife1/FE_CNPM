export interface AuditLog {
  id: string;
  username: string;
  action: string;
  method: string;
  path: string;
  ipAddress: string;
  statusCode: number;
  timestamp: string;
}