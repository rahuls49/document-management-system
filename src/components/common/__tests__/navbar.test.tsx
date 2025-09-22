// --- GLOBAL MOCKS FOR TEST ENVIRONMENT ---

// Mock ResizeObserver for jsdom
if (typeof global.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver = ResizeObserver;
}

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/document-management',
}));

// Mock zustand store
jest.mock('@/lib/store', () => ({
  useAuthStore: () => ({
    userData: {
      user_name: 'Test User',
      user_id: 'testuser@example.com',
    },
  }),
}));

// Mock dropdown components to render inline instead of portals
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean; [key: string]: any }) => <div {...props}>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: any }) => <div onClick={onClick} {...props}>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <div />,
}));

// Mock popover components similarly
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean; [key: string]: any }) => <div {...props}>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
}));

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

import { Navbar } from '../navbar';


describe('Navbar', () => {
  beforeEach(() => {
    // Mock offsetWidth for containerRef to force desktop mode
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1000,
    });
  });

  it('renders logo and navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('DMS')).toBeInTheDocument();
    expect(screen.getByText('Document Manager')).toBeInTheDocument();
    expect(screen.getByText('User Manager')).toBeInTheDocument();
  });

  it('shows user menu with user info', async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /User menu/i }));
  expect(await within(document.body).findByText((content) => content.includes('Test User'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('testuser@example.com'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('Log out'))).toBeInTheDocument();
  });

  it('shows info menu items', async () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /Help and Information/i }));
  expect(await within(document.body).findByText((content) => content.includes('Help Center'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('Documentation'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('Contact Support'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('Send Feedback'))).toBeInTheDocument();
  });

  it('shows notification menu items', async () => {
    render(<Navbar notificationCount={2} />);
    fireEvent.click(screen.getByRole('button', { name: /Notifications/i }));
  expect(await within(document.body).findByText((content) => content.includes('New message received'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('System update available'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('Weekly report ready'))).toBeInTheDocument();
  expect(await within(document.body).findByText((content) => content.includes('View all notifications'))).toBeInTheDocument();
  });

  it('calls navigation handler on link click', () => {
    // Override usePathname for this test
    const nextNavigation = require('next/navigation');
    nextNavigation.usePathname = () => '/';
    const handleNavItemClick = jest.fn();
    render(<Navbar onNavItemClick={handleNavItemClick} />);
    fireEvent.click(screen.getByRole('link', { name: /Document Manager/i }));
    expect(handleNavItemClick).toHaveBeenCalledWith('/document-management');
  });
});
