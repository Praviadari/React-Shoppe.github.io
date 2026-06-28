import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageLoader from './components/ui/PageLoader';
import {
  COMING_SOON_PATHS,
  HomePage,
  ShopPage,
  ProductDetailPage,
  BuildPage,
  CollectionsPage,
  AboutPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  ComingSoonPage,
  NotFoundPage,
} from './app/routes';

function App() {
  return (
    <CartProvider>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Header />
          <main id="main-content" style={{ flexGrow: 1 }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:slug" element={<ProductDetailPage />} />
                <Route path="/build" element={<BuildPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
                {COMING_SOON_PATHS.map((path) => (
                  <Route key={path} path={path} element={<ComingSoonPage />} />
                ))}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
