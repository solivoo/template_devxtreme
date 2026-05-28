import type { RequestStatus } from '../types/equipmentSheet.ts';

type StatusListener = (status: RequestStatus, error?: string | null) => void;

let listener: StatusListener | null = null;

export const registerHttpStatusListener = (next: StatusListener): void => {
  listener = next;
};

export const notifyHttpStatus = (
  status: RequestStatus,
  error: string | null = null,
): void => {
  listener?.(status, error);
};

export const clearHttpStatusListener = (): void => {
  listener = null;
};
