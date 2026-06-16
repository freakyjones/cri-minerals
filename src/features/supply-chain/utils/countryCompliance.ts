import { useComplianceStore } from '../../../stores/useComplianceStore';
export type { ComplianceStatus } from '../../../stores/useComplianceStore';

// Note: Components should ideally use the hook directly to react to fetch updates.
export const getCountryComplianceStatus = (countryName: string) => {
  return useComplianceStore.getState().getStatus(countryName);
};

export const getCountryComplianceTags = (countryName: string) => {
  return useComplianceStore.getState().getTags(countryName);
};
