import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketList from '../src/components/TicketList';
import type { Ticket } from '../src/types';

// Mock ticket data for testing
const mockTickets: Ticket[] = [
  { id: '1', title: 'Concert Ticket', price: 25.00, currency: 'USD' },
  { id: '2', title: 'Movie Ticket', price: 12.50, currency: 'USD' },
  { id: '3', title: 'Theater Show', price: 45.00, currency: 'EUR' },
  { id: '4', title: 'Sports Event', price: 75.00, currency: 'GBP' },
  { id: '5', title: 'Comedy Show', price: 20.00, currency: 'USD' },
];

describe('TicketList', () => {
  test('renders all tickets by default', () => {
    render(<TicketList tickets={mockTickets} />);
    
    expect(screen.getByText('Concert Ticket')).toBeInTheDocument();
    expect(screen.getByText('Movie Ticket')).toBeInTheDocument();
    expect(screen.getByText('Theater Show')).toBeInTheDocument();
    expect(screen.getByText('Sports Event')).toBeInTheDocument();
    expect(screen.getByText('Comedy Show')).toBeInTheDocument();
  });

  test('renders search input with proper accessibility', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('placeholder', 'Search tickets...');
    expect(searchInput).toHaveAttribute('id', 'search-tickets');
  });

  test('renders sort select with proper accessibility', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveValue('price-asc');
    expect(sortSelect).toHaveAttribute('id', 'sort-tickets');
  });

  test('filters tickets by search term (case-insensitive)', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    
    // Search for "concert" (case-insensitive)
    fireEvent.change(searchInput, { target: { value: 'concert' } });
    expect(screen.getByText('Concert Ticket')).toBeInTheDocument();
    expect(screen.queryByText('Movie Ticket')).not.toBeInTheDocument();
    
    // Search for "SHOW" (uppercase)
    fireEvent.change(searchInput, { target: { value: 'SHOW' } });
    expect(screen.getByText('Theater Show')).toBeInTheDocument();
    expect(screen.getByText('Comedy Show')).toBeInTheDocument();
    expect(screen.queryByText('Concert Ticket')).not.toBeInTheDocument();
  });

  test('shows "No tickets found" when search yields no results', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No tickets found.')).toBeInTheDocument();
    expect(screen.queryByText('Concert Ticket')).not.toBeInTheDocument();
  });

  test('sorts tickets by price ascending (default)', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const ticketItems = screen.getAllByRole('listitem');
    const firstTicket = ticketItems[0];
    const lastTicket = ticketItems[ticketItems.length - 1];
    
    expect(firstTicket).toHaveTextContent('Movie Ticket');
    expect(lastTicket).toHaveTextContent('Sports Event');
  });

  test('sorts tickets by price descending', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    const ticketItems = screen.getAllByRole('listitem');
    const firstTicket = ticketItems[0];
    const lastTicket = ticketItems[ticketItems.length - 1];
    
    expect(firstTicket).toHaveTextContent('Sports Event');
    expect(lastTicket).toHaveTextContent('Movie Ticket');
  });

  test('sorts tickets by title alphabetically', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'title-asc' } });
    
    const ticketItems = screen.getAllByRole('listitem');
    const firstTicket = ticketItems[0];
    const lastTicket = ticketItems[ticketItems.length - 1];
    
    expect(firstTicket).toHaveTextContent('Comedy Show');
    expect(lastTicket).toHaveTextContent('Theater Show');
  });

  test('combines search and sort functionality', () => {
    render(<TicketList tickets={mockTickets} />);
    
    // Search for tickets containing "show"
    const searchInput = screen.getByLabelText('Search tickets');
    fireEvent.change(searchInput, { target: { value: 'show' } });
    
    // Sort by price descending
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    const ticketItems = screen.getAllByRole('listitem');
    expect(ticketItems).toHaveLength(2);
    
    // Theater Show should come first (higher price)
    expect(ticketItems[0]).toHaveTextContent('Theater Show');
    expect(ticketItems[1]).toHaveTextContent('Comedy Show');
  });

  test('renders ticket prices with proper formatting', () => {
    render(<TicketList tickets={mockTickets} />);
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Concert Ticket — $25.00';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Movie Ticket — $12.50';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Theater Show — €45.00';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Sports Event — £75.00';
    })).toBeInTheDocument();
  });

  test('handles empty tickets array', () => {
    render(<TicketList tickets={[]} />);
    
    expect(screen.getByText('No tickets found.')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('maintains search state when sorting changes', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const searchInput = screen.getByLabelText('Search tickets');
    fireEvent.change(searchInput, { target: { value: 'ticket' } });
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'title-asc' } });
    
    // Search term should still be "ticket"
    expect(searchInput).toHaveValue('ticket');
    
    // Should still show filtered results
    expect(screen.getByText('Concert Ticket')).toBeInTheDocument();
    expect(screen.getByText('Movie Ticket')).toBeInTheDocument();
    expect(screen.queryByText('Theater Show')).not.toBeInTheDocument();
  });

  test('maintains sort state when search changes', () => {
    render(<TicketList tickets={mockTickets} />);
    
    const sortSelect = screen.getByLabelText('Sort tickets');
    fireEvent.change(sortSelect, { target: { value: 'title-asc' } });
    
    const searchInput = screen.getByLabelText('Search tickets');
    fireEvent.change(searchInput, { target: { value: 'show' } });
    
    // Sort should still be "title-asc"
    expect(sortSelect).toHaveValue('title-asc');
    
    // Results should be filtered and sorted
    const ticketItems = screen.getAllByRole('listitem');
    expect(ticketItems).toHaveLength(2);
    expect(ticketItems[0]).toHaveTextContent('Comedy Show');
    expect(ticketItems[1]).toHaveTextContent('Theater Show');
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
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Free Event — $0.00';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Paid Event — $25.00';
    })).toBeInTheDocument();
  });

  test('handles tickets with decimal prices', () => {
    const ticketsWithDecimals: Ticket[] = [
      { id: '1', title: 'Event 1', price: 12.34, currency: 'USD' },
      { id: '2', title: 'Event 2', price: 99.99, currency: 'EUR' },
    ];
    
    render(<TicketList tickets={ticketsWithDecimals} />);
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Event 1 — $12.34';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Event 2 — €99.99';
    })).toBeInTheDocument();
  });
});
