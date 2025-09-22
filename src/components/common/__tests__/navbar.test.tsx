import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '../navbar';

jest.mock('@/lib/store', () => ({
  useAuthStore: () => ({
    userData: {
      user_name: 'Test User',
      user_id: 'testuser@example.com',
    },
  }),
}));

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('DMS')).toBeInTheDocument();
    expect(screen.getByText('Document Manager')).toBeInTheDocument();
    expect(screen.getByText('User Manager')).toBeInTheDocument();
  });

  it('shows user menu with user info', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText('User menu'));
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('shows info menu items', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText('Help and Information'));
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('Send Feedback')).toBeInTheDocument();
  });

  it('shows notification menu items', () => {
    render(<Navbar notificationCount={2} />);
    fireEvent.click(screen.getByLabelText('Notifications'));
    expect(screen.getByText('New message received')).toBeInTheDocument();
    expect(screen.getByText('System update available')).toBeInTheDocument();
    expect(screen.getByText('Weekly report ready')).toBeInTheDocument();
    expect(screen.getByText('View all notifications')).toBeInTheDocument();
  });

  it('calls navigation handler on link click', () => {
    const handleNavItemClick = jest.fn();
    render(<Navbar onNavItemClick={handleNavItemClick} />);
    fireEvent.click(screen.getByText('Document Manager'));
    expect(handleNavItemClick).toHaveBeenCalledWith('/document-management');
  });
});
