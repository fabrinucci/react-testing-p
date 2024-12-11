import { Mock, MockInstance, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as OrderService from '../services/getOrders';
import { useOrders } from './useOrders';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('Test useOrdersSpy', () => {
  let useSessionSpy: MockInstance;
  let getOrdersSpy: MockInstance;
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useSessionSpy = vi.spyOn(AuthContext, 'useSession');
    getOrdersSpy = vi.spyOn(OrderService, 'getOrders');

    (ReactRouterDom.useNavigate as Mock).mockReturnValue(mockNavigate);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should return an error', async () => {
    useSessionSpy.mockReturnValue({ user: { id: 1 } });
    getOrdersSpy.mockRejectedValue(new Error('Api error'));
    const { result } = renderHook(useOrders);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(
        'Failed to fetch orders. Please try again later.'
      );

      expect(getOrdersSpy).toHaveBeenCalled();
      expect(getOrdersSpy).toHaveBeenCalledTimes(1);
    });
  });
});
