import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

test('renders the demo page title', () => {
  render(<App />);
  // your mockPage has a `pageTitle`—this checks that it shows up
  expect(screen.getByText(/Hot Tickets Tonight/i)).toBeInTheDocument();
});