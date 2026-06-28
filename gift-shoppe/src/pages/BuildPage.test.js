import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider } from '../context/CartContext';
import BuildPage from './BuildPage';

const renderWithCart = (ui) => render(<CartProvider>{ui}</CartProvider>);

describe('BuildPage Security & Functional Tests', () => {
  it('SEC-001: Strips malicious XSS tags from Engraving input', () => {
    renderWithCart(<BuildPage />);

    const input = screen.getByPlaceholderText('Enter name (Letters/Numbers only)');
    const maliciousPayload = "<script>alert('xss')</script>John-Doe!";

    fireEvent.change(input, { target: { value: maliciousPayload } });

    expect(input.value).toBe('scriptalertxssscriptJohn-Doe');

    const livePreviewText = screen.queryByText(/scriptalert/i);
    expect(livePreviewText).toBeInTheDocument();
  });

  it('FUNC-002: Base Price calculation updates properly', () => {
    renderWithCart(<BuildPage />);

    expect(screen.getByText('₹500')).toBeInTheDocument();

    const baseItemSelect = screen.getByLabelText(/Select Base Item/i);
    fireEvent.change(baseItemSelect, { target: { value: 'premium-watch' } });

    expect(screen.getByText('₹1200')).toBeInTheDocument();

    const materialSelect = screen.getByLabelText(/Choose Material/i);
    fireEvent.change(materialSelect, { target: { value: 'crystal' } });

    expect(screen.getByText('₹1800')).toBeInTheDocument();
  });

  it('FUNC-003: Submitting shows success toast', () => {
    renderWithCart(<BuildPage />);

    const button = screen.getByRole('button', { name: /Add Custom Build to Cart/i });
    fireEvent.click(button);

    expect(screen.getByText('Item Successfully Added to Cart!')).toBeInTheDocument();
  });
});
