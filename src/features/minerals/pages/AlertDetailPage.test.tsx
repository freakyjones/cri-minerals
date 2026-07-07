 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlertDetailPage from './AlertDetailPage';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock('../hooks/useMarketAlerts', () => ({
  useMarketAlert: vi.fn(),
  useMarkAlertAsRead: vi.fn(),
}));

vi.mock('../../../stores/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

import { useParams, useNavigate } from 'react-router-dom';
import { useMarketAlert, useMarkAlertAsRead } from '../hooks/useMarketAlerts';
import { useAuthStore } from '../../../stores/useAuthStore';

describe('AlertDetailPage', () => {
  const mockMarkAsRead = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({ id: '123' });
    vi.mocked(useAuthStore).mockReturnValue({ user: { id: 'user-1' } } as unknown as ReturnType<typeof useAuthStore>);
    vi.mocked(useMarkAlertAsRead).mockReturnValue({ mutate: mockMarkAsRead } as unknown as ReturnType<typeof useMarkAlertAsRead>);
  });

  it('should render a loading state when data is loading', () => {
    vi.mocked(useMarketAlert).mockReturnValue({ data: null, isLoading: true, error: null } as unknown as ReturnType<typeof useMarketAlert>);
    
    const { container } = render(
      <BrowserRouter>
        <AlertDetailPage />
      </BrowserRouter>
    );

    // Ensure pulse animation is present
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('should render an error state when alert is not found', () => {
    vi.mocked(useMarketAlert).mockReturnValue({ data: null, isLoading: false, error: new Error('Not found') } as unknown as ReturnType<typeof useMarketAlert>);
    
    render(
      <BrowserRouter>
        <AlertDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Alert Not Found')).toBeDefined();
    expect(screen.getByText("The alert you're looking for doesn't exist or you don't have permission to view it.")).toBeDefined();
  });

  it('should render alert details and mark as read if not read yet', () => {
    const mockAlert = {
      id: '123',
      title: 'Lithium Supply Shortage',
      description: 'Test description',
      severity: 'HIGH',
      created_at: new Date().toISOString(),
      user_alert_reads: [], // Not read
    };

    vi.mocked(useMarketAlert).mockReturnValue({ data: mockAlert, isLoading: false, error: null } as unknown as ReturnType<typeof useMarketAlert>);
    
    render(
      <BrowserRouter>
        <AlertDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Lithium Supply Shortage')).toBeDefined();
    expect(screen.getByText('Test description')).toBeDefined();
    expect(screen.getByText('HIGH ALERT')).toBeDefined();

    // Verify it attempted to mark as read
    expect(mockMarkAsRead).toHaveBeenCalledWith({ alertId: '123', userId: 'user-1' });
  });

  it('should not mark as read if already read', () => {
    const mockAlert = {
      id: '123',
      title: 'Lithium Supply Shortage',
      description: 'Test description',
      severity: 'HIGH',
      created_at: new Date().toISOString(),
      user_alert_reads: [{ user_id: 'user-1' }], // Already read
    };

    vi.mocked(useMarketAlert).mockReturnValue({ data: mockAlert, isLoading: false, error: null } as unknown as ReturnType<typeof useMarketAlert>);
    
    render(
      <BrowserRouter>
        <AlertDetailPage />
      </BrowserRouter>
    );

    expect(mockMarkAsRead).not.toHaveBeenCalled();
  });
});
