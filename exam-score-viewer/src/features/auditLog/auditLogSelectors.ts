// src/features/auditLog/auditLogSelectors.ts

import { RootState } from '../../app/store';

export const selectAuditLogs = (state: RootState) => state.auditLog.logs;
export const selectAllAuditLogs = (state: RootState) => state.auditLog.allLogs; // <-- Selector mới
export const selectAuditLoading = (state: RootState) => state.auditLog.loading;
export const selectAuditError = (state: RootState) => state.auditLog.error;