import { RootState } from '../../app/store';

export const selectAuditLogs = (state: RootState) => state.auditLog.logs;
export const selectAuditLoading = (state: RootState) => state.auditLog.loading;
export const selectAuditError = (state: RootState) => state.auditLog.error;