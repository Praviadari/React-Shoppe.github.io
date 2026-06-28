import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import ProductCard from './ProductCard';

const renderWithCart = (ui) =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>{ui}</CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('ProductCard Functional Tests', () => {
  const mockProduct = {
    id: 1,
    slug: 'test-gift-item-1',
    name: 'Test Gift Item',
    price: 49.99,
    category: 'Gifts',
    image: 'mock-image.jpg',
  };

  it('FUNC-004: Renders product information correctly', () => {
    renderWithCart(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Gift Item')).toBeInTheDocument();
    expect(screen.getByText('₹49.99')).toBeInTheDocument();
    expect(screen.getByText('Gifts')).toBeInTheDocument();
  });

  it('FUNC-005: Add to Cart button toggles state temporarily', async () => {
    renderWithCart(<ProductCard product={mockProduct} />);

    const button = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /Added •/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
    }, { timeout: 2500 });
  });
});
