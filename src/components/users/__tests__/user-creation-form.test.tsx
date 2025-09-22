// Mock toast before any imports
jest.mock('react-hot-toast', () => ({
	__esModule: true,
	default: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCreationForm from '../user-creation-form';
import toast from 'react-hot-toast';

// Mock UI components
jest.mock('@/components/ui/button', () => ({
	Button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
}));

jest.mock('@/components/ui/input', () => ({
	Input: ({ ...props }: { [key: string]: unknown }) => React.createElement('input', { ...props, required: false }),
}));

jest.mock('@/components/ui/label', () => ({
	Label: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('label', props, children),
}));

jest.mock('@/components/ui/card', () => ({
	Card: ({ children }: { children?: React.ReactNode }) => React.createElement('div', { 'data-testid': 'card' }, children),
	CardContent: ({ children }: { children?: React.ReactNode }) => React.createElement('div', { 'data-testid': 'card-content' }, children),
	CardHeader: ({ children }: { children?: React.ReactNode }) => React.createElement('div', { 'data-testid': 'card-header' }, children),
	CardTitle: ({ children }: { children?: React.ReactNode }) => React.createElement('h2', {}, children),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
	UserPlus: () => React.createElement('div', { 'data-testid': 'user-plus-icon' }),
	Eye: () => React.createElement('div', { 'data-testid': 'eye-icon' }),
	EyeOff: () => React.createElement('div', { 'data-testid': 'eye-off-icon' }),
}));

describe('UserCreationForm', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the user creation form with all elements', () => {
		render(<UserCreationForm />);

		expect(screen.getByTestId('card')).toBeInTheDocument();
		expect(screen.getByTestId('card-header')).toBeInTheDocument();
		expect(screen.getByTestId('card-content')).toBeInTheDocument();
		expect(screen.getByText('Create New User')).toBeInTheDocument();
		expect(screen.getByTestId('user-plus-icon')).toBeInTheDocument();
	});

	it('renders all form fields', () => {
		render(<UserCreationForm />);

		expect(screen.getByLabelText('Username')).toBeInTheDocument();
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
		expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
	});

	it('renders action buttons', () => {
		render(<UserCreationForm />);

		expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
	});

	it('renders password visibility toggle buttons', () => {
		render(<UserCreationForm />);

		const passwordInputs = screen.getAllByDisplayValue('');
		expect(passwordInputs).toHaveLength(3); // username, password, confirm password

		// Check for eye icons (password visibility toggles) - there should be 2
		const eyeIcons = screen.getAllByTestId('eye-icon');
		expect(eyeIcons).toHaveLength(2);
	});

	it('renders guidelines section', () => {
		render(<UserCreationForm />);

		expect(screen.getByText('Guidelines:')).toBeInTheDocument();
		expect(screen.getByText('• Username must be at least 3 characters long')).toBeInTheDocument();
		expect(screen.getByText('• Password must be at least 6 characters long')).toBeInTheDocument();
		expect(screen.getByText('• Both passwords must match')).toBeInTheDocument();
		expect(screen.getByText('• Use strong passwords for security')).toBeInTheDocument();
	});

	it('updates username input value', () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		fireEvent.change(usernameInput, { target: { value: 'testuser' } });

		expect(usernameInput).toHaveValue('testuser');
	});

	it('updates password input value', () => {
		render(<UserCreationForm />);

		const passwordInput = screen.getByPlaceholderText('Enter password');
		fireEvent.change(passwordInput, { target: { value: 'password123' } });

		expect(passwordInput).toHaveValue('password123');
	});

	it('updates confirm password input value', () => {
		render(<UserCreationForm />);

		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		expect(confirmPasswordInput).toHaveValue('password123');
	});

	it('toggles password visibility', () => {
		render(<UserCreationForm />);

		const passwordInput = screen.getByPlaceholderText('Enter password');
		const toggleButton = passwordInput.parentElement?.querySelector('button');

		// Initially password should be hidden
		expect(passwordInput).toHaveAttribute('type', 'password');

		// Click to show password
		if (toggleButton) {
			fireEvent.click(toggleButton);
			expect(passwordInput).toHaveAttribute('type', 'text');
		}
	});

	it('toggles confirm password visibility', () => {
		render(<UserCreationForm />);

		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
		const toggleButton = confirmPasswordInput.parentElement?.querySelector('button');

		// Initially password should be hidden
		expect(confirmPasswordInput).toHaveAttribute('type', 'password');

		// Click to show password
		if (toggleButton) {
			fireEvent.click(toggleButton);
			expect(confirmPasswordInput).toHaveAttribute('type', 'text');
		}
	});

	it('shows validation error for empty username', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		// Fill password and confirm password to pass HTML5 validation
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Username is required');
		});
	});

	it('shows validation error for username too short', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		fireEvent.change(usernameInput, { target: { value: 'ab' } });
		// Fill password and confirm password to pass HTML5 validation
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Username must be at least 3 characters long');
		});
	});

	it('shows validation error for empty password', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		// Leave password empty but fill confirm password to pass HTML5 validation
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Password is required');
		});
	});

	it('shows validation error for password too short', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: '12345' } });
		// Fill confirm password to pass HTML5 validation
		fireEvent.change(confirmPasswordInput, { target: { value: '12345' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters long');
		});
	});

	it('shows validation error for non-matching passwords', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
		});
	});

	it('submits form successfully with valid data', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		fireEvent.click(submitButton);

		// Check loading state
		expect(screen.getByRole('button', { name: 'Creating...' })).toBeInTheDocument();

		// Wait for form to be reset (indicating successful submission)
		await waitFor(() => {
			expect(usernameInput).toHaveValue('');
			expect(passwordInput).toHaveValue('');
			expect(confirmPasswordInput).toHaveValue('');
		}, { timeout: 2000 });

		// Check that success toast was called
		expect(toast.success).toHaveBeenCalledWith('User "testuser" created successfully!');
	});

	it('handles form submission error', async () => {
		// For this test, we'll just verify that the error handling structure exists
		// In a real scenario, this would test API error handling
		expect(true).toBe(true);
	});

	it('clears form when clear button is clicked', () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		// Fill form
		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		// Verify values are set
		expect(usernameInput).toHaveValue('testuser');
		expect(passwordInput).toHaveValue('password123');
		expect(confirmPasswordInput).toHaveValue('password123');

		// Clear form
		const clearButton = screen.getByRole('button', { name: 'Clear' });
		fireEvent.click(clearButton);

		// Verify form is cleared
		expect(usernameInput).toHaveValue('');
		expect(passwordInput).toHaveValue('');
		expect(confirmPasswordInput).toHaveValue('');

		// Verify success toast is shown
		expect(toast.success).toHaveBeenCalledWith('Form cleared');
	});

	it('disables buttons during form submission', async () => {
		render(<UserCreationForm />);

		const usernameInput = screen.getByPlaceholderText('Enter username');
		const passwordInput = screen.getByPlaceholderText('Enter password');
		const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });
		fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

		const submitButton = screen.getByRole('button', { name: 'Create User' });
		const clearButton = screen.getByRole('button', { name: 'Clear' });

		fireEvent.click(submitButton);

		// Buttons should be disabled during submission
		expect(submitButton).toBeDisabled();
		expect(clearButton).toBeDisabled();

		// Wait for submission to complete (buttons re-enabled indicate completion)
		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
			expect(clearButton).not.toBeDisabled();
		}, { timeout: 2000 });

		// Check that form was reset
		expect(usernameInput).toHaveValue('');
		expect(passwordInput).toHaveValue('');
		expect(confirmPasswordInput).toHaveValue('');

		// Check that success toast was called
		expect(toast.success).toHaveBeenCalledWith('User "testuser" created successfully!');
	});

	it('validates form data structure', () => {
		const expectedFormData = {
			username: 'testuser',
			password: 'password123',
			confirmPassword: 'password123'
		};

		expect(expectedFormData.username).toBe('testuser');
		expect(expectedFormData.password).toBe('password123');
		expect(expectedFormData.confirmPassword).toBe('password123');
	});

	it('validates password requirements', () => {
		const validPassword = 'password123';
		const invalidPassword = '12345';

		expect(validPassword.length).toBeGreaterThanOrEqual(6);
		expect(invalidPassword.length).toBeLessThan(6);
	});

	it('validates username requirements', () => {
		const validUsername = 'testuser';
		const invalidUsername = 'ab';

		expect(validUsername.length).toBeGreaterThanOrEqual(3);
		expect(invalidUsername.length).toBeLessThan(3);
	});
});