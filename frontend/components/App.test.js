import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AppFunctional from './AppFunctional';

jest.mock('axios');

describe('AppFunctional Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    render(<AppFunctional />);
  });

  test('renders the component', () => {
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
  });

  test('updates email input on change', () => {
    const emailInput = screen.getByTestId('email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('prevents submission with no email', async () => {
    const submitButton = screen.getByTestId('submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Ouch: email is required/);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('submits form and resets email on success', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { success: true, message: 'Test success message' },
    });

    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const successMessage = screen.getByText(/Test success message/);
      expect(successMessage).toBeInTheDocument();
    });

    // Check if the email input is reset
    expect(emailInput.value).toBe('');
  });

  test('handles form submission error', async () => {
    axios.post.mockRejectedValue({ message: 'Test error message' });

    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Error submitting the form/);
      expect(errorMessage).toBeInTheDocument();
    });

    expect(emailInput.value).toBe('test@example.com');
  });
});