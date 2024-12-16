import React from 'react';
import { Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useOrders } from './useOrders';
import { useSession, SessionProvider } from '../context/AuthContext';

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

describe('Test useOrders', () => {
  const mockUser = { id: 4, name: 'Gilbert Santos' };

  beforeEach(() => {
    (useSession as Mock).mockReturnValue({ user: mockUser });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </SessionProvider>
  );

  it('Should render correct results', async () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.orders.length).toBe(1);
    });
  });
});
