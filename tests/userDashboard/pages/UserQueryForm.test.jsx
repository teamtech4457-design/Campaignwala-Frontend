
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserQueryForm from '../../../src/userDashboard/pages/UserQueryForm';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('UserQueryForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedNavigate.mockClear();
    // Mock alert
    window.alert = jest.fn();
  });

  test('renders the form correctly', () => {
    render(<UserQueryForm darkMode={false} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Submit Your Query')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter subject (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your message here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Query' })).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    render(<UserQueryForm darkMode={false} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter subject (optional)'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByPlaceholderText('Write your message here...'), { target: { value: 'This is a test message.' } });

    expect(screen.getByPlaceholderText('Enter your full name').value).toBe('John Doe');
    expect(screen.getByPlaceholderText('Enter your email').value).toBe('john.doe@example.com');
    expect(screen.getByPlaceholderText('Enter subject (optional)').value).toBe('Test Subject');
    expect(screen.getByPlaceholderText('Write your message here...').value).toBe('This is a test message.');
  });

  test('shows an error message if required fields are empty on submission', () => {
    render(<UserQueryForm darkMode={false} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Query' }));

    expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
  });

  test('submits the form successfully with valid data', async () => {
    render(<UserQueryForm darkMode={false} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Write your message here...'), { target: { value: 'This is another test message.' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Query' }));

    expect(screen.getByText('Thank you for your query! We’ll get back to you soon.')).toBeInTheDocument();

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Your query has been submitted successfully!');
    }, { timeout: 1500 });

    // Check if form is cleared after submission
    await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your full name').value).toBe('');
        expect(screen.getByPlaceholderText('Enter your email').value).toBe('');
        expect(screen.getByPlaceholderText('Write your message here...').value).toBe('');
    });
  });

  test('navigates back when the back button is clicked', () => {
    render(<UserQueryForm darkMode={false} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('← Back'));

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
