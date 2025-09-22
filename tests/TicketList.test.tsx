import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TicketList from '../src/components/TicketList';
import type { Ticket } from '../src/types';

// Mock ticket data for testing
const mockTickets: Ticket[] = [
  { id: '1', title: 'Olivia Rodrigo Guts Tour', price: 125.00, currency: 'USD' },
  { id: '2', title: 'Harry Styles Love on Tour', price: 89.50, currency: 'USD' },
  { id: '3', title: 'Billie Eilish Happier Than Ever', price: 145.00, currency: 'EUR' },
  { id: '4', title: 'Taylor Swift Eras Tour', price: 275.00, currency: 'GBP' },
  { id: '5', title: 'Kendrick Lamar Mr. Morale Tour', price: 95.00, currency: 'USD' },
];

describe('TicketList', () => {
  test('renders all tickets by default', () => {
    render(<TicketList tickets={mockTickets} />);
    
    expect(screen.getByText('Olivia Rodrigo Guts Tour')).toBeInTheDocument();
    expect(screen.getByText('Harry Styles Love on Tour')).toBeInTheDocument();
    expect(screen.getByText('Billie Eilish Happier Than Ever')).toBeInTheDocument();
    expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
    expect(screen.getByText('Kendrick Lamar Mr. Morale Tour')).toBeInTheDocument();
  });

  test('renders search input with proper accessibility', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('placeholder', 'Search tickets by title...');
    expect(searchInput).toHaveAttribute('id', 'ticket-search');
  });

  test('renders sort select with proper accessibility', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveValue('price-asc');
    expect(sortSelect).toHaveAttribute('id', 'sort-tickets');
  });

  test('filters tickets by search term (case-insensitive)', async () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    
    // Search for "Taylor" (case-insensitive)
    fireEvent.change(searchInput, { target: { value: 'Taylor' } });
    
    // Wait for debounced search to complete (300ms + buffer)
    await waitFor(() => {
      expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
      expect(screen.queryByText('Harry Styles Love on Tour')).not.toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Search for "TOUR" (uppercase)
    fireEvent.change(searchInput, { target: { value: 'TOUR' } });
    
    await waitFor(() => {
      expect(screen.getByText('Olivia Rodrigo Guts Tour')).toBeInTheDocument();
      expect(screen.getByText('Harry Styles Love on Tour')).toBeInTheDocument();
      expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
      expect(screen.getByText('Kendrick Lamar Mr. Morale Tour')).toBeInTheDocument();
      expect(screen.queryByText('Billie Eilish Happier Than Ever')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('shows "No tickets found" when search yields no results', async () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No tickets found matching "nonexistent"')).toBeInTheDocument();
      expect(screen.queryByText('Taylor Swift Eras Tour')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('clears search when clear button is clicked', async () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    
    // Search for something
    fireEvent.change(searchInput, { target: { value: 'Taylor' } });
    
    await waitFor(() => {
      expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
      expect(screen.queryByText('Harry Styles Love on Tour')).not.toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Clear the search
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
      expect(screen.getByText('Harry Styles Love on Tour')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('sorts tickets by price ascending (default)', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const ticketItems = screen.getAllByRole('listitem');
    const firstTicket = ticketItems[0];
    const lastTicket = ticketItems[ticketItems.length - 1];
    
    expect(firstTicket).toHaveTextContent('Harry Styles Love on Tour');
    expect(lastTicket).toHaveTextContent('Taylor Swift Eras Tour');
  });

  test('sorts tickets by price descending', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    const ticketItems = screen.getAllByRole('listitem');
    const firstTicket = ticketItems[0];
    const lastTicket = ticketItems[ticketItems.length - 1];
    
    expect(firstTicket).toHaveTextContent('Taylor Swift Eras Tour');
    expect(lastTicket).toHaveTextContent('Harry Styles Love on Tour');
  });

  test('sorts tickets by title alphabetically', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'title-asc' } });
    
    const ticketItems = screen.getAllByRole('listitem');
    const firstTicket = ticketItems[0];
    const lastTicket = ticketItems[ticketItems.length - 1];
    
    expect(firstTicket).toHaveTextContent('Billie Eilish Happier Than Ever');
    expect(lastTicket).toHaveTextContent('Taylor Swift Eras Tour');
  });

  test('combines search and sort functionality', async () => {
    const user = userEvent.setup();
    render(<TicketList tickets={mockTickets} />);
    
    // Search for tickets containing "tour"
    const searchInput = screen.getByLabelText('Search tickets');
    await user.type(searchInput, 'tour');
    
    // Wait for the debounce to complete (300ms + buffer)
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Olivia Rodrigo Guts Tour')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Sort by price descending
    const sortSelect = screen.getByLabelText('Sort tickets');
    await user.selectOptions(sortSelect, 'price-desc');
    
    const ticketItems = screen.getAllByRole('listitem');
    expect(ticketItems).toHaveLength(4);
    
    // Taylor Swift should come first (highest price)
    expect(ticketItems[0]).toHaveTextContent('Taylor Swift Eras Tour');
    expect(ticketItems[1]).toHaveTextContent('Olivia Rodrigo Guts Tour');
  });

  test('renders ticket prices with proper formatting', () => {
    render(<TicketList tickets={mockTickets} />);
    
    // Check that titles and prices are rendered separately
    expect(screen.getByText('Olivia Rodrigo Guts Tour')).toBeInTheDocument();
    expect(screen.getByText('$125.00')).toBeInTheDocument();
    expect(screen.getByText('Harry Styles Love on Tour')).toBeInTheDocument();
    expect(screen.getByText('$89.50')).toBeInTheDocument();
    expect(screen.getByText('Billie Eilish Happier Than Ever')).toBeInTheDocument();
    expect(screen.getByText('€145.00')).toBeInTheDocument();
    expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
    expect(screen.getByText('£275.00')).toBeInTheDocument();
  });

  test('handles empty tickets array', () => {
    render(<TicketList tickets={[]} />);
    
    expect(screen.getByText('No tickets available')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('maintains search state when sorting changes', async () => {
    const user = userEvent.setup();
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    await user.type(searchInput, 'tour');
    
    // Wait for the debounce to complete (300ms + buffer)
    await new Promise(resolve => setTimeout(resolve, 400));
    
    await waitFor(() => {
      expect(screen.getByText('Olivia Rodrigo Guts Tour')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    await user.selectOptions(sortSelect, 'title-asc');
    
    // Search term should still be "tour"
    expect(searchInput).toHaveValue('tour');
    
    // Should still show filtered results
    expect(screen.getByText('Harry Styles Love on Tour')).toBeInTheDocument();
    expect(screen.getByText('Taylor Swift Eras Tour')).toBeInTheDocument();
    expect(screen.queryByText('Billie Eilish Happier Than Ever')).not.toBeInTheDocument();
  });

  test('maintains sort state when search changes', async () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'title-asc' } });
    
    const searchInput = screen.getByLabelText('Search tickets');
    fireEvent.change(searchInput, { target: { value: 'tour' } });
    
    await waitFor(() => {
      // Sort should still be "title-asc"
      expect(sortSelect).toHaveValue('title-asc');
      
      // Results should be filtered and sorted
      const ticketItems = screen.getAllByRole('listitem');
      expect(ticketItems).toHaveLength(4);
      expect(ticketItems[0]).toHaveTextContent('Harry Styles Love on Tour');
      expect(ticketItems[1]).toHaveTextContent('Kendrick Lamar Mr. Morale Tour');
    }, { timeout: 1000 });
  });

  test('renders proper list structure', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockTickets.length);
  });

  test('handles tickets with zero price', () => {
    const ticketsWithZeroPrice: Ticket[] = [
      { id: '1', title: 'Free Event', price: 0, currency: 'USD' },
      { id: '2', title: 'Paid Event', price: 25.00, currency: 'USD' },
    ];
    
    render(<TicketList tickets={ticketsWithZeroPrice} />);
    
    expect(screen.getByText('Free Event')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('Paid Event')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  test('handles tickets with decimal prices', () => {
    const ticketsWithDecimals: Ticket[] = [
      { id: '1', title: 'Event 1', price: 12.34, currency: 'USD' },
      { id: '2', title: 'Event 2', price: 99.99, currency: 'EUR' },
    ];
    
    render(<TicketList tickets={ticketsWithDecimals} />);
    
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('$12.34')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
    expect(screen.getByText('€99.99')).toBeInTheDocument();
  });
});
