import '@testing-library/jest-dom';

// Mock ResizeObserver for JSDOM
global.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import toast from 'react-hot-toast';
// Setup a push mock for navigation
const pushMock = jest.fn();

jest.mock('react-hot-toast', () => ({
	__esModule: true,
	default: {
		error: jest.fn(),
		success: jest.fn(),
	},
}));

jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock }),
}));

describe('LoginForm', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			pushMock.mockClear();
		});

	it('renders mobile input and send OTP button', () => {
		render(<LoginForm />);
		expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Send OTP/i })).toBeInTheDocument();
	});

	it('shows error for invalid mobile number', async () => {
		render(<LoginForm />);
		fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '123' } });
		fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Please enter a valid 10-digit mobile number');
		});
	});

	it('calls OTP API and moves to OTP step on success', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			json: async () => ({ status: true, data: 'OTP Sent on SMS and WhatsApp' }),
		});
		render(<LoginForm />);
		fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '1234567890' } });
		fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
			await waitFor(() => {
				expect(toast.success).toHaveBeenCalledWith('OTP sent successfully!');
				expect(screen.getByRole('textbox')).toBeInTheDocument();
			});
	});

	it('shows error if OTP API fails', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			json: async () => ({ status: false }),
		});
		render(<LoginForm />);
		fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '1234567890' } });
		fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('This Mobile Number is not yet Registered.');
		});
	});

		it('shows error for invalid OTP', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				json: async () => ({ status: true, data: 'OTP Sent on SMS and WhatsApp' }),
			});
			render(<LoginForm />);
			// Enter valid mobile and send OTP
			fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
			await waitFor(() => {
				expect(screen.getByRole('textbox')).toBeInTheDocument();
			});
			// Enter invalid OTP and click Verify
			fireEvent.change(screen.getByRole('textbox'), { target: { value: '123' } });
			fireEvent.click(screen.getByRole('button', { name: /Verify OTP/i }));
			await waitFor(() => {
				expect(toast.error).toHaveBeenCalledWith('Please enter a valid 6-digit OTP');
			});
		});

		it('calls verify OTP API and navigates on success', async () => {
			global.fetch = jest.fn()
				.mockResolvedValueOnce({
					json: async () => ({ status: true, data: 'OTP Sent on SMS and WhatsApp' }),
				})
				.mockResolvedValueOnce({
					json: async () => ({ status: true }),
				});
			render(<LoginForm />);
			fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '1234567890' } });
			fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
				await waitFor(() => {
					expect(screen.getByRole('textbox')).toBeInTheDocument();
				});
			fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } });
			fireEvent.click(screen.getByRole('button', { name: /Verify OTP/i }));
			await waitFor(() => {
				expect(toast.success).toHaveBeenCalledWith('Login successful!');
				expect(pushMock).toHaveBeenCalledWith('/document-management');
			});
		});

	it('shows error if verify OTP API fails', async () => {
		global.fetch = jest.fn()
			.mockResolvedValueOnce({
				json: async () => ({ status: true, data: 'OTP Sent on SMS and WhatsApp' }),
			})
			.mockResolvedValueOnce({
				json: async () => ({ status: false }),
			});
		render(<LoginForm />);
		fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '1234567890' } });
		fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
			await waitFor(() => {
				expect(screen.getByRole('textbox')).toBeInTheDocument();
			});
		fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } });
		fireEvent.click(screen.getByRole('button', { name: /Verify OTP/i }));
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Invalid OTP. Please try again.');
		});
	});

	it('can go back to mobile step from OTP', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			json: async () => ({ status: true, data: 'OTP Sent on SMS and WhatsApp' }),
		});
		render(<LoginForm />);
		fireEvent.change(screen.getByPlaceholderText(/Enter 10-digit mobile number/i), { target: { value: '1234567890' } });
		fireEvent.click(screen.getByRole('button', { name: /Send OTP/i }));
			await waitFor(() => {
				expect(screen.getByRole('textbox')).toBeInTheDocument();
			});
		fireEvent.click(screen.getByRole('button', { name: /Back/i }));
		expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
	});
});

