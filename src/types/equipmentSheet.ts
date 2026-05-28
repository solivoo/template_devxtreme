export interface MaintenanceSummary {
  date: string;
  mileage: string;
}

export interface NextMaintenanceSummary {
  estimatedDate: string;
  limitKm: string;
}

export interface GeneralDataField {
  label: string;
  value: string;
}

export interface EquipmentGeneralData {
  overview: GeneralDataField[];
  detailsLeft: GeneralDataField[];
  detailsRight: GeneralDataField[];
  others: string;
  detailedLocation: string;
  description: string;
}

export interface TechnicalParameter {
  id: string;
  characteristic: string;
  value: string;
  unit: string;
}

export interface SheetAction {
  id: string;
  label: string;
  icon: string;
}

export interface RecentEvent {
  id: string;
  title: string;
  date: string;
  variant: 'success' | 'info' | 'neutral';
}

export interface EquipmentSheet {
  id: string;
  title: string;
  statusLabel: string;
  assetCode: string;
  alertMessage: string;
  lastMaintenance: MaintenanceSummary;
  nextMaintenance: NextMaintenanceSummary;
  generalData: EquipmentGeneralData;
  imageUrl: string;
  imageCaption: string;
  technicalParameters: TechnicalParameter[];
  actions: SheetAction[];
  recentEvents: RecentEvent[];
  footerText: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface EquipmentSheetState {
  data: EquipmentSheet | null;
  status: RequestStatus;
  error: string | null;
}
