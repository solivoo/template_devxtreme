import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import equipmentSheetMock from '../mocks/equipmentSheet.json';
import type { EquipmentSheet } from '../types/equipmentSheet.ts';
import { notifyHttpStatus } from './httpStatusBridge.ts';

const MOCK_DELAY_MS = { min: 300, max: 800 };

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const randomDelay = async (): Promise<void> => {
  const ms =
    MOCK_DELAY_MS.min +
    Math.floor(Math.random() * (MOCK_DELAY_MS.max - MOCK_DELAY_MS.min));
  await sleep(ms);
};

const isEquipmentSheetRequest = (url?: string): boolean =>
  Boolean(url?.includes('/api/equipment-sheet'));

export const httpClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isEquipmentSheetRequest(config.url)) {
      notifyHttpStatus('loading');
      await randomDelay();
    }
    return config;
  },
  (error: AxiosError) => {
    notifyHttpStatus('error', error.message);
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (isEquipmentSheetRequest(response.config.url)) {
      notifyHttpStatus('success');
    }
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Error en la solicitud HTTP';
    if (isEquipmentSheetRequest(error.config?.url)) {
      notifyHttpStatus('error', message);
    }
    return Promise.reject(new Error(message));
  },
);

httpClient.defaults.adapter = async (config) => {
  if (config.url?.includes('/api/equipment-sheet') && config.method === 'get') {
    const response: AxiosResponse<EquipmentSheet> = {
      data: equipmentSheetMock as EquipmentSheet,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
    return response;
  }

  return axios.getAdapter('xhr')(config);
};
