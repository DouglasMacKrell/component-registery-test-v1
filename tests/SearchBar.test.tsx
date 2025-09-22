import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../src/components/SearchBar';

// Mock window.history for URL sync tests
const mockReplaceState = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
  writable: true,
});

// Mock URL constructor
const mockUrl = {
  searchParams: {
    set: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  },
  toString: jest.fn(() => 'http://localhost:3000?search=test'),
};
global.URL = jest.fn(() => mockUrl) as any;

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUrl.searchParams.get.mockReturnValue(null);
    mockUrl.toString.mockReturnValue('http://localhost:3000');
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<SearchBar />);
      
      expect(screen.getByLabelText('Search input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with custom props', () => {
      render(
        <SearchBar
          placeholder="Custom placeholder"
          aria-label="Custom label"
          id="custom-id"
        />
      );
      
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
      expect(screen.getByLabelText('Custom label')).toHaveAttribute('id', 'custom-id');
    });

    it('renders with initial value', () => {
      render(<SearchBar value="initial value" />);
      
      expect(screen.getByDisplayValue('initial value')).toBeInTheDocument();
    });
  });

  describe('Input Interaction', () => {
    it('updates input value on typing', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test search' } });
      
      expect(input).toHaveValue('test search');
    });

    it('calls onChange with debounced value', async () => {
      const onChange = jest.fn();
      render(<SearchBar onChange={onChange} debounceMs={100} />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should not call onChange immediately
      expect(onChange).not.toHaveBeenCalled();
      
      // Should call onChange after debounce delay
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('test');
      }, { timeout: 200 });
    });

    it('shows clear button when input has value', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('clears input when clear button is clicked', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.click(screen.getByLabelText('Clear search'));
      
      expect(input).toHaveValue('');
    });

    it('hides clear button when input is empty', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
      
      fireEvent.change(input, { target: { value: '' } });
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
  });

  describe('Debounce Behavior', () => {
    it('debounces rapid input changes', async () => {
      const onChange = jest.fn();
      render(<SearchBar onChange={onChange} debounceMs={100} />);
      const input = screen.getByLabelText('Search input');
      
      // Rapid typing
      fireEvent.change(input, { target: { value: 't' } });
      fireEvent.change(input, { target: { value: 'te' } });
      fireEvent.change(input, { target: { value: 'tes' } });
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should only call onChange once with final value
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('test');
      }, { timeout: 200 });
    });

    it('shows searching indicator during debounce', async () => {
      render(<SearchBar debounceMs={100} />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(screen.getByText('Searching...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('handles zero debounce delay', async () => {
      const onChange = jest.fn();
      render(<SearchBar onChange={onChange} debounceMs={0} />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should call onChange immediately
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('test');
      });
    });
  });

  describe('URL Synchronization', () => {
    it('initializes from URL parameter', () => {
      mockUrl.searchParams.get.mockReturnValue('url-search-value');
      
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?search=url-search-value',
          href: 'http://localhost:3000?search=url-search-value'
        },
        writable: true,
      });
      
      render(<SearchBar syncWithUrl={true} urlParam="search" />);
      
      expect(screen.getByDisplayValue('url-search-value')).toBeInTheDocument();
    });

    it('updates URL when input changes', async () => {
      render(<SearchBar syncWithUrl={true} urlParam="search" debounceMs={0} />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // URL sync happens in useEffect, so we need to wait for it
      await waitFor(() => {
        expect(mockUrl.searchParams.set).toHaveBeenCalledWith('search', 'test');
      }, { timeout: 100 });
    });

    it('removes URL parameter when input is cleared', async () => {
      render(<SearchBar syncWithUrl={true} urlParam="search" debounceMs={0} />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.change(input, { target: { value: '' } });
      
      await waitFor(() => {
        expect(mockUrl.searchParams.delete).toHaveBeenCalledWith('search');
      }, { timeout: 100 });
    });

    it('does not sync with URL when disabled', async () => {
      render(<SearchBar syncWithUrl={false} debounceMs={0} />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      await waitFor(() => {
        expect(mockUrl.searchParams.set).not.toHaveBeenCalled();
        expect(mockReplaceState).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper label association', () => {
      render(<SearchBar id="search-input" aria-label="Search for tickets" />);
      
      const input = screen.getByLabelText('Search for tickets');
      const label = screen.getByText('Search for tickets');
      
      expect(input).toHaveAttribute('id', 'search-input');
      expect(label).toHaveAttribute('for', 'search-input');
    });

    it('has proper ARIA attributes', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      expect(input).toHaveAttribute('aria-label', 'Search input');
    });

    it('associates clear button with input', () => {
      render(<SearchBar id="search-input" />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveAttribute('id', 'search-input-clear');
      expect(input).toHaveAttribute('aria-describedby', 'search-input-clear');
    });

    it('supports keyboard navigation', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      input.focus();
      expect(input).toHaveFocus();
    });
  });

  describe('Focus and Blur Styling', () => {
    it('applies focus styles', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.focus(input);
      
      expect(input).toHaveStyle({
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
      });
    });

    it('removes focus styles on blur', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      expect(input).toHaveStyle({
        borderColor: '#d1d5db',
        boxShadow: 'none'
      });
    });
  });

  describe('Clear Button Interactions', () => {
    it('applies hover styles to clear button', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText('Search input');
      
      fireEvent.change(input, { target: { value: 'test' } });
      const clearButton = screen.getByLabelText('Clear search');
      
      fireEvent.mouseEnter(clearButton);
      expect(clearButton).toHaveStyle({
        color: '#374151',
        backgroundColor: '#f3f4f6'
      });
      
      fireEvent.mouseLeave(clearButton);
      expect(clearButton).toHaveStyle({
        color: '#6b7280',
        backgroundColor: 'transparent'
      });
    });
  });

  describe('Integration with TicketList', () => {
    it('works with controlled value from parent', () => {
      const TestWrapper = () => {
        const [value, setValue] = React.useState('initial');
        
        return (
          <SearchBar
            value={value}
            onChange={setValue}
            debounceMs={0}
          />
        );
      };
      
      render(<TestWrapper />);
      
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
      
      const input = screen.getByLabelText('Search input');
      fireEvent.change(input, { target: { value: 'updated' } });
      
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onChange gracefully', () => {
      expect(() => {
        render(<SearchBar />);
        const input = screen.getByLabelText('Search input');
        fireEvent.change(input, { target: { value: 'test' } });
      }).not.toThrow();
    });

    it('handles SSR environment (no window)', () => {
      // Test that component renders without crashing when window.location is undefined
      // This simulates a more realistic SSR scenario
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: undefined,
        writable: true,
      });
      
      expect(() => {
        render(<SearchBar syncWithUrl={true} />);
      }).not.toThrow();
      
      // Restore location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });

    it('handles empty string values', async () => {
      const onChange = jest.fn();
      render(<SearchBar onChange={onChange} debounceMs={0} />);
      const input = screen.getByLabelText('Search input');
      
      // First set a value, then clear it
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.change(input, { target: { value: '' } });
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
      });
    });
  });
});
