/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { marketAlertService } from './marketAlertService';
import { supabase } from '../../../lib/supabase';

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  }
}));

describe('marketAlertService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('markAlertAsRead', () => {
    it('should upsert the read receipt correctly', async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({ upsert: mockUpsert } as any);

      await marketAlertService.markAlertAsRead('alert-1', 'user-1');

      expect(supabase.from).toHaveBeenCalledWith('user_alert_reads');
      expect(mockUpsert).toHaveBeenCalledWith(
        { user_id: 'user-1', alert_id: 'alert-1' },
        { onConflict: 'user_id,alert_id' }
      );
    });

    it('should throw if upsert fails', async () => {
      const error = new Error('Database error');
      const mockUpsert = vi.fn().mockResolvedValue({ error });
      vi.mocked(supabase.from).mockReturnValue({ upsert: mockUpsert } as any);

      await expect(marketAlertService.markAlertAsRead('alert-1', 'user-1')).rejects.toThrow('Database error');
    });
  });

  describe('getUnreadAlertsCount', () => {
    it('should call the get_unread_alerts_count RPC correctly', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ data: 5, error: null } as any);

      const count = await marketAlertService.getUnreadAlertsCount();

      expect(supabase.rpc).toHaveBeenCalledWith('get_unread_alerts_count');
      expect(count).toBe(5);
    });

    it('should return 0 if RPC returns null', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: null } as any);

      const count = await marketAlertService.getUnreadAlertsCount();
      expect(count).toBe(0);
    });

    it('should throw if RPC fails', async () => {
      const error = new Error('RPC error');
      vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error } as any);

      await expect(marketAlertService.getUnreadAlertsCount()).rejects.toThrow('RPC error');
    });
  });
});
