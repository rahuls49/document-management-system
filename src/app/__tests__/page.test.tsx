import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  it('renders LeftPanel and LoginForm', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Hey, Hello/i)).toBeInTheDocument();
    expect(screen.getByText(/Please Login to access the Document Management System/i)).toBeInTheDocument();
  });
});