import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { loadEquipmentSheet } from '../../../store/equipmentSheetSlice.ts';

export const useEquipmentSheet = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.equipmentSheet);

  const reload = useCallback(() => {
    void dispatch(loadEquipmentSheet());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      reload();
    }
  }, [status, reload]);

  return {
    data,
    status,
    error,
    reload,
    isLoading: status === 'loading',
    isError: status === 'error',
  };
};
