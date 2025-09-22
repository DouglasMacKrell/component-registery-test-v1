import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Hello() {
  return <h1>Hello, Ninja</h1>;
}

test('smoke renders', () => {
  render(<Hello />);
  expect(screen.getByText(/hello, ninja/i)).toBeInTheDocument();
});
