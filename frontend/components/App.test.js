import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AppFunctional from './AppFunctional';

jest.mock('axios');

describe('AppFunctional Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    render(<AppFunctional />);
  });

  test('renders the component with the visible elements', () => {
    // Ensure that the necessary elements are present in the initial render
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('coordinates')).toBeInTheDocument();
    expect(screen.getByTestId('steps')).toBeInTheDocument();
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('up')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
    expect(screen.getByTestId('down')).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeInTheDocument();
  });

  test('renders the initial message "Coordinates (2, 2)"', () => {
    // Check if the initial message is rendered correctly
    expect(screen.getByTestId('coordinates')).toHaveTextContent('Coordinates (2, 2)');
  });

  test('updates email input and reflects in the component state', () => {
    const emailInput = screen.getByTestId('email');

    // Change the email input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Verify that the component's state reflects the updated email
    expect(screen.getByTestId('email')).toHaveValue('test@example.com');
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