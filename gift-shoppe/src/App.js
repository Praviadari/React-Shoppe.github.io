import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SkipLink from './components/ui/SkipLink';
import PageLoader from './components/ui/PageLoader';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
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
  LoginPage,
  SignUpPage,
  AccountPage,
  WishlistPage,
  ConciergePage,
  CorporatePage,
  AdminPage,
  FaqPage,
  ShippingPage,
  ContactPage,
  TrackOrderPage,
  PrivacyPage,
  TermsPage,
  SearchPage,
  SupportPage,
  CareersPage,
  PressPage,
  SustainabilityPage,
  ComingSoonPage,
  NotFoundPage,
} from './app/routes';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <SkipLink />
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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                      path="/account"
                      element={(
                        <ProtectedRoute>
                          <AccountPage />
                        </ProtectedRoute>
                      )}
                    />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/concierge" element={<ConciergePage />} />
                    <Route path="/corporate" element={<CorporatePage />} />
                    <Route
                      path="/admin"
                      element={(
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      )}
                    />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/track" element={<TrackOrderPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/press" element={<PressPage />} />
                    <Route path="/sustainability" element={<SustainabilityPage />} />
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
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
