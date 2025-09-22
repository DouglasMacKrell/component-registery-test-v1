import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../app/page';

test('renders the demo page title', () => {
  render(<Page />);
  // your mockPage has a `pageTitle`—this checks that it shows up
  expect(screen.getByText(/Hot Tickets Tonight/i)).toBeInTheDocument();
});