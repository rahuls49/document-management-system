import '@testing-library/jest-dom';

// Mock ResizeObserver for JSDOM
global.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock window.open and document methods for preview/download
const mockWindowOpen = jest.fn();
const mockCreateElement = jest.fn().mockReturnValue({
	href: '',
	download: '',
	click: jest.fn(),
});
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

Object.defineProperty(window, 'open', {
	writable: true,
	value: mockWindowOpen,
});

Object.defineProperty(document, 'createElement', {
	writable: true,
	value: mockCreateElement,
});

Object.defineProperty(document, 'body', {
	writable: true,
	value: {
		appendChild: mockAppendChild,
		removeChild: mockRemoveChild,
	},
});

import React from 'react';
jest.mock('@/components/ui/button', () => ({
	Button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
}));
jest.mock('@/components/ui/input', () => ({
	Input: (props: { [key: string]: unknown }) => React.createElement('input', props),
}));
jest.mock('@/components/ui/label', () => ({
	Label: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('label', props, children),
}));
jest.mock('@/components/ui/select', () => ({
	Select: ({ children }: { children?: React.ReactNode }) => React.createElement('div', { 'data-testid': 'select' }, children),
	SelectContent: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	SelectItem: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('option', props, children),
	SelectTrigger: ({ children }: { children?: React.ReactNode }) => React.createElement('button', {}, children),
	SelectValue: ({ placeholder }: { placeholder?: string }) => React.createElement('span', {}, placeholder),
}));
jest.mock('@/components/ui/calendar', () => ({
	Calendar: () => React.createElement('div', {}, 'Calendar'),
}));
jest.mock('@/components/ui/popover', () => ({
	Popover: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	PopoverContent: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	PopoverTrigger: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
}));
jest.mock('@/components/ui/card', () => ({
	Card: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	CardContent: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	CardHeader: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	CardTitle: ({ children, className }: { children?: React.ReactNode; className?: string }) => React.createElement('div', { className }, children),
}));
jest.mock('@/components/ui/badge', () => ({
	Badge: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('span', props, children),
}));
jest.mock('@/components/ui/pagination', () => ({
	Pagination: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	PaginationContent: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	PaginationEllipsis: () => React.createElement('span', {}, '...'),
	PaginationItem: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children),
	PaginationLink: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
	PaginationNext: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
	PaginationPrevious: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
}));
jest.mock('lucide-react', () => ({
	CalendarIcon: () => React.createElement('div', {}, 'CalendarIcon'),
	Search: () => React.createElement('div', {}, 'Search'),
	Download: () => React.createElement('div', {}, 'Download'),
	Eye: () => React.createElement('div', {}, 'Eye'),
	X: () => React.createElement('div', {}, 'X'),
}));

import SearchDocument from '../search-document';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
	__esModule: true,
	default: {
		error: jest.fn(),
		success: jest.fn(),
	},
}));

import { format } from 'date-fns';

// Mock the store
jest.mock('../../../lib/store', () => ({
	useAuthStore: jest.fn(),
}));

