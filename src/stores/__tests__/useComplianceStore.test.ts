/* eslint-disable no-restricted-imports */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useComplianceStore } from '../useComplianceStore';
import { complianceService } from '../../features/compliance/services/complianceService';

// Mock the service layer
vi.mock('../../features/compliance/services/complianceService', () => ({
  complianceService: {
    fetchCountries: vi.fn()
  }
}));

describe('useComplianceStore', () => {
  beforeEach(() => {
    useComplianceStore.setState({ countries: [], isLoading: false, error: null });
    vi.clearAllMocks();
  });

  it('should fetch countries and update state', async () => {
    const mockData = [
      { id: '1', name: 'China', iso_code: 'CN', compliance_status: 'FEOC', compliance_tags: ['Sanctioned Entity'] }
    ];
    
    // Setup the mock
    (complianceService.fetchCountries as unknown as Mock).mockResolvedValue(mockData);

    await useComplianceStore.getState().fetchCountries();

    const state = useComplianceStore.getState();
    expect(state.countries).toEqual(mockData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Database connection failed');
    (complianceService.fetchCountries as unknown as Mock).mockRejectedValue(mockError);

    await useComplianceStore.getState().fetchCountries();

    const state = useComplianceStore.getState();
    expect(state.countries).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Database connection failed');
  });

  it('should correctly return status for a given country', async () => {
    useComplianceStore.setState({
      countries: [
        { id: '1', name: 'Russia', iso_code: 'RU', compliance_status: 'FEOC', compliance_tags: [] },
        { id: '2', name: 'Canada', iso_code: 'CA', compliance_status: 'FTA', compliance_tags: [] }
      ]
    });

    const getStatus = useComplianceStore.getState().getStatus;
    
    expect(getStatus('Russia')).toBe('FEOC');
    expect(getStatus('russia')).toBe('FEOC'); // case insensitive
    expect(getStatus('Canada')).toBe('FTA');
    expect(getStatus('Unknown')).toBe('NEUTRAL'); // fallback
  });

  it('should not re-fetch if countries are already loaded', async () => {
    useComplianceStore.setState({
      countries: [
        { id: '1', name: 'Russia', iso_code: 'RU', compliance_status: 'FEOC', compliance_tags: [] }
      ]
    });

    (complianceService.fetchCountries as unknown as Mock).mockClear();

    await useComplianceStore.getState().fetchCountries();
    
    // Ensure fetchCountries was not called since cache is already populated
    expect(complianceService.fetchCountries).not.toHaveBeenCalled();
  });
});
