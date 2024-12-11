import { Mock, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOrders } from './useOrders';
import { getOrders } from '../services/getOrders';
import { useSession } from '../context/AuthContext';

vi.mock('../services/getOrders', () => ({
  getOrders: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useSession: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('Test useOrders', () => {
  const mockGetOrders = getOrders as Mock;
  const mockUseSession = useSession as Mock;

  it('Should render correct results', async () => {
    const mockedOrders = [
      {
        id: 1,
        name: 'Order 1',
      },
      {
        id: 2,
        name: 'Order 2',
      },
    ];

    mockGetOrders.mockResolvedValue(mockedOrders);
    mockUseSession.mockReturnValue({ user: { id: 1, role: 'admin' } });

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.orders).toEqual(mockedOrders);
      expect(result.current.error).toBe(null);
    });
  });

  it('Should return an error', async () => {
    mockGetOrders.mockRejectedValue(new Error('Api Error'));
    mockUseSession.mockReturnValue({ user: { id: 1, role: 'admin' } });

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(
        'Failed to fetch orders. Please try again later.'
      );
    });
  });
});
