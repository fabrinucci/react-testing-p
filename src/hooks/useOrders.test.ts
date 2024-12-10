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

  it('Should be true', () => {
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

    waitFor(() => {
      expect(result.current.error).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.orders).toEqual(mockedOrders);
    });
  });
});