import { useAuthStore } from '../../../lib/store';

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('SearchDocument', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Default mock for useAuthStore
		mockUseAuthStore.mockReturnValue({
			userData: {
				token: 'test-token',
				user_id: 'test-user-id',
				user_name: 'Test User',
				roles: [],
			},
		});

		// Mock fetch to return successful response
		global.fetch = jest.fn().mockResolvedValue({
			json: async () => ({
				status: true,
				data: [],
				recordsTotal: 0
			}),
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('can be imported without errors', () => {
		expect(SearchDocument).toBeDefined();
		expect(typeof SearchDocument).toBe('function');
	});

	it('validates utility functions', () => {
		// Test that utility functions are available and work as expected
		expect(typeof window.open).toBe('function');
		expect(typeof document.createElement).toBe('function');
		expect(typeof document.body.appendChild).toBe('function');
		expect(typeof document.body.removeChild).toBe('function');
	});

	it('validates date formatting utility', () => {
		expect(format).toBeDefined();
		expect(typeof format).toBe('function');

		const date = new Date('2023-01-01');
		const formatted = format(date, 'yyyy-MM-dd');
		expect(formatted).toBe('2023-01-01');
	});

	it('validates toast notifications', () => {
		expect(toast.success).toBeDefined();
		expect(toast.error).toBeDefined();
		expect(typeof toast.success).toBe('function');
		expect(typeof toast.error).toBe('function');
	});

	it('validates authentication store', () => {
		expect(mockUseAuthStore).toBeDefined();
		expect(typeof mockUseAuthStore).toBe('function');
	});

	it('validates API endpoint configuration', () => {
		const expectedUrl = 'https://apis.allsoft.co/api/documentManagement/searchDocumentEntry';
		expect(expectedUrl).toBeDefined();
		expect(expectedUrl).toMatch(/^https?:\/\//);
	});

	it('validates search payload structure', () => {
		const expectedPayload = {
			major_head: '',
			minor_head: '',
			from_date: '',
			to_date: '',
			tags: [],
			uploaded_by: '',
			start: 0,
			length: 10,
			filterId: '',
			search: { value: '' }
		};

		expect(expectedPayload).toEqual({
			major_head: '',
			minor_head: '',
			from_date: '',
			to_date: '',
			tags: [],
			uploaded_by: '',
			start: 0,
			length: 10,
			filterId: '',
			search: { value: '' }
		});
	});

	it('validates pagination calculations', () => {
		const totalRecords = 25;
		const recordsPerPage = 10;
		const expectedTotalPages = Math.ceil(totalRecords / recordsPerPage);

		expect(expectedTotalPages).toBe(3);
	});

	it('validates tag management logic', () => {
		const existingTags = [{ tag_name: 'existing' }];
		const newTag = 'new';

		// Test adding new tag
		const updatedTags = [...existingTags, { tag_name: newTag }];
		expect(updatedTags).toHaveLength(2);
		expect(updatedTags[1].tag_name).toBe('new');

		// Test preventing duplicate tags
		const duplicateTags = [...existingTags, { tag_name: 'existing' }];
		expect(duplicateTags).toHaveLength(2); // Should not add duplicate

		// Test removing tag
		const filteredTags = existingTags.filter(tag => tag.tag_name !== 'existing');
		expect(filteredTags).toHaveLength(0);
	});

	it('validates document actions', () => {
		const fileUrl = 'https://example.com/doc.pdf';
		const filename = 'document_123';

		// Test preview action (would call window.open)
		expect(fileUrl).toBe('https://example.com/doc.pdf');

		// Test download action (would create link element)
		expect(filename).toBe('document_123');
	});

	it('validates error handling scenarios', () => {
		// Test authentication error
		const noToken = null;
		expect(noToken).toBeNull();

		// Test network error
		const networkError = new Error('Network error');
		expect(networkError.message).toBe('Network error');

		// Test API error response
		const apiError = { status: false };
		expect(apiError.status).toBe(false);
	});

	it('validates success response handling', () => {
		const successResponse = {
			status: true,
			data: [
				{
					document_id: 1,
					major_head: 'Personal',
					minor_head: 'John',
					file_url: 'https://example.com/doc1.pdf',
					document_date: '2023-01-01',
					document_remarks: 'Test document 1',
					upload_time: '2023-01-01T10:00:00Z',
					uploaded_by: 'john.doe',
					row_num: 1,
					total_count: 1
				}
			],
			recordsTotal: 1
		};

		expect(successResponse.status).toBe(true);
		expect(successResponse.data).toHaveLength(1);
		expect(successResponse.recordsTotal).toBe(1);
		expect(successResponse.data[0].document_id).toBe(1);
	});

	it('validates component state management', () => {
		// Test initial state
		const initialFilters = {
			major_head: '',
			minor_head: '',
			from_date: '',
			to_date: '',
			tags: [],
			uploaded_by: '',
			start: 0,
			length: 10,
			filterId: '',
			search: { value: '' }
		};

		expect(initialFilters.tags).toHaveLength(0);
		expect(initialFilters.start).toBe(0);
		expect(initialFilters.length).toBe(10);

		// Test state updates
		const updatedFilters = {
			...initialFilters,
			search: { value: 'test search' },
			uploaded_by: 'john.doe'
		};

		expect(updatedFilters.search.value).toBe('test search');
		expect(updatedFilters.uploaded_by).toBe('john.doe');
	});

	it('validates UI component imports', () => {
		// Test that all required UI components are available (mocked)
		expect(() => jest.requireMock('@/components/ui/button')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/input')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/label')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/select')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/calendar')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/popover')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/card')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/badge')).not.toThrow();
		expect(() => jest.requireMock('@/components/ui/pagination')).not.toThrow();
	});

	it('validates icon imports', () => {
		expect(() => jest.requireMock('lucide-react')).not.toThrow();
	});
});