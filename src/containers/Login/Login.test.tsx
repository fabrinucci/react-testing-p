import { act } from 'react';
import { Mock, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../../context/AuthContext';
import { getAuth } from '../../services/getAuth';
import { Login } from './Login';

vi.mock('../../services/getAuth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockGetAuth = getAuth as Mock;
const mockNavigate = vi.fn();

describe('Test login', () => {
  beforeEach(() => {
    render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    );

    vi.clearAllMocks();
  });

  it('Should be in the document', () => {
    const login = screen.getByTestId('Login');
    const title = screen.getByText('Platzi order');
    const username = screen.getByPlaceholderText('Username');
    const password = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: 'Login' });

    expect(login).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('Should change values', () => {
    const username = screen.getByPlaceholderText('Username');
    const password = screen.getByPlaceholderText('Password');

    expect(username).toHaveValue('superadmin@example.com');
    expect(password).toHaveValue('superadmin123!');

    fireEvent.change(username, { target: { value: 'otheradmin@mail.com' } });
    fireEvent.change(password, { target: { value: 'newPassword' } });

    expect(username).toHaveValue('otheradmin@mail.com');
    expect(password).toHaveValue('newPassword');
  });

  it('Should display the error message', async () => {
    mockGetAuth.mockRejectedValue(new Error('Invalid credentials'));

    const username = screen.getByPlaceholderText('Username');
    const password = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: 'Login' });

    await act(() => {
      fireEvent.change(username, { target: { value: 'otheradmin@mail.com' } });
      fireEvent.change(password, { target: { value: 'newPassword' } });
      fireEvent.click(button);
    });

    const errorMessage = screen.queryByText('Invalid credentials');
    expect(errorMessage).toBeInTheDocument();
  });

  it('Should redirect to "/orders"', async () => {
    mockGetAuth.mockResolvedValue({ success: true });

    const username = screen.getByPlaceholderText('Username');
    const password = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: 'Login' });

    await act(() => {
      fireEvent.change(username, { target: { value: 'validUser@mail.com' } });
      fireEvent.change(password, { target: { value: 'validPassword' } });
      fireEvent.click(button);
    });

    const errorMessage = screen.queryByText('Invalid credentials');
    expect(errorMessage).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAuth).toHaveBeenCalled();
      expect(mockGetAuth).toHaveBeenCalledTimes(1);
      expect(mockGetAuth).toHaveBeenCalledWith(
        'validUser@mail.com',
        'validPassword'
      );

      expect(mockNavigate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/orders');
    });
  });
});
