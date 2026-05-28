import type { EquipmentSheet } from '../types/equipmentSheet.ts';
import { httpClient } from './httpClient.ts';

export const fetchEquipmentSheet = async (): Promise<EquipmentSheet> => {
  const { data } = await httpClient.get<EquipmentSheet>('/api/equipment-sheet');
  return data;
};
