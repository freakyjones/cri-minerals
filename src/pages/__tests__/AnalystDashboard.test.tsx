import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import AnalystDashboard from '../AnalystDashboard';
import { useTriggerAlerts } from '../../features/minerals/hooks/useMarketAlerts';
import { useAlertQueue } from '../../features/minerals/hooks/useAlertQueue';
import { useQueryClient } from '@tanstack/react-query';

// Mock the child component
vi.mock('../../features/minerals/components/AnalystQueue', () => ({
  default: () => <div data-testid="analyst-queue">Mock AnalystQueue</div>
}));

// Mock hooks
vi.mock('../../features/minerals/hooks/useMarketAlerts', () => ({
  useTriggerAlerts: vi.fn()
}));
vi.mock('../../features/minerals/hooks/useAlertQueue', () => ({
  useAlertQueue: vi.fn()
}));
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn()
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  RefreshCw: () => <svg data-testid="RefreshCw" />,
  CheckCircle2: () => <svg data-testid="CheckCircle2" />,
  AlertCircle: () => <svg data-testid="AlertCircle" />,
  Clock: () => <svg data-testid="Clock" />,
  Info: () => <svg data-testid="Info" />
}));

describe('AnalystDashboard State Machine', () => {
  let mockMutateAsync: any;
  let mockInvalidateQueries: any;
  let mockGetQueryData: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMutateAsync = vi.fn().mockResolvedValue({ run_id: 'mock-run-123' });
    (useTriggerAlerts as any).mockReturnValue({
      isPending: false,
      mutateAsync: mockMutateAsync
    });

    (useAlertQueue as any).mockReturnValue({
      status: null
    });

    mockInvalidateQueries = vi.fn().mockResolvedValue(true);
    mockGetQueryData = vi.fn().mockReturnValue([{}, {}]); // 2 draft items

    (useQueryClient as any).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      getQueryData: mockGetQueryData
    });
  });

  it('transitions button states correctly through the job lifecycle', async () => {
    const { rerender } = render(<AnalystDashboard />);
    
    // Initial State
    expect(screen.getByText('Fetch Latest News')).toBeInTheDocument();

    // 1. Starting Job (triggerAlerts.isPending is true)
    (useTriggerAlerts as any).mockReturnValue({ isPending: true, mutateAsync: mockMutateAsync });
    rerender(<AnalystDashboard />);
    expect(screen.getByText('Starting Job...')).toBeInTheDocument();

    // 2. Waiting in Queue (mutation finished, run_id set, status is PENDING)
    (useTriggerAlerts as any).mockReturnValue({ isPending: false, mutateAsync: mockMutateAsync });
    // Simulate setting activeRunId and queueStatus updating
    (useAlertQueue as any).mockImplementation((runId: string | null) => {
      if (runId === 'mock-run-123') return { status: 'PENDING' };
      return { status: null };
    });
    
    // We must trigger the handleTrigger manually to set the state, 
    // but since we can't easily set activeRunId directly without clicking, let's click it.
    // Reset mocks for a fresh run
    (useAlertQueue as any).mockReturnValue({ status: null });
    rerender(<AnalystDashboard />);
    
    await act(async () => {
      screen.getByText('Fetch Latest News').click();
    });
    
    // Now it should have activeRunId set.
    (useAlertQueue as any).mockReturnValue({ status: 'PENDING' });
    rerender(<AnalystDashboard />);
    expect(screen.getByText('Waiting in Queue...')).toBeInTheDocument();

    // 3. Generating AI Alerts (status is IN_PROGRESS)
    (useAlertQueue as any).mockReturnValue({ status: 'IN_PROGRESS' });
    rerender(<AnalystDashboard />);
    expect(screen.getByText('Generating AI Alerts...')).toBeInTheDocument();

    // 4. Finished (status is COMPLETED)
    (useAlertQueue as any).mockReturnValue({ status: 'COMPLETED' });
    rerender(<AnalystDashboard />);
    
    // It should unlock the button and reset text
    await waitFor(() => {
      expect(screen.getByText('Fetch Latest News')).toBeInTheDocument();
    });
  });

  it('shows toast for successfully generated alerts when draft count increases', async () => {
    const { rerender } = render(<AnalystDashboard />);
    
    // Click button
    await act(async () => {
      screen.getByText('Fetch Latest News').click();
    });

    // Simulate completion
    (useAlertQueue as any).mockImplementation((runId: string | null) => {
      if (runId === 'mock-run-123') return { status: 'COMPLETED' };
      return { status: null };
    });
    
    // Change draft count to simulate 3 new alerts being fetched
    mockGetQueryData.mockReturnValue([{}, {}, {}, {}, {}]); // 5 items

    rerender(<AnalystDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Successfully generated 3 new alerts!')).toBeInTheDocument();
    });
  });
});
