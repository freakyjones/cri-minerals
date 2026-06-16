import { supabase } from '../../../lib/supabase';

export type ComplianceStatus = 'FEOC' | 'FTA' | 'NEUTRAL';

export interface CountryCompliance {
  id: string;
  name: string;
  iso_code: string;
  compliance_status: ComplianceStatus;
  compliance_tags: string[];
}

export const complianceService = {
  fetchCountries: async (): Promise<CountryCompliance[]> => {
    const { data, error } = await supabase
      .from('countries')
      .select('*');
      
    if (error) throw error;
    return data as CountryCompliance[];
  }
};
