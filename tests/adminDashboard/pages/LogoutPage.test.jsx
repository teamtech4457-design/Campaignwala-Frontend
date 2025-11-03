
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LogoutPage from '../../../src/adminDashboard/pages/LogoutPage';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('LogoutPage', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the logout message', () => {
    render(<LogoutPage />, { wrapper: MemoryRouter });

    expect(screen.getByText('Logging out...')).toBeInTheDocument();
    expect(screen.getByText('You are being logged out. Redirecting to login page.')).toBeInTheDocument();
  });

  test('redirects to the login page after a delay', () => {
    render(<LogoutPage />, { wrapper: MemoryRouter });

    // Initially, navigate should not have been called
    expect(mockedNavigate).not.toHaveBeenCalled();

    // Advance timers by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Now, navigate should have been called with the login path
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
