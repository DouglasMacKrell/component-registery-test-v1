import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderBlocks } from '../src/renderBlocks';

jest.mock('../src/components/Hero', () => () => <div>HeroOK</div>);
jest.mock('../src/components/CardList', () => (props: any) => <div>CardListOK:{props.items?.length ?? 0}</div>);
jest.mock('../src/components/CTA', () => () => <a>CTAOK</a>);

test('renders registered blocks and handles unknown types', () => {
  render(
    <>
      {renderBlocks([
        { type: 'Hero',     props: { title: 'T' } } as any,
        { type: 'CardList', props: { items: [] } } as any,
        { type: 'Wut',      props: {} } as any
      ] as any)}
    </>
  );

  expect(screen.getByText('HeroOK')).toBeInTheDocument();
  expect(screen.getByText(/CardListOK:0/)).toBeInTheDocument();
  expect(screen.getByRole('note')).toHaveTextContent(/Unknown block: Wut/);
});
