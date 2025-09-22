import { transformTickets } from '../src/lib/transformTickets';

describe('transformTickets', () => {
  test('transforms valid ticket data correctly', () => {
    const input = [
      { id: 1, title: 'Concert Ticket', price_cents: 1234, currency: 'USD' },
      { id: '2', title: 'Movie Ticket', price_cents: 1500, currency: 'EUR' },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Concert Ticket', price: 12.34, currency: 'USD' },
      { id: '2', title: 'Movie Ticket', price: 15.00, currency: 'EUR' },
    ]);
  });

  test('handles null/undefined title with default', () => {
    const input = [
      { id: 1, title: null, price_cents: 1234, currency: 'USD' },
      { id: 2, title: undefined, price_cents: 1500, currency: 'EUR' },
      { id: 3, title: '', price_cents: 2000, currency: 'GBP' },
      { id: 4, title: '   ', price_cents: 2500, currency: 'USD' },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Untitled', price: 12.34, currency: 'USD' },
      { id: '2', title: 'Untitled', price: 15.00, currency: 'EUR' },
      { id: '3', title: 'Untitled', price: 20.00, currency: 'GBP' },
      { id: '4', title: 'Untitled', price: 25.00, currency: 'USD' },
    ]);
  });

  test('handles invalid/missing price_cents with default', () => {
    const input = [
      { id: 1, title: 'Ticket 1', price_cents: null, currency: 'USD' },
      { id: 2, title: 'Ticket 2', price_cents: undefined, currency: 'EUR' },
      { id: 3, title: 'Ticket 3', price_cents: 'invalid', currency: 'GBP' },
      { id: 4, title: 'Ticket 4', price_cents: NaN, currency: 'USD' },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Ticket 1', price: 0, currency: 'USD' },
      { id: '2', title: 'Ticket 2', price: 0, currency: 'EUR' },
      { id: '3', title: 'Ticket 3', price: 0, currency: 'GBP' },
      { id: '4', title: 'Ticket 4', price: 0, currency: 'USD' },
    ]);
  });

  test('handles unknown currency with USD default', () => {
    const input = [
      { id: 1, title: 'Ticket 1', price_cents: 1000, currency: 'CAD' },
      { id: 2, title: 'Ticket 2', price_cents: 2000, currency: 'JPY' },
      { id: 3, title: 'Ticket 3', price_cents: 3000, currency: null },
      { id: 4, title: 'Ticket 4', price_cents: 4000, currency: undefined },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Ticket 1', price: 10.00, currency: 'USD' },
      { id: '2', title: 'Ticket 2', price: 20.00, currency: 'USD' },
      { id: '3', title: 'Ticket 3', price: 30.00, currency: 'USD' },
      { id: '4', title: 'Ticket 4', price: 40.00, currency: 'USD' },
    ]);
  });

  test('filters out entries with missing id', () => {
    const input = [
      { id: 1, title: 'Valid Ticket', price_cents: 1000, currency: 'USD' },
      { id: null, title: 'Invalid Ticket', price_cents: 2000, currency: 'EUR' },
      { id: undefined, title: 'Invalid Ticket 2', price_cents: 3000, currency: 'GBP' },
      { id: 2, title: 'Another Valid Ticket', price_cents: 4000, currency: 'USD' },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Valid Ticket', price: 10.00, currency: 'USD' },
      { id: '2', title: 'Another Valid Ticket', price: 40.00, currency: 'USD' },
    ]);
  });

  test('handles non-array input by returning empty array', () => {
    expect(transformTickets(null)).toEqual([]);
    expect(transformTickets(undefined)).toEqual([]);
    expect(transformTickets('not an array')).toEqual([]);
    expect(transformTickets(123)).toEqual([]);
    expect(transformTickets({})).toEqual([]);
  });

  test('handles empty array', () => {
    const result = transformTickets([]);
    expect(result).toEqual([]);
  });

  test('ignores extra fields in input', () => {
    const input = [
      { 
        id: 1, 
        title: 'Ticket with extras', 
        price_cents: 1000, 
        currency: 'USD',
        extraField: 'should be ignored',
        anotherField: 123
      },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Ticket with extras', price: 10.00, currency: 'USD' },
    ]);
  });

  test('handles mixed valid and invalid entries', () => {
    const input = [
      { id: 1, title: 'Valid Ticket', price_cents: 1000, currency: 'USD' },
      { id: null, title: 'Invalid - no id', price_cents: 2000, currency: 'EUR' },
      { id: 2, title: '', price_cents: null, currency: 'CAD' },
      { id: 3, title: 'Another Valid', price_cents: 3000, currency: 'GBP' },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Valid Ticket', price: 10.00, currency: 'USD' },
      { id: '2', title: 'Untitled', price: 0, currency: 'USD' },
      { id: '3', title: 'Another Valid', price: 30.00, currency: 'GBP' },
    ]);
  });

  test('converts price_cents to dollars correctly', () => {
    const input = [
      { id: 1, title: 'Ticket 1', price_cents: 1234, currency: 'USD' },
      { id: 2, title: 'Ticket 2', price_cents: 0, currency: 'EUR' },
      { id: 3, title: 'Ticket 3', price_cents: 999, currency: 'GBP' },
    ];

    const result = transformTickets(input);

    expect(result).toEqual([
      { id: '1', title: 'Ticket 1', price: 12.34, currency: 'USD' },
      { id: '2', title: 'Ticket 2', price: 0.00, currency: 'EUR' },
      { id: '3', title: 'Ticket 3', price: 9.99, currency: 'GBP' },
    ]);
  });
});
