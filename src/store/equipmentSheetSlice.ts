import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchEquipmentSheet } from '../services/equipmentSheetService.ts';
import {
  clearHttpStatusListener,
  registerHttpStatusListener,
} from '../services/httpStatusBridge.ts';
import type {
  EquipmentSheet,
  EquipmentSheetState,
  RequestStatus,
} from '../types/equipmentSheet.ts';

const initialState: EquipmentSheetState = {
  data: null,
  status: 'idle',
  error: null,
};

export const loadEquipmentSheet = createAsyncThunk<
  EquipmentSheet,
  void,
  { rejectValue: string }
>('equipmentSheet/load', async (_, { rejectWithValue }) => {
  try {
    return await fetchEquipmentSheet();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo cargar la ficha';
    return rejectWithValue(message);
  }
});

export const equipmentSheetSlice = createSlice({
  name: 'equipmentSheet',
  initialState,
  reducers: {
    resetEquipmentSheetStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
    syncHttpStatus(
      state,
      action: { payload: { status: RequestStatus; error?: string | null } },
    ) {
      state.status = action.payload.status;
      if (action.payload.status === 'error') {
        state.error = action.payload.error ?? 'Error de red';
      } else if (action.payload.status !== 'loading') {
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEquipmentSheet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadEquipmentSheet.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadEquipmentSheet.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Error desconocido';
      });
  },
});

export const { resetEquipmentSheetStatus, syncHttpStatus } =
  equipmentSheetSlice.actions;

export const bindHttpStatusToStore = (
  dispatch: (action: ReturnType<typeof syncHttpStatus>) => void,
): void => {
  registerHttpStatusListener((status, error) => {
    dispatch(syncHttpStatus({ status, error }));
  });
};

export const unbindHttpStatusFromStore = (): void => {
  clearHttpStatusListener();
};
