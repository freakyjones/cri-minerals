import { create } from 'zustand';
 
import { complianceService, ComplianceStatus, CountryCompliance } from '../features/compliance/services/complianceService';
import { logger } from '../utils/logger';

export type { ComplianceStatus, CountryCompliance };

interface ComplianceState {
  countries: CountryCompliance[];
  isLoading: boolean;
  error: string | null;
  fetchCountries: () => Promise<void>;
  getStatus: (countryName: string) => ComplianceStatus;
  getTags: (countryName: string) => string[];
}

export const useComplianceStore = create<ComplianceState>((set, get) => ({
  countries: [],
  isLoading: false,
  error: null,
  
  fetchCountries: async () => {
    // If we already have data, don't re-fetch unnecessarily
    if (get().countries.length > 0) return;
    
    set({ isLoading: true, error: null });
    try {
      const data = await complianceService.fetchCountries();
      set({ countries: data, isLoading: false });
    } catch (err: unknown) {
      logger.error('Failed to fetch countries:', err);
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  getStatus: (countryName: string) => {
    const { countries } = get();
    if (!countryName) return 'NEUTRAL';
    const normalized = countryName.toLowerCase();
    // Special handling since names like "Democratic Republic of Congo" might just be "Congo" in data
    const match = countries.find(c => 
      normalized.includes(c.name.toLowerCase()) || 
      c.name.toLowerCase().includes(normalized)
    );
    return match ? match.compliance_status : 'NEUTRAL';
  },

  getTags: (countryName: string) => {
    const { countries } = get();
    if (!countryName) return [];
    const normalized = countryName.toLowerCase();
    const match = countries.find(c => 
      normalized.includes(c.name.toLowerCase()) || 
      c.name.toLowerCase().includes(normalized)
    );
    return match ? match.compliance_tags : [];
  }
}));
